# Architecture

This document describes how GuitarFinder is put together: the runtime topology, the
backend request pipeline, the frontend state model, the external integrations, and the
data model. See [README.md](./README.md) for features, setup, and the API endpoint list.

---

## 1. System overview

Three services, one repo:

```
┌─────────────────────┐        ┌──────────────────────┐        ┌─────────────┐
│  frontend            │──────▶│  backend               │──────▶│  MongoDB    │
│  React 18 + Vite      │  /api │  Express + TypeScript   │       │  (Mongoose) │
│  served by nginx      │       │  single Node process     │      └─────────────┘
│  (Docker) or Vite dev │       │  (port 4000 internal)    │
└─────────────────────┘        └──────────┬───────────────┘
                                            │ calls out to six external APIs
                                            ▼
```

- **Reverb API** — marketplace listings; active.
- **eBay Buy Browse API** — marketplace listings; code-complete but **inactive** — the
  eBay developer account registration was rejected, integration on hold (see Known
  gaps).
- **Etsy Open API v3** — marketplace listings; code-complete; app registered and
  awaiting Etsy's approval (see Known gaps).
- **OpenAI API** — GuitarGod chat, `gpt-4o-mini`.
- **OpenStreetMap** (Nominatim + Overpass) — store search.
- **Cloudinary** — avatar image storage.

- **Local dev (manual setup):** Vite dev server on `:5173` talking directly to the
  backend on `:4000`; MongoDB running locally or on Atlas.
- **Local dev (Docker Compose):** `nginx` (frontend container) on `:80` proxies `/api`
  to the `backend` container on its internal network; `mongodb` is a `mongo:7` container
  with a named volume. See `docker-compose.yml`.
