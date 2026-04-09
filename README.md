# Gym Exercise Logger

## What It Is
A web app to log and track gym workout sets with exercise name, weight, and reps.

## The Problem It Solves
I kept forgetting what weight I lifted in the previous gym session and had to guess my starting point each time. This app stores every set so I can quickly check my last recorded numbers before starting the next workout.

## What I Intentionally Excluded
- User authentication: this MVP is designed for one personal user, and adding sessions or JWT auth would add unnecessary backend and UI complexity for the current scope.

## Tech Stack
- Backend: Node.js + Express + SQLite (`better-sqlite3`)
- Frontend: React (Vite)
- Deployed: Render (backend) + Netlify (frontend)

## Live Deployment
**Frontend:** [Add Netlify URL here]  
**Backend:** [Add Render URL here]

## API Routes
- `POST /logs` - Create a new workout log
- `GET /logs` - Read all workout logs
- `PUT /logs/:id` - Update a workout log
- `DELETE /logs/:id` - Delete a workout log
- `GET /health` - Health check for deployment

## Local Setup
1. **Backend**
   - `cd backend`
   - `npm install`
   - Copy `backend/.env.example` to `backend/.env`
   - `npm start` (runs on port 3000 by default)
2. **Frontend**
   - `cd frontend`
   - `npm install`
   - Optional: copy `frontend/.env.example` to `frontend/.env` and set `VITE_BACKEND_URL` if not using `http://localhost:3000`
   - `npm run dev` — open the URL Vite prints (usually `http://localhost:5173`)

## Deployment Notes
- **Netlify:** set publish directory to `frontend/dist` after `npm run build` in `frontend` (or configure Netlify build: base `frontend`, build command `npm run build`, publish `dist`).
- Point the app at your Render API: set `VITE_BACKEND_URL=https://your-app.onrender.com` in Netlify environment variables (or edit the `BACKEND_URL` default in `frontend/src/App.jsx` before building).
- Ensure `backend/.env` is not committed (ignored in `.gitignore`).
