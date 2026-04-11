# 🌟 CODEDOJO

**CODEDOJO** is a full-stack AI-powered learning assistant that transforms PDFs into interactive study experiences. Chat with your documents, generate quizzes & flashcards, get summaries, and track your learning progress — all powered by **Google Gemini AI** / **Mistral AI** and built with the **MERN stack**.

---

## 🚀 Key Features

*   **💬 Document Chat:** Chat with uploaded PDFs (RAG) for instant Q&A.
*   **📝 Auto-Generation:** Instantly generate flashcards & quizzes from PDF context.
*   **📚 Smart Summaries:** Summarize long documents intelligently.
*   **📈 Progress Tracking:** Track learning streaks, scores, and review metrics.
*   **🔍 Semantic Search:** Vector embeddings for high-accuracy document retrieval.
*   **🐳 Fully Dockerized:** Easy setup and consistent environments across teams.

---

## 🏗 System Architecture

The project is structured as a mono-repo containing both the frontend and backend:

*   **`/frontend/ai-learning-assistant/`**: React + Vite SPA using TailwindCSS.
*   **`/backend/`**: Node.js + Express API. Handles MongoDB connections, AI orchestration (Gemini/Mistral), and file uploads (Multer).

### AI Workflow (Retrieval-Augmented Generation)

1.  **Ingestion:** PDF uploaded → Parsed to text → Chunked
2.  **Storage:** Chunks converted to vector embeddings → Stored in MongoDB
3.  **Retrieval:** User asks question → Question embedded → Closest chunks retrieved
4.  **Generation:** Context + Question sent to LLM → Generates grounded response

---

## 💻 Developer Setup Guide

This project is fully containerized using Docker, which is the recommended way to run the application to avoid node version and dependency conflicts.

### Prerequisites

*   [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
*   [Node.js (v20+)](https://nodejs.org/) (optional, if running without Docker)
*   A MongoDB Atlas URI

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CODEDOJO
```

### 2. Environment Variables

Create a `.env` file inside the `backend/` directory:

```bash
cd backend
touch .env
```

Add the following keys to your `backend/.env` file:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URL=mongodb+srv://<your-cluster-url>

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d

# AI Services
GEMINI_API_KEY=your_google_gemini_api_key
MISTRAL_API_KEY=your_mistral_api_key

# Cloud Storage (Optional - falls back to local storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Running with Docker (Recommended)

From the root project directory (`CODEDOJO/`), run:

```bash
# Build the images and start the containers
docker compose up --build
```

*   **Frontend:** `http://localhost:5173`
*   **Backend API:** `http://localhost:8000`

> **Note:** Uploaded PDFs are stored in the `backend/uploads/` directory, which is bind-mounted to the host machine so your files persist across container restarts.

To stop the application:
```bash
docker compose down
```

### Alternative: Running Locally (Without Docker)

If you prefer to run the servers directly on your machine:

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend/ai-learning-assistant
npm install
npm run dev
```

---

## ⚡ Tech Stack Details

*   **Frontend:** React, Vite, TailwindCSS, Lucide React, Axios
*   **Backend:** Node.js, Express.js, Mongoose, Multer (File Uploads), JWT
*   **AI & Vector Search:**
    *   Google Gemini AI (`@google/genai`)
    *   Mistral AI & Embeddings (`@langchain/mistralai`)
    *   LangChain TextSplitters and MemoryVectorStore
*   **Database:** MongoDB Atlas
