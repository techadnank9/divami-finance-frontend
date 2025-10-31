# 💰 Personal Finance Tracker

A full-stack Personal Finance Tracker built with **React (TypeScript, MUI)** frontend and **NestJS (TypeScript)** backend, using **MongoDB** (Docker) for data storage. Tracks income & expenses, budgets, and provides a simple dashboard with transaction management and category breakdowns.

---

## 🚀 Features

- Authentication (email/password, JWT)
- Transactions: add / edit / delete, date-range filters
- Budgets: monthly budgets by category (month shown as name)
- Dashboard:
  - Total income vs expenses for current month
  - Remaining budget overview (per-category + total)
  - Simple balance calculation (income - expense)
  - Spending by category with progress bars
  - Recent transactions
- Responsive UI with Material UI
- Client-side validation using `react-hook-form` + `yup`
- Simple client-side pagination for transactions

---

## 🧩 Tech Stack

- Frontend: React + TypeScript, Material UI (MUI), react-router
- Backend: NestJS + TypeScript, Passport JWT, Mongoose
- Database: MongoDB (Docker)
- Utilities: Axios, dayjs, react-hook-form, yup

---

## Prerequisites

- Node.js (v16+ recommended)
- npm
- Docker & Docker Compose (for MongoDB)

---

## Repository layout (example)

```
/project-root
├─ frontend/        # React app (TypeScript, MUI)
├─ backend/         # NestJS API
├─ docker-compose.yml
└─ README.md
```

---

## 1) Quick: Start MongoDB with Docker

Create a `docker-compose.yml` in project root (if not already):

```yaml
version: '3.8'
services:
  mongo:
    image: mongo:6
    container_name: pf-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Start MongoDB:

```bash
docker-compose up -d
```

Verify:

```bash
docker ps
# look for pf-mongo listening on 27017
```

---

## 2) Environment Variables

Create `.env` files for backend and frontend.

### `backend/.env`
```
PORT=3001
MONGO_URI=mongodb://localhost:27017/pftracker
JWT_SECRET=please_change_me_in_prod
```

### `frontend/.env` (or `.env.local` for CRA/Vite)
```
VITE_API_URL=http://localhost:3001
# if using next-auth or other providers, add their envs here (optional)
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=some_secret
```

> **Important:** Use the same `JWT_SECRET` when starting backend and when decoding tokens. If you restart backend with a different secret, previously issued tokens will be invalid.

---

## 3) Install dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
# If using additional libraries, also install:
# npm i react-hook-form yup @hookform/resolvers dayjs axios
```

---

## 4) Run the apps locally

### Start backend (NestJS)
From `backend/`:

```bash
# ensure mongo is running via docker
# start in development mode (shows logs)
JWT_SECRET=please_change_me_in_prod npm run start:dev
# On Windows PowerShell:
# $env:JWT_SECRET='please_change_me_in_prod'; npm run start:dev
```

Server should be available at: `http://localhost:3001`

### Start frontend (React)
From `frontend/`:

```bash
npm run dev
# or for create-react-app:
# npm start
```

Frontend available at `http://localhost:3000` (or port CRA/Vite indicates).

---

## 5) API Endpoints (overview)

> All protected endpoints expect `Authorization: Bearer <token>` header.

- `POST /auth/register` — register new user `{ email, password, name }`
- `POST /auth/login` — login `{ email, password }` → returns `{ access_token }`
- `GET /auth/me` — validate token, returns current user info

**Transactions**
- `POST /transactions` — create transaction `{ amount, type: 'income'|'expense', category, note?, date }`
- `GET /transactions` — list transactions, supports query params `from`, `to`, pagination later
- `GET /transactions/summary?year=YYYY&month=M` — income/expense summary (if implemented)
- `GET /transactions/by-category?year=YYYY&month=M` — aggregated totals by category
- `PUT /transactions/:id` — update
- `DELETE /transactions/:id` — delete

**Budgets**
- `GET /budgets?year=YYYY&month=M` — list budgets for a month
- `POST /budgets` — create `{ category, limitAmount, month, year }`
- `PUT /budgets/:id` — update
- `DELETE /budgets/:id` — delete

---

## 6) Frontend usage notes

- Token storage: frontend stores `access_token` in `localStorage` under `token` (e.g. `localStorage.setItem('token', token)`).
- Axios is configured to attach the Authorization header automatically via an interceptor in `src/services/api.ts`.
- Routes:
  - `/login` — Login page
  - `/register` — Register page
  - `/dashboard` — Protected Dashboard
  - `/transactions` — Transactions list, add/edit modal, filters (from/to)
  - `/budgets` — Budgets list, add form (month shown as name in dropdown)

---

## 7) Development aids & debugging

- If you get `401 Unauthorized`:
  - Confirm frontend sends header: check browser DevTools → Network → Request Headers → `Authorization`.
  - Confirm backend is started with the same `JWT_SECRET`.
  - Re-login (clear old token: `localStorage.removeItem('token')`).

- If you see `JsonWebTokenError: invalid signature`:
  - Tokens were signed with a different secret than the running backend. Restart backend with the intended `JWT_SECRET` and re-login to obtain a new token.

- If an endpoint returns `404` (e.g. `/transactions/by-category`):
  - Ensure backend has the controller method implemented and the server was restarted after changes.

---

## 8) Notes on UI & data

- Month selection for budgets uses a dropdown showing month names (January..December) while sending numeric `month` (1–12) to the API.
- Date filters use date inputs; `to` filter is converted to end-of-day before sending to API (inclusive).
- Currency formatting uses `Intl.NumberFormat` (default `en-IN`, `INR`) in `src/utils/format.ts`. Change locale/currency if needed.

---

## 9) Optional: Useful CLI snippets

Register & login via `curl` (for testing):

```bash
# register
curl -s -X POST http://localhost:3001/auth/register -H "Content-Type: application/json" -d '{"email":"me@test.local","password":"password123","name":"Me"}'

# login -> get token
curl -s -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d '{"email":"me@test.local","password":"password123"}'

# use token (replace <TOKEN>)
curl -i -H "Authorization: Bearer <TOKEN>" http://localhost:3001/auth/me
```

---

## 10) Future improvements

- Server-side pagination & filtering for transactions
- Charts (Recharts) for visual analytics
- Export CSV / PDF reports
- Multi-user collaboration & shared budgets
- Integration tests & e2e tests

---

