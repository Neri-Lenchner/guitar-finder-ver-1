    # GuitarFinder

A guitar discovery platform built around one idea: finding the right guitar should be
effortless. GuitarFinder makes searching intuitive — go from a brand to the exact model
you're after in a few clicks, browse live Reverb listings, compare real prices, and save
guitars to your personal watchlist. Need help along the way? GuitarGod, the built-in AI
guitar expert, is always there to guide you. Explore 40 iconic guitar brands, discover
music stores around the world, and dig into live market analytics with interactive charts.

**Live:** https://giutarfinder.up.railway.app

> **Marketplace status:** Reverb is live. eBay and Etsy are integrated in code
> (`/api/ebay`, `/api/etsy`) but not active in production — eBay's developer account
> was rejected (appeal submitted, awaiting reply) and Etsy's app was banned. See
> [ARCHITECTURE.md](./ARCHITECTURE.md#5-known-gaps--in-flight-work) for details.

---

## Features

- **3D Brand Carousel** — spinning 3D carousel on the home page showcasing guitar brands
- **Guitar Catalog** — browse 40 brands and their models with live listing images
- **Multi-Marketplace Integration** — real listings merged from Reverb, eBay, and Etsy in one grid, each tagged with its source, with price, condition, and photos
- **My Guitars (Watchlist)** — save and manage followed listings from any source, persisted to MongoDB
- **Find Music Stores** — search music instrument stores worldwide via OpenStreetMap
- **GuitarGod** — floating AI chat assistant powered by OpenAI, with full conversation context and chat history persistence
- **Authentication** — register, login, profile editing with avatar upload
- **Market Statistics** — live guitar market data from Reverb with bar/doughnut charts (avg price by brand, price distribution, top models, listings by condition)
- **Client-side Caching** — 5-minute cache on Reverb/eBay/Etsy and store API calls
- **Rate Limiting** — per-IP request limits on the API, with tighter limits on login/register and GuitarGod chat; thresholds are env-configurable so they can be tightened instantly during an attack, no redeploy needed
- **Hardened HTTP Layer** — Helmet security headers on every response, plus a CORS allowlist restricting the API to known frontend origins
- **PWA Support** — installable as a home screen app on mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | CSS Modules |
| State | Redux Toolkit |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT |
| Security | Helmet, CORS allowlist, express-rate-limit |
| AI | OpenAI API |
| Marketplace | Reverb API, eBay Browse API, Etsy Open API v3 |
| Maps | OpenStreetMap / Overpass API |
| Charts | Chart.js, react-chartjs-2 |
| Deployment | Docker, Docker Compose, nginx |

---

## Project Structure

```
guitar-finder/
├── frontend/
│   └── src/
│       ├── assets/
│       ├── component/
│       │   ├── ChatbotPage/
│       │   ├── ChatbotWidget/
│       │   ├── EditProfilePage/
│       │   ├── GuitarsPage/
│       │   ├── HomeCarousel/
│       │   ├── HomePage/
│       │   ├── LoginPage/
│       │   ├── RegisterPage/
│       │   ├── SearchPage/
│       │   ├── StatisticsPage/
│       │   ├── StoreCard/
│       │   ├── UserAvatar/
│       │   ├── WatchlistPage/
│       │   └── layout/ (Header, Footer)
│       ├── data/
│       │   └── guitars.json
│       ├── models/
│       ├── services/
│       ├── state/
│       └── utils/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── dto/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## Docker (Recommended)

The easiest way to run the full stack is with Docker Compose.

### Prerequisites

- Docker & Docker Compose

### Setup

```bash
# Copy and fill in your secrets
cp .env.example .env

# Build and start all services (frontend, backend, MongoDB)
docker compose up --build
```

The app will be available at `http://localhost:80`.

| Service | Role |
|---|---|
| `frontend` | nginx serves the Vite build, proxies `/api` to backend |
| `backend` | compiled Node.js API on port 4000 (internal) |
| `mongodb` | MongoDB 7, data persisted in a named volume |

---

## Manual Setup

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- OpenAI API key
- Reverb personal access token (optional)
- eBay Browse API production keys (optional)
- Etsy Open API v3 key (optional)

### 1. Clone the repository

```bash
git clone <repo-url>
cd guitar-finder
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=4000
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/guitar-finder
JWT_SECRET_KEY=your_secret_key_here
OPENAI_API_KEY=your_openai_key_here
REVERB_API_TOKEN=your_reverb_token_here
EBAY_CLIENT_ID=your_ebay_client_id_here
EBAY_CLIENT_SECRET=your_ebay_client_secret_here
ETSY_API_KEY=your_etsy_keystring:your_etsy_shared_secret
```

Start the backend:

```bash
npm start
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_CONNECTION_STRING` | Yes | MongoDB connection URI |
| `JWT_SECRET_KEY` | Yes | Secret key for signing JWTs |
| `OPENAI_API_KEY` | Yes | OpenAI API key for GuitarGod |
| `REVERB_API_TOKEN` | No | Reverb personal access token for listings |
| `EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` | No | eBay Browse API production keys for listings |
| `ETSY_API_KEY` | No | Etsy Open API v3 key, formatted `keystring:sharedsecret`, for listings |
| `PORT` | No | Backend port (default: 4000) |
| `GENERAL_RATE_LIMIT_MAX` / `_WINDOW_MS` | No | Requests per window per IP across the API (default: 300 / 15 min) |
| `AUTH_RATE_LIMIT_MAX` / `_WINDOW_MS` | No | Login/register attempts per window per IP (default: 10 / 15 min) |
| `CHAT_RATE_LIMIT_MAX` / `_WINDOW_MS` | No | GuitarGod messages per window per IP (default: 20 / 15 min) |
| `INGEST_RATE_LIMIT_MAX` / `_WINDOW_MS` | No | `/api/stats/ingest` calls per window per IP (default: 3 / 15 min) |
| `CORS_ALLOWED_ORIGINS` | No | Comma-separated list of origins allowed to call the API |

> **Note:** The `.env` file is in `.gitignore` and should never be committed.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login |
| PUT | `/api/users/:id` | Yes | Update profile |
| GET | `/api/stores?city=...` | No | Find music stores by city |
| GET | `/api/reverb?query=...` | No | Search Reverb listings |
| GET | `/api/ebay?query=...` | No | Search eBay listings |
| GET | `/api/etsy?query=...` | No | Search Etsy listings |
| POST | `/api/chat` | Yes | Send message to GuitarGod |
| GET | `/api/followed` | Yes | Get user's followed listings |
| POST | `/api/followed` | Yes | Follow a listing |
| DELETE | `/api/followed/:listingId` | Yes | Unfollow a listing |
| GET | `/api/stats` | No | Get aggregated market statistics |
| POST | `/api/stats/ingest` | Admin | Fetch and store Reverb listings for all brands |

---

## Guitar Brands

The catalog includes 40 brands: Fender, Gibson, Taylor, Martin, PRS, Ibanez, Yamaha, Gretsch, ESP, Epiphone, Schecter, Jackson, Rickenbacker, Guild, Takamine, Music Man, Charvel, Dean, BC Rich, D'Angelico, Washburn, Ovation, Kramer, Godin, Squier, Parker, Reverend, Collings, Duesenberg, Hagstrom, Strandberg, Suhr, Tom Anderson, Kiesel, Mayones, Ormsby, Solar, Eastman, Breedlove, Cort.
