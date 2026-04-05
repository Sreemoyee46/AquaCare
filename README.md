# AquaGuard 🐠
### Smart Aquarium Health Monitor

A full-stack web application that helps fish owners monitor their aquarium health, diagnose diseases using AI, and manage their fish care routine.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB |
| AI | Google Gemini API |
| Auth | JWT |
| Charts | Recharts |

---

## Project Structure

```
aquaguard/
├── backend/
│   ├── controllers/       # Business logic
│   ├── data/              # Fish DB, diseases, shop items
│   ├── middleware/        # JWT auth
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── server.js          # Entry point
│   └── .env.example       # Environment variables
└── frontend/
    ├── src/
    │   ├── components/    # Navbar
    │   ├── context/       # Auth & Tank context
    │   ├── pages/         # All pages
    │   ├── App.jsx
    │   └── main.jsx
    └── index.html
```

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Gemini API key (free at https://makersuite.google.com/app/apikey)

---

### Step 1 — Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2 — Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/aquaguard
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### Step 3 — Run the App

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

---

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/auth/me | Get current user | Yes |
| GET | /api/tanks | Get all tanks | Yes |
| POST | /api/tanks | Create tank | Yes |
| DELETE | /api/tanks/:id | Delete tank | Yes |
| GET | /api/logs | Get parameter logs | Yes |
| POST | /api/logs | Log parameters + AI analysis | Yes |
| GET | /api/diagnose | Get diagnosis history | Yes |
| POST | /api/diagnose | Run AI diagnosis | Yes |
| GET | /api/shop/items | Get shop items | Yes |
| GET | /api/shop/aquariums | Get vendors | Yes |
| GET | /api/reminders | Get reminders | Yes |
| POST | /api/reminders | Create reminder | Yes |
| PATCH | /api/reminders/:id/toggle | Toggle reminder | Yes |
| DELETE | /api/reminders/:id | Delete reminder | Yes |
| GET | /api/fish | Get all fish species | No |

---

## Features

- **25 fish species** with species-specific safe parameter ranges
- **Parameter logging** — temperature, pH, turbidity, ammonia
- **AI analysis** — Gemini API analyses each log entry
- **Disease diagnosis** — 18 symptoms → AI identifies disease with do's and don'ts
- **Trend charts** — parameter history visualised with Recharts
- **Smart reminders** — auto-created for feeding, water change, filter clean
- **Shop** — 23 products across 5 categories
- **Trusted vendors** — local aquarium contacts
- **JWT authentication** — secure login/register
- **Multi-tank support** — manage multiple tanks

---

## Future Scope

- Phase 2: Arduino/ESP32 hardware sensor integration
- Phase 3: ML-based predictive alerts
- Phase 4: Community disease heatmap by region/season
- Phase 5: Mobile app (React Native)
- Phase 6: B2B API for aquarium shops

---

## Data Sources

Fish parameter ranges and disease data validated with domain expert from a Fisheries College.

---

## Team

Built as a 6th Semester CSE Project.
