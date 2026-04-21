# 🥋 CodeDojo

**CodeDojo** is a gamified, AI-powered programming learning platform built for first-year university students. It features a structured **Dojo Path** curriculum, a real-time code editor, XP & leaderboard systems, and **Sensei** — a passionate technical mentor powered by Google Gemini.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)
- [Running Locally (Manual)](#-running-locally-manual)
- [Running with Docker](#-running-with-docker)
- [Key Features](#-key-features)
- [Customization Guide](#-customization-guide)

---

## 🛠️ Tech Stack

| Layer      | Technology                                               |
|------------|----------------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS v4, Monaco Editor, React Router |
| Backend    | Node.js, Express 5, Mongoose                            |
| Database   | MongoDB                                                  |
| AI         | Google Gemini (`gemini-2.5-flash-lite`) via `@google/genai` |
| AI (Sensei)| Mistral AI via LangChain                                |
| Code Execution | Piston API                                          |
| File Storage | Cloudinary                                            |
| Auth       | JWT (jsonwebtoken + bcryptjs)                           |

---

## ✅ Prerequisites

Make sure you have the following installed:

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **npm** v9+
- **MongoDB** — [MongoDB Atlas (cloud)](https://www.mongodb.com/atlas) or a local instance
- **Docker & Docker Compose** *(optional, for containerized setup)* — [Download](https://www.docker.com/products/docker-desktop)

---

## 📁 Project Structure

```
CODEDOJO/
├── backend/                    # Express API server
│   ├── config/                 # DB and Cloudinary config
│   ├── controllers/            # Route logic (auth, AI, arcade, etc.)
│   ├── middleware/             # Auth guard, error handler
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── services/               # LangChain / Mistral AI service
│   ├── utils/                  # Gemini AI service
│   ├── server.js               # Entry point
│   └── .env                    # ← You must create this (see below)
│
├── frontend/
│   └── ai-learning-assistant/  # Vite + React app
│       ├── src/
│       │   ├── data/curriculum.js  # Lesson content (Java & Python)
│       │   ├── pages/Arcade/       # The Dojo Path experience
│       │   ├── context/            # Auth & Telemetry providers
│       │   └── utils/apiPaths.js   # API endpoint constants
│       └── package.json
│
├── docker-compose.yml          # Docker setup for both services
└── README.md
```

---

## 🔑 Environment Setup

### 1. Create the backend `.env` file

Navigate to the `backend/` directory and create a file named `.env`:

```bash
cd backend
touch .env
```

Then add the following variables:

```env
# ── Server ──────────────────────────────────
PORT=8000
NODE_ENV=development

# ── MongoDB ─────────────────────────────────
# Use a MongoDB Atlas connection string or your local URI
MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/codedojo

# ── Auth (JWT) ───────────────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# ── Google Gemini AI ─────────────────────────
# Get your API key: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# ── Mistral AI (Sensei in Arcade) ────────────
# Get your API key: https://console.mistral.ai/
MISTRAL_API_KEY=your_mistral_api_key_here

# ── Cloudinary (Document/Image Uploads) ──────
# Get credentials: https://cloudinary.com/
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> **Note:** There is no frontend `.env` needed — the frontend connects to `http://127.0.0.1:8000` by default. If you change the backend port, update `frontend/ai-learning-assistant/src/utils/apiPaths.js`.

---

## 🚀 Running Locally (Manual)

Run the **backend** and **frontend** in two separate terminal windows:

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

The API server will start at **http://localhost:8000**

> **`npm run dev`** uses `nodemon` for hot-reloading.  
> **`npm start`** runs the server without hot-reloading (for production-like testing).

---

### Terminal 2 — Frontend

```bash
cd frontend/ai-learning-assistant
npm install
npm run dev
```

The React app will start at **http://localhost:5173**

---

## 🐳 Running with Docker

This option builds and starts both services with a single command. Make sure Docker Desktop is running first.

```bash
# From the project root (CODEDOJO/)
docker-compose up -d --build
```

| Service  | URL                      |
|----------|--------------------------|
| Frontend | http://localhost:5173    |
| Backend  | http://localhost:8000    |

To **stop** the services:

```bash
docker-compose down
```

To **view logs** for a specific service:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

> ⚠️ The `backend` service reads its environment variables from `./backend/.env`. **Make sure this file exists before running Docker.**

---

## 🏆 Key Features

| Feature | Description |
|---|---|
| **Dojo Path** | W3Schools-style split-pane with curated Java & Python curriculum |
| **Live Code Editor** | Monaco Editor with in-browser compilation via Piston API |
| **Sensei AI** | Context-aware hints without spoiling solutions (Mistral AI) |
| **XP & Leaderboard** | Real-time gamification to track student progress |
| **Document Study** | Upload PDFs → auto-generate flashcards, quizzes & summaries |
| **Telemetry** | Batched analytics pipeline for tracking learning engagement |
| **Voice Narration** | Sensei reads lessons aloud via the Web Speech API |

---

## 🔧 Customization Guide

### 🎓 Add or Edit Lessons

Open `frontend/ai-learning-assistant/src/data/curriculum.js` and append to `JAVA_CURRICULUM` or `PYTHON_CURRICULUM`:

```javascript
{
  id: "jv-new",
  title: "My New Lesson",
  concept: "The Concept",
  narrative: "Text that Sensei narrates...",
  example: "// Code example shown to student",
  goal: "What the student must produce",
  initialCode: "// Starter code in the editor",
  validation: (output) => output.trim() === "Expected Output",
  xp: 100
}
```

### 🧠 Modify Sensei's Persona

Edit the `SYSTEM_PROMPT` constant in `backend/controllers/arcadeController.js` to change Sensei's tone, rules, or area of expertise.

### 🔥 Adjust XP Rewards

Each lesson object in `curriculum.js` has an `xp` property. Modify it per lesson, or change the `handleCompileResult` function in `ArcadePage.jsx` for custom XP logic.

---

## 🧪 Available API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/profile` | Get authenticated user profile |
| POST | `/api/documents/upload` | Upload a PDF document |
| POST | `/api/ai/generate-flashcards` | Generate flashcards from a doc |
| POST | `/api/ai/generate-quiz` | Generate quiz from a doc |
| POST | `/api/ai/generate-summary` | Summarize a document |
| POST | `/api/arcade/chat` | Chat with Sensei (AI tutor) |
| POST | `/api/execute` | Execute code via Piston API |
| GET | `/api/leaderboard` | Get XP leaderboard |
| POST | `/api/telemetry/bulk` | Submit batched analytics events |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

*Built with ❤️ for first-year CS students — learning should feel like leveling up.*
