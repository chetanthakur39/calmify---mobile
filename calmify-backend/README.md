# Calmify Production Backend API

REST API powered by Node.js, Express, and an embedded SQLite database (`calmify.db`).

## Features
- **Authentication:** JWT & bcrypt password hashing (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`)
- **Daily Mood Tracker:** Logs mood ratings and notes (`/api/mood`)
- **Facial Stress Scans:** Logs visual biometrics and stress scores (`/api/stress/scan`, `/api/stress/recent`)
- **Yoga Pose Analytics:** Logs correctness scores and posture alignment (`/api/yoga/session`, `/api/yoga/history`)
- **Monthly/Weekly Analytics:** Computes 30-day averages, highs, lows, streaks, and AI recommendations (`/api/analytics/dashboard`)
- **AI Stress Chatbot:** Natural language stress assistant (`/api/chat`, `/api/chat/history`)
- **Doctors Directory:** Directory with Google Maps search integration (`/api/doctors`)

## How to Run Locally

Double-click `run-backend.bat` or run:
```bash
npm start
```
The server will start on `http://localhost:5000`.

## Free 1-Click Live Deployment (Render / Railway / Fly.io)

This backend is container-ready and includes a `Procfile` and `Dockerfile`:
1. Push this folder to GitHub (`calmify-backend`).
2. Go to **[render.com](https://render.com)** -> Click **"New Web Service"**.
3. Select your `calmify-backend` repository.
4. Set Build Command: `npm install` and Start Command: `node server.js`.
5. Render will give you a live HTTPS URL (e.g. `https://calmify-api.onrender.com`).
6. Update `BASE_URL` in `calmify-mobile/src/api.ts` to your live Render URL.
