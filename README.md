# 🥋 CodeDojo Arcade

**CodeDojo Arcade** is a professional, high-engagement programming learning platform designed for university-level students. It transforms difficult computer science concepts into a gamified, structured journey guided by **Sensei**, a passionate technical mentor.

---

## 🏛️ Project Evolution
This project has evolved from a general AI PDF study tool into a specialized **Arcade Dojo**. 
- **The Pivot:** We scrapped the chat-based interface in favor of a **"Dojo Path"**—a structured, W3Schools-style split-pane experience where students follow a curated curriculum on the left and write code on the right.
- **Pedagogy:** The core focus is on "Technical Depth with Compassion." Sensei uses industrial terminology (JVM, Bytecode, Stack/Heap) but explains it through logical analogies.

---

## 🛠️ Key Systems

### 1. The Dojo Path (Arcade)
*   **Location:** `/frontend/src/pages/Arcade/ArcadePage.jsx`
*   **Logic:** A split-pane layout with integrated **Monaco Editor**.
*   **Curriculum:** Lessons are pulled from `src/data/curriculum.js`. Each lesson features a narrative, a code example, and a specific "Mission Objective."
*   **Validation:** The next lesson remains locked until the student's code produces an output that satisfies the mission's logic rules.

### 2. Sensei (AI Assistant)
*   **Knowledge Base:** Located in `/backend/controllers/arcadeController.js`.
*   **Persona:** A wise, professional mentor. Strictly forbids "childish" metaphors (no magic spells).
*   **Help System:** The "Ask Sensei" button sends the student's code and output to the backend, where Sensei provides a contextual hint without giving the full answer.
*   **Voice (TTS):** Integrated via the Web Speech API. Sensei narrates lessons aloud if the speaker icon is toggled on.

### 3. Telemetry & Analytics
*   **Provider:** `/frontend/src/context/TelemetryContext.jsx`
*   **Pipeline:** Tracks page views, clicks, and code compilation successes/errors.
*   **Optimization:** Events are batched and sent to the backend `/api/telemetry/bulk` every 10 seconds to minimize database overhead.

---

## 🔧 How to Tweak & Customize

### 🎓 Adding/Editing Lessons
Open `frontend/src/data/curriculum.js`. To add a new lesson, append an object to the `PYTHON_CURRICULUM` or `JAVA_CURRICULUM` arrays:
```javascript
{
  id: "jv-new",
  title: "New Lesson",
  concept: "The Concept",
  narrative: "The text Sensei speaks...",
  example: "Code example block...",
  goal: "The actual task for the student...",
  initialCode: "Starter code in editor...",
  validation: (output) => output.includes("Expected Result"),
  xp: 100
}
```

### 🧠 Adjusting Sensei's Persona
Navigate to `backend/controllers/arcadeController.js`. You can modify the `SYSTEM_PROMPT` constant to change his tone, rules, or even transition him to a different language/expertise.

### 🔥 Gamification & XP
To adjust how XP is calculated, modify the `handleCompileResult` in `ArcadePage.jsx`. Currently, each lesson defines its own `xp` reward in the curriculum data.

---

## 🚀 Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide Icons, Monaco Editor (@monaco-editor/react).
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Execution:** Piston API (Local or Remote) for code compilation.
- **AI:** Google Gemini (via Mistral/LangChain integration in the backend).

---

## 📦 Running Locally
```bash
# Start all services with Docker
docker-compose up -d --build
```
*   **Frontend:** http://localhost:5173
*   **Backend:** http://localhost:8000
