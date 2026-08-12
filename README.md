    # GuitarFinder

An AI-powered guitar discovery platform. Browse 25 guitar brands and their models, find real listings on Reverb, save favourites to your personal watchlist, locate music stores near you, and chat with an AI guitar assistant.

---

## Features

- **3D Brand Carousel** — spinning 3D carousel on the home page showcasing guitar brands
- **Guitar Catalog** — browse 25 brands and their models with live Reverb listing images
- **Reverb Integration** — real marketplace listings with price, condition, and photos
- **My Guitars (Watchlist)** — save and manage followed Reverb listings, persisted to MongoDB
- **Find Music Stores** — search music instrument stores worldwide via OpenStreetMap
- **GuitarBot** — floating AI chat assistant powered by OpenAI, with chat history persistence
- **Authentication** — register, login, profile editing with avatar upload
- **Client-side Caching** — 5-minute cache on Reverb and store API calls

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
| AI | OpenAI API |
| Marketplace | Reverb API |
| Maps | OpenStreetMap / Overpass API |

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
│       │   ├── StoreCard/
│       │   ├── WatchlistPage/
│       │   └── layout/ (Header, Footer)
│       ├── data/
│       │   └── guitars.json
│       ├── models/
│       ├── services/
│       ├── state/
│       └── utils/
└── backend/
    └── src/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── services/
        └── utils/
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- OpenAI API key
- Reverb personal access token (optional)

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
```

Start the backend:

```bash
npm run dev
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
| `OPENAI_API_KEY` | Yes | OpenAI API key for GuitarBot |
| `REVERB_API_TOKEN` | No | Reverb personal access token for listings |
| `PORT` | No | Backend port (default: 4000) |

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
| POST | `/api/chat` | No | Send message to GuitarBot |
| GET | `/api/followed` | Yes | Get user's followed listings |
| POST | `/api/followed` | Yes | Follow a listing |
| DELETE | `/api/followed/:listingId` | Yes | Unfollow a listing |

---

## Guitar Brands

The catalog includes 25 brands: Fender, Gibson, Taylor, Martin, PRS, Ibanez, Yamaha, Gretsch, ESP, Epiphone, Schecter, Jackson, Rickenbacker, Guild, Takamine, Music Man, Charvel, Dean, BC Rich, D'Angelico, Washburn, Ovation, Kramer, Godin, Squier.