- **Production (Railway):** two separate Railway services — backend
  (`guitar-finder-ver-1`) and frontend (`GF`, public at
  `https://giutarfinder.up.railway.app`) — each deployed independently of the other,
  both built from this repo. Railway terminates TLS and proxies to the backend, which is why `app.ts` sets
  `server.set("trust proxy", 1)` (so `express-rate-limit` sees the real client IP, not
  Railway's).

---

## 2. Backend

### 2.1 Layering

`controllers/` (HTTP + routing) → `services/` (business logic + external calls) →
`models/` (Mongoose schemas). Controllers are thin: parse the request, call one service
method, shape the response, `next(error)` on failure. All business logic — including
calls to third-party APIs — lives in services, never in controllers.

Everything is a singleton class instance exported from its module (`export const
fooController = new FooController()`), not a DI container. Each controller owns its own
`express.Router()` and is mounted directly in `app.ts`.

### 2.2 Request pipeline (`backend/src/app.ts`)

In order, every request passes through:

1. `helmet()` — security headers on every response.
2. CORS allowlist — origin checked against `appConfig.allowedOrigins`
   (`CORS_ALLOWED_ORIGINS` env var, comma-separated); non-listed origins are rejected.
   Requests with no `Origin` header (server-to-server, curl) are allowed through.
3. `express.json()` body parsing.
4. `/uploads` static file serving (legacy local-disk avatar storage; see 2.4).
5. `loggerMiddleware.consoleLog` — request logging.
6. `rateLimitMiddleware.general` on all `/api/*` routes (see 2.3).
7. Feature routers, mounted in this order: auth, chat, user, store, reverb, eBay, etsy,
   followed, statistic.
8. `errorMiddleware.serverError` then `errorMiddleware.catchAll` — centralized error
   handling; controllers never write error responses themselves, they call `next(error)`
   and let these two middleware translate `client-error.ts` types into status codes.

Mongoose connects once at startup (`await mongoose.connect(...)`) before the server
starts listening.

### 2.3 Auth & rate limiting

- **Auth is stateless JWT**, signed with `JWT_SECRET_KEY`, 3-hour expiry. There is no
  server-side session store — `authMiddleware.validateToken` just verifies the
  signature; `followed.controller.ts` and others decode the token's `_id` claim
  directly with `jwt.decode` (no DB round-trip) to identify the caller. `validateAdmin`
  additionally checks the `isAdmin` claim embedded in the token at login/register time.
- **Rate limiting** is tiered via `express-rate-limit`, all thresholds env-configurable
  (see README's Environment Variables table) so they can be tightened instantly during
  an attack without redeploying:
  - `general` — applied to all `/api/*` traffic.
  - `auth` — tighter, applied only to `/api/auth/register` and `/api/auth/login`,
    `skipSuccessfulRequests: true` (only failed attempts count, to avoid locking out
    legitimate users who just logged in a lot).
  - `chat` — tighter, applied only to `/api/chat`, since each request costs an OpenAI
    call.
  - `ingest` — tightest (default 3 per 15 min), applied only to `/api/stats/ingest`
    (also admin-gated — see 2.6), since each call fans out to dozens of Reverb API
    calls.

### 2.4 File uploads (transitional state)

Two upload paths currently coexist:

- `multer.config.ts` + `multer-storage-cloudinary` — the current path. Profile images
  uploaded via `/api/auth/register` and `/api/users/:id` go straight to Cloudinary;
  `user.controller.ts` also deletes the old Cloudinary asset when a user replaces their
  avatar.
- `express.static("uploads")` + a local `uploads/` directory — legacy local-disk
  storage, kept mounted in `app.ts` so old `profileImage` URLs pointing at
  `/uploads/...` (from before the Cloudinary migration) still resolve. Any file left in
  `backend/uploads/` on disk is not persisted between Railway deploys; in Docker Compose
  it's persisted via the `uploads-data` volume for the same backwards-compat reason.

### 2.5 External integrations

| Integration | Service file | Notes |
| --- | --- | --- |
| Reverb marketplace | `reverb.service.ts` | Listing search by query string. No caching in the backend service itself — caching happens in `statistic.service.ts` (stats) and on the frontend (5 min TTL). Requires `REVERB_API_TOKEN`; throws if unset. |
| eBay marketplace | `ebay.service.ts` | Listing source. Code-complete but inactive: `EBAY_CLIENT_ID`/`EBAY_CLIENT_SECRET` are unset because the eBay developer account registration was rejected; not currently being pursued. OAuth2 client-credentials flow, in-memory token cache keyed by expiry. Returns `503` with a specific message when credentials are missing. |
| Etsy marketplace | `etsy.service.ts` | Listing source. Code-complete; `ETSY_API_KEY` (format `keystring:sharedsecret`) unset in prod pending Etsy's approval of the registered app. Static `x-api-key` header, no OAuth. Appends "guitar" to the search keywords server-side since Etsy is a general marketplace, not gear-specific. Returns `503` with a specific message when the key is missing. |
| OpenAI (GuitarGod chat) | `chat.service.ts` | `gpt-4o-mini`; system prompt hardcodes the "GuitarGod" persona, forwards client-supplied `history` as prior turns. No server-side persistence — history lives in the frontend (`chatState`, localStorage) and is replayed on every request. |
| OpenStreetMap (store search) | `store.service.ts` | Two-step: geocode city via Nominatim, then query Overpass for `shop=musical_instrument` nodes/ways within 15km. Overpass has no SLA, so the service races three public mirrors with `Promise.any`. 10-minute in-memory cache keyed by city. |
| Cloudinary (avatar storage) | `cloudinary.config.ts` | Configured once at module load from `CLOUDINARY_*` env vars. Used by `multer.config.ts` and directly in `user.controller.ts` for asset deletion. |

### 2.6 Statistics pipeline

`statistic.service.ts` is a two-phase batch/read system, not live aggregation:

1. **Ingest** (`POST /api/stats/ingest`, admin-only — `authMiddleware.validateAdmin` +
   the `ingest` rate limit tier, see 2.3): given a list of
   `{ brand, models[] }`, fetches up to 50 Reverb listings per brand, 10 brands at a
   time in parallel. Each listing's title is matched against the brand's known model
   names, then upserted into the `listing-stats` collection via `bulkWrite` — so
   re-running ingest is idempotent per `listingId`.
2. **Read** (`GET /api/stats`) — five Mongo aggregation pipelines run in parallel
   (by-brand, by-condition, top models, price histogram, by-brand-and-condition) plus a
   10-minute in-process cache (invalidated on every ingest) so the stats page doesn't
   hammer Mongo on every load.

There is no scheduler — ingest is triggered manually/externally by calling the endpoint.

---

## 3. Frontend

### 3.1 Structure

- **Routing** (`utils/Routing.tsx`) — `react-router-dom`, flat route table. Protected
  routes are wrapped in `PrivateRoute`, which redirects to `/login` when there's no
  token in `authStore`.
- **Components** (`component/`) — one folder per page/widget, each with its own
  `.tsx` + `.css` (CSS Modules-style, co-located, no shared design-system library).
  `App.tsx` renders the persistent chrome (`Header`, `Footer`, floating `ChatbotWidget`,
  `UserAvatar`) around whatever `Routing` renders.
- **Services** (`services/`) — one per backend resource (`auth`, `chat`, `followed`,
  `reverb`, `ebay`, `etsy`, `store`, `statistic`), each a thin axios wrapper. The three
  listing services (`reverb`, `ebay`, `etsy`) each hold their own 5-minute in-memory
  `Map`-based cache and normalize their provider's raw response shape into the shared
  `IListing` type, independent of the backend's caching.
- **Models** (`models/`) — TypeScript interfaces mirroring backend DTOs/schemas
  (`IUser`, `IListing`, `IMessage`, `IStore`), kept manually in sync (no shared/generated
  types package between frontend and backend). `IListing` is source-tagged
  (`source: 'reverb' | 'ebay' | 'etsy'`) so `GuitarsPage` can merge all three into one
  grid via `Promise.allSettled` — a source with no/invalid credentials just contributes
  zero results instead of breaking the page.

### 3.2 State: three independent Redux stores, not one root store

Unusually, this app does **not** use a single `combineReducers` root store. Instead
`auth.state.ts`, `chat.state.ts`, and `store.state.ts` each call `configureStore`
independently with their own single reducer, and components import whichever store(s)
they need. Each state class's constructor also seeds itself from `localStorage`
(`token`, `chatState`), so auth and chat history survive a page refresh without any
backend persistence:

- **`authStore`** — current `user` (decoded from the JWT) + `token`. `jwtDecode` is
  used both at store-init and after every login/register/profile-update action, so the
  "user" object in state is always exactly what's embedded in the current JWT claims —
  there's no separate `/me` fetch.
- **`chatStore`** — GuitarGod message history, persisted to `localStorage.chatState` on
  every `AddMessage`. This is why chat "remembers" past sessions in the browser even
  though the backend is stateless per-request.
- **`store.state.ts`** — the third store (guitar/brand browsing UI state).

### 3.3 Auth flow

1. Register/login posts credentials (+ optional avatar file) to the backend, gets back a
   signed JWT.
2. `AuthActionType.Login`/`Register`/`UpdateProfile` all do the same thing: decode the
   JWT client-side, store it in `localStorage`, and set it as the default
   `Authorization: Bearer` header on the shared axios instance for all future requests.
3. Logout clears all three.
4. Because the "user" in state is just the decoded JWT payload, a profile edit requires
   the backend to issue a **new** JWT (see `user.controller.ts`) — there's no way to
   mutate `state.user` without a fresh token, by design.

---

## 4. Data model (MongoDB / Mongoose)

| Collection | Model | Purpose | Notable constraints |
| --- | --- | --- | --- |
| `users` | `UserModel` | Account + profile | `email` unique; `password` is a bcrypt hash; `isAdmin` always server-set |
| `followed-listings` | `FollowedListingModel` | Per-user watchlist entry; a denormalized snapshot of a listing, not live-synced | Compound unique index on `(userId, listingId)`; `source` distinguishes `reverb` / `ebay` / `etsy` origin |
| `listing-stats` | `ListingStatModel` | Ingested snapshot of Reverb listings for the stats/analytics page | `listingId` unique, used as the upsert key on re-ingestion; indexed on `brand`, `condition`, `(brand, guitarModel)`, `price`, `ingestedAt` |

Note that `followed-listings` and `listing-stats` both store **snapshots**, not live
references — a followed listing's price shown in the watchlist won't update if the
Reverb price changes after the user followed it, and stats reflect whenever `/ingest`
was last run, not real-time market state.

---

## 5. Known gaps / in-flight work

- **eBay integration** is code-complete (`ebay.controller.ts` / `ebay.service.ts` /
  frontend `ebay.service.ts`) but inactive: the eBay developer account registration was
  rejected ("problems with the data provided or other irregularities" — a known,
  widely-reported issue on eBay's community forums, not specific to this project).
  `EBAY_CLIENT_ID`/`EBAY_CLIENT_SECRET` are unset, so `/api/ebay` currently returns
  `503`. Not currently being pursued further; eBay's account-support form for rejected
  registrations (`developer.ebay.com/support/developer-account-support` → "My account
  registration was rejected") is a known unused option if revisited.
- **Etsy integration** is code-complete (`etsy.controller.ts` / `etsy.service.ts` /
  frontend `etsy.service.ts`) and was pursued as the practical alternative to eBay. An
  app ("guitarfinder") has been registered and is awaiting Etsy's approval —
  `ETSY_API_KEY` is unset, so `/api/etsy` currently returns `503`. Once approved, set
  `ETSY_API_KEY=keystring:sharedsecret` in the backend env.
- ~~`POST /api/stats/ingest` had no auth or dedicated rate limit~~ — fixed: now gated
  behind `authMiddleware.validateAdmin` plus its own `rateLimitMiddleware.ingest` tier
  (`INGEST_RATE_LIMIT_MAX`/`_WINDOW_MS`, default 3 per 15 min per IP), same pattern as
  `auth`/`chat`.
- **Profile update can throw `ERR_HTTP2_PROTOCOL_ERROR`** on an expired token or an
  oversized image upload — not yet root-caused/fixed.
- **Legacy local-disk `uploads/` path** (section 2.4) is dead weight now that Cloudinary
  is the primary avatar store; only kept for backwards compatibility with
  already-issued URLs.
