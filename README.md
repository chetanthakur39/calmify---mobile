# 🌿 Calmify: Full-Stack AI Mental Wellness & Biometric Platform

<div align="center">

[![Live Application](https://img.shields.io/badge/Live_App-calmify--app.vercel.app-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://calmify-app.vercel.app)
[![API Backend](https://img.shields.io/badge/Live_API-Render_Cloud-4F46E5?style=for-the-badge&logo=render&logoColor=white)](https://calmify-api-ix8y.onrender.com/api/health)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/chetanthakur39/calmify---mobile)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br/>

<img src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80" alt="Calmify Banner" width="100%" style="border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" />

### *Empowering mental wellness through computer vision, real-time pose analytics, and intelligent emotional tracking.*

[Explore Live App](https://calmify-app.vercel.app) • [API Documentation](#-rest-api-documentation) • [System Architecture](#-system-architecture) • [Key Features](#-key-features)

</div>

---

## 📖 Table of Contents
1. [Project Overview](#-project-overview)
2. [Live Production Endpoints](#-live-production-endpoints)
3. [Key Features & Engineering Highlights](#-key-features--engineering-highlights)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [Tech Stack](#-tech-stack)
6. [REST API Documentation](#-rest-api-documentation)
7. [Database Schema (SQLite)](#-database-schema-sqlite)
8. [Local Development Setup](#-local-development-setup)
9. [Deployment Guide](#-deployment-guide)
10. [Author & Contact](#-author--contact)

---

## 🌟 Project Overview

**Calmify** is an enterprise-grade full-stack mental wellness ecosystem designed to bridge the gap between daily emotional tracking, computer vision biometrics, and active somatic de-stressing techniques. 

Instead of static questionnaire-only apps, Calmify combines:
- **Real-Time Facial Vision Biometrics**: Micro-tension and expression analysis for instant stress indexing.
- **AI Yoga Posture Analyzer**: Computer vision kinematic joint-angle tracking for live pose correction and alignment feedback.
- **30-Day Longitudinal Mood & Stress Intelligence**: Dynamic trend aggregation with high/low milestone detection.
- **CBT Conversational Coach**: An empathetic 24/7 AI chatbot trained on somatic relaxation and breathing protocols.
- **Healthcare Accessibility & Mind Games**: Instant geolocation linking to nearby psychological specialists via Google Maps and an interactive tactile Zen mind game.

---

## 🚀 Live Production Endpoints

| Service | Environment | Provider | URL | Status |
|---|---|---|---|---|
| **Frontend Web App** | Production | Vercel (Edge CDN) | [https://calmify-app.vercel.app](https://calmify-app.vercel.app) | ![Active](https://img.shields.io/badge/Status-Online-brightgreen) |
| **REST API Server** | Production | Render Cloud (Docker) | [https://calmify-api-ix8y.onrender.com](https://calmify-api-ix8y.onrender.com) | ![Active](https://img.shields.io/badge/Status-Online-brightgreen) |
| **API Health Check** | Production | Render Cloud | [https://calmify-api-ix8y.onrender.com/api/health](https://calmify-api-ix8y.onrender.com/api/health) | ![Active](https://img.shields.io/badge/Health-200_OK-brightgreen) |

---

## 🎯 Key Features & Engineering Highlights

<div align="center">
  <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80" alt="Features Overview" width="90%" style="border-radius: 14px;" />
</div>

### 1. 🔐 Secure Authentication & Session Management
- **Password Security:** Salted and hashed using `bcryptjs` with 10 salt rounds.
- **JWT Authorization:** Stateless token authentication with 30-day token expiration stored securely in client storage (`localStorage` on Web, `expo-secure-store` on Mobile).
- **Protected Routes:** Middleware verification intercepts all wellness data routes.

### 2. 📷 Feature 1: Facial Stress Detection (Vision Biometrics)
- **Live Viewport:** Direct integration with HTML5/WebRTC camera streams.
- **Expression Analysis:** Analyzes micro-tension variances across the brow, eye aspect ratio (EAR), and jawline clenching.
- **Biometric Output:** Computes a composite **Stress Score (0–100%)**, estimates resting pulse (BPM), and categorizes state (*Relaxed*, *Focused*, *Elevated Strain*).
- **Automatic Cloud Sync:** Persists scan history to the cloud database.

### 3. 🧘 Feature 2: AI Yoga Pose Correctness Checker
- **Real-Time Kinematics:** Evaluates posture symmetry, spine alignment, and arm/knee angles in front of the camera.
- **Supported Poses:**
  - *Vrikshasana (Tree Pose)*: Unilateral balance, pelvic neutrality, hip turnout.
  - *Virabhadrasana II (Warrior II)*: 90° knee flexion, horizontal shoulder-arm plane.
  - *Tadasana (Mountain Pose)*: Shoulder retraction and spinal axial elongation.
- **Live Efficiency Meter:** Displays real-time correctness score (0–100%) with step-by-step vocal/text corrections (*"Adjust right arm 5° higher for horizontal balance"*).

### 4. 📊 Feature 3: Monthly & Weekly Analytics Dashboard
- **Trend Visualization:** 30-day emotional high & low bar charts tracking stability.
- **Key Metrics:** Average mood score, peak wellness days, recovery days, and active mindfulness streaks.
- **AI Recommendation Engine:** Generates dynamic, context-aware suggestions based on 7-day rolling stress averages.

### 5. 💬 Feature 4: 24/7 AI Stress Management Consultant
- **Empathetic Dialogue Engine:** Built on Cognitive Behavioral Therapy (CBT) and somatic down-regulation principles.
- **Guided Prompt Chips:** Instant help for panic attacks, 4-7-8 breathing exercises, insomnia, and professional burnout.
- **Persistent Chat History:** Seamlessly retrieves previous conversations upon sign-in.

### 6. 🗺️ Feature 5: Nearest Doctors on Google Maps & Zen Playground
- **Specialist Directory:** Curated list of verified clinical psychiatrists, counselors, and CBT therapists.
- **One-Click Navigation:** Deep-links directly to Google Maps query for immediate turn-by-turn directions.
- **Zen Bubble Pop Mini-Game:** Mindful tactile stress dissolution game allowing users to tap and pop intrusive thoughts (*Overthinking, Deadlines, Fatigue*) with real-time Zen score rewards.

---

## 🏗️ System Architecture & Data Flow

```
                      ┌──────────────────────────────────────────┐
                      │             CLIENT APPLICATION           │
                      │       React Native / Expo Web Client     │
                      │        (Deployed on Vercel Edge)         │
                      └────────────────────┬─────────────────────┘
                                           │
                        HTTPS / REST APIs  │  JWT Bearer Token
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │             EXPRESS BACKEND              │
                      │          (Deployed on Render)            │
                      ├──────────────────────────────────────────┤
                      │  • JWT Auth & Bcrypt Security Middleware │
                      │  • Mood, Stress & Yoga REST Controllers │
                      │  • Analytics & Trend Aggregation Engine  │
                      │  • Rule-Based CBT Knowledge Consultant   │
                      └────────────────────┬─────────────────────┘
                                           │
                                           ▼
                      ┌──────────────────────────────────────────┐
                      │          PERSISTENT SQL DATABASE         │
                      │          SQLite Storage Engine           │
                      │   (Users, Moods, StressScans, YogaLogs)  │
                      └──────────────────────────────────────────┘
```

---

## 💻 Tech Stack

### Frontend Client
- **Framework:** React Native (Expo SDK 52 / Webpack & Metro Bundler)
- **Language:** TypeScript 5.x
- **Navigation:** `@react-navigation/bottom-tabs` & `@react-navigation/native`
- **Sensors & Storage:** `expo-secure-store`, `expo-status-bar`, WebRTC Camera APIs
- **Deployment:** Vercel Global Edge Network

### Backend Server
- **Runtime:** Node.js v22 LTS
- **Server Framework:** Express.js 4.x
- **Security:** `jsonwebtoken` (JWT), `bcryptjs`, `cors`
- **Deployment:** Render Cloud Platform (Linux Docker Container)

### Database Layer
- **Engine:** SQLite (Node.js Native Synchronous SQLite Engine)
- **Persistence:** Relational tables with foreign key cascades and timestamp tracking.

---

## 📡 REST API Documentation

Base URL: `https://calmify-api-ix8y.onrender.com`

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user (name, email, password) | No |
| `POST` | `/api/auth/login` | Login user and issue JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

### Mood Tracking Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/mood` | Retrieve user's past mood history | Yes |
| `POST` | `/api/mood` | Log daily mood score (1-5) and note | Yes |

### Stress & Biometrics Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/stress/scan` | Log facial stress score, expression, and pulse | Yes |
| `GET` | `/api/stress/recent` | Fetch latest 10 facial scans | Yes |

### Yoga Pose Checker Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/yoga/session` | Record completed yoga pose and efficiency score | Yes |
| `GET` | `/api/yoga/history` | Retrieve past yoga session history | Yes |

### Analytics & AI Chatbot Endpoints
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard` | 30-day metrics, high/low scores, AI advice | Yes |
| `POST` | `/api/chat` | Send message to AI stress consultant | Yes |
| `GET` | `/api/chat/history` | Retrieve conversational chat history | Yes |
| `GET` | `/api/doctors` | Retrieve directory of nearby mental specialists | No |
| `GET` | `/api/health` | Service health status check | No |

---

## 🗄️ Database Schema (SQLite)

```sql
-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily Mood Entries
CREATE TABLE mood_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  mood INTEGER NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Facial Stress Biometrics
CREATE TABLE stress_scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  stress_score INTEGER NOT NULL,
  expression TEXT NOT NULL,
  heart_rate_est INTEGER,
  recommendation TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Yoga Posture Efficiency Sessions
CREATE TABLE yoga_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  pose_name TEXT NOT NULL,
  efficiency INTEGER NOT NULL,
  feedback TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Chatbot Dialogue History
CREATE TABLE chat_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18.x or v22.x LTS)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/chetanthakur39/calmify---mobile.git
cd calmify---mobile
```

### 2. Start the Backend Server
```bash
cd calmify-backend
npm install
npm start
# Server starts on http://localhost:5000
```

### 3. Start the Frontend Application
In a separate terminal window:
```bash
# Return to root
npm install
npx expo start
```
- Press **`w`** in the terminal to launch in your web browser.
- Or scan the QR code using the **Expo Go** app on your physical iOS/Android device.

---

## 🚢 Deployment Guide

### Deploy Backend (Render Cloud)
1. Push repository to GitHub.
2. Go to **[Render Dashboard](https://dashboard.render.com)** ➔ Click **New Web Service**.
3. Select your repository.
4. Set **Root Directory** to `calmify-backend`.
5. Set **Build Command** to `npm install` and **Start Command** to `node server.js`.
6. Select the **Free** tier and click **Create Web Service**.

### Deploy Frontend (Vercel)
1. Install Vercel CLI: `npm install -g vercel`.
2. Run in project root:
   ```bash
   npx vercel --name calmify-app --yes
   npx vercel --prod --name calmify-app --yes
   ```
3. Your application is live across global edge regions with automatic SSL certificate provisioning.

---

## 👨‍💻 Author & Contact

**Chetan Pratap Singh**  
- **Live Demo:** [https://calmify-app.vercel.app](https://calmify-app.vercel.app)
- **GitHub:** [@chetanthakur39](https://github.com/chetanthakur39)
- **LinkedIn:** [Chetan Pratap Singh](https://www.linkedin.com/in/chetan-pratap-singh)
- **Phone:** +91 8533034884

---

<div align="center">
  <sub>Built with ❤️ for health, balance, and engineering excellence.</sub>
</div>
