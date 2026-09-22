# Railway

How GuitarFinder is deployed to production. See
[ARCHITECTURE.md](./ARCHITECTURE.md#1-system-overview) for how this fits into the wider
system, and [README.md](./README.md) for the local Docker Compose / manual setup paths
— this file is production-deployment only.

You (the project owner) manage this entirely through the Railway web dashboard — no
Railway CLI is used for this project.

---

## 1. Topology: two independent services, one repo

| Railway service | Builds from | Public URL |
|---|---|---|
| `guitar-finder-ver-1` (backend) | `backend/` (its own `Dockerfile`) | internal only — reached via the frontend's proxy, not called directly by end users |
| `GF` (frontend) | `frontend/` (its own `Dockerfile`) | `https://giutarfinder.up.railway.app` |

Both services are configured in the Railway dashboard to build from this same GitHub
repo, each with its **root directory** set to its own folder (`backend/` or
`frontend/`) so Railway picks up the right `Dockerfile` for each. There's no
`railway.json`/`railway.toml` in the repo — build settings live entirely in the
dashboard, not in version control.

A push to `master` (see `.git` remote) triggers Railway to rebuild and redeploy both
services independently — there's no single "deploy the app" step; each service redeploys
on its own schedule whenever its build finishes.

**MongoDB is not a Railway service.** Production uses a **MongoDB Atlas** cluster,
external to Railway — `MONGODB_CONNECTION_STRING` on the backend service just points at
the Atlas connection string, set directly in the Railway dashboard. This differs from
local Docker Compose, which runs its own `mongo:7` container instead (see
`docker-compose.yml`).

---

## 2. Backend service (`guitar-finder-ver-1`)

- Dockerfile: multi-stage — `npm ci && npm run build` (TypeScript → `dist/`) in a
  builder stage, then a slim runtime stage that only installs prod deps and copies
  `dist/`. `EXPOSE 4000`, `CMD ["node", "dist/app.js"]`.
- Railway assigns the actual public/internal port dynamically via its own `PORT` env
  var; the app already reads `process.env.PORT` (`app-config.ts`, falling back to
  `4000` only when unset), so no code change is needed for Railway's port injection —
  it just works.
- `app.ts` calls `server.set("trust proxy", 1)` specifically because Railway terminates
  TLS and proxies requests to the container — without this, `express-rate-limit` would
  rate-limit Railway's proxy IP instead of the real client IP (see
  [ARCHITECTURE.md §1](./ARCHITECTURE.md#1-system-overview)).
- Required env vars set in the Railway dashboard: `MONGODB_CONNECTION_STRING` (Atlas),
  `JWT_SECRET_KEY`, `OPENAI_API_KEY`, `CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/
  `CLOUDINARY_API_SECRET` (see [CLOUDINARY.md](./CLOUDINARY.md)). Optional ones
  (`REVERB_API_TOKEN`, `EBAY_CLIENT_ID`/`SECRET`, `ETSY_API_KEY`, every
  `*_RATE_LIMIT_*` var, `CORS_ALLOWED_ORIGINS`) are documented in README's Environment
  Variables table.

---

## 3. Frontend service (`GF`)

- Dockerfile: builds the Vite app (`npm run build`) in one stage, then serves the static
  `dist/` output with `nginx:alpine` in the runtime stage.
- nginx (`frontend/nginx.conf.template`) listens on **`8080`**, not the default `80` —
  this was a deliberate fix for Railway (commit `d2b783e "fix nginx port to 8080 for
  Railway"`); Railway's edge routes to whatever port the container's process actually
  listens on.
- **`/api/` and `/uploads/` requests are reverse-proxied by nginx to the backend**, with
  the target driven by a `${BACKEND_ORIGIN}` variable:
  ```
  proxy_pass ${BACKEND_ORIGIN}/api/;
  ```
  The file is a **template** (`.template` suffix, copied to
  `/etc/nginx/templates/default.conf.template` in the Dockerfile), rendered into the
  real nginx config at container start by nginx's own built-in envsubst hook
  (`/docker-entrypoint.d/20-envsubst-on-templates.sh`, part of the `nginx:alpine`
  image — no extra tooling needed). `NGINX_ENVSUBST_FILTER=^BACKEND_ORIGIN$` restricts
  substitution to that one variable, so nginx's own `$remote_addr`/`$uri`/`$proxy_host`
  tokens elsewhere in the template are left as-is (unfiltered envsubst replaces *any*
  `$name`-shaped token with an empty string if there's no matching env var — a common
  way this kind of templating silently breaks).
  - The **Dockerfile** sets the default: `ENV BACKEND_ORIGIN=https://guitar-finder-ver-1-production-396a.up.railway.app`
    — so the image Railway builds targets the backend's public URL, same as any outside
    client would reach it. This was a deliberate choice (commit `0e9396e "fix nginx
    proxy: use public backend URL instead of private network (was timing out)"`) —
    proxying over Railway's private network between services was timing out in
    practice. **Trade-off:** an extra public network hop (frontend container → internet
    → Railway edge → backend container) instead of an internal one; if the backend's
    Railway-assigned public URL ever changes, this default needs a manual update and
    rebuild.
  - **`docker-compose.yml`** overrides it to `BACKEND_ORIGIN: http://backend:4000`, so
    local Compose talks to its own `backend` container over Docker's internal network
    instead of production — this is what makes a fully-local stack via Compose actually
    work end-to-end.
- The frontend build also sets `ENV VITE_API_ADDRESS=""` at build time (empty string),
  so the frontend's own `axios` calls go to relative `/api/...` paths — which nginx then
  proxies as described above, rather than the frontend calling the backend directly.

---

## 4. Operating notes

- **No CLI access to this project** — everything (logs, env vars, redeploys, usage
  limits) goes through the Railway web dashboard. When debugging a production issue,
  the dashboard's build/deploy logs are the primary source of truth; paste relevant log
  output here rather than expecting a live CLI session.
- **Spending controls**: a Compute usage hard limit and email alert are configured at
  the workspace level (Settings → Usage → Set limits) — currently $20 hard limit / $15
  alert. This stops **all** resources across every project in the workspace (including
  the unrelated `vacation-app` project) if hit, not just GuitarFinder.
- **Redeploys are automatic on push** to `master` for both services — there's no manual
  "deploy" button used in the normal workflow, and no staging environment; every push to
  `master` goes straight to what's live at giutarfinder.up.railway.app.
