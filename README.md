# Gym Exercise Logger

## What It Is
A web app to log and track gym workout sets with exercise name, weight, and reps.

## The Problem It Solves
I kept forgetting what weight I lifted in the previous gym session and had to guess my starting point each time. This app stores every set so I can quickly check my last recorded numbers before starting the next workout.

## What I Intentionally Excluded
- User authentication: this MVP is designed for one personal user, and adding sessions or JWT auth would add unnecessary backend and UI complexity for the current scope.

## Tech Stack
- Backend: Node.js + Express + SQLite (`better-sqlite3`)
- Frontend: Vanilla HTML/CSS/JavaScript
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
1. Install backend dependencies:
   - `cd backend`
   - `npm install`
2. Create environment file:
   - Copy `backend/.env.example` to `backend/.env`
3. Start backend:
   - `npm start`
4. Open `frontend/index.html` in browser (or use VS Code Live Server).

## Deployment Notes
- Before deploying frontend, update `BACKEND_URL` in `frontend/app.js` to your Render backend URL.
- Ensure `.env` is not committed (already ignored in `.gitignore`).
