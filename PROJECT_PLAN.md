# 🥋 CodeDojo Architecture & Development Project Plan

## 1. Project Overview & Constraints
* **Project:** CodeDojo Arcade (W3Schools-style Gamified Learning Platform)
* **Target Audience:** First-year university students (Computer Science/IT)
* **Development Pace:** Minimum 1 session per week (accommodating tests, exams, and university coursework).
* **Target Completion:** Project enters strict Code Freeze exactly **one month prior to the Final Presentation**.

## 2. System Architecture & Tech Stack

This section outlines every core package, file, and architecture layer to ensure nothing is left out during the intermittent development cycles.

### 🎨 Frontend (Client-side)
* **Framework:** React.js (via Vite)
* **Styling:** Tailwind CSS, Lucide Icons
* **Core Packages:** 
  * `@monaco-editor/react` (Code environment)
  * Custom Web Speech API hooks (TTS for Sensei instructions)
* **Key Directories & Files:**
  * `frontend/src/pages/Arcade/ArcadePage.jsx` - Core Dojo Path, split-pane layout and XP UI.
  * `frontend/src/data/curriculum.js` - Hardcoded curriculum data (Java/Python).
  * `frontend/src/context/TelemetryContext.jsx` - App-wide context for queuing analytics and usage metrics.

### ⚙️ Backend (Server-side)
* **Framework:** Node.js with Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **AI Integration:** Google Gemini integration logic
* **Code Execution:** Piston API (Remote/Local compiler engine)
* **Key Directories & Files:**
  * `backend/controllers/arcadeController.js` - Sensei's Persona, prompt engineering, and hint generation.
  * `backend/controllers/telemetryController.js` - Handles batch ingestion of `/api/telemetry/bulk` data.
  * `backend/models/TelemetryEvent.js` - MongoDB Schema for student usage metrics.
  * `backend/utils/pdfParser.js` - Utility service for converting syllabus PDFs to lessons.

### 🚀 Infrastructure
* **Containerization:** Docker via `docker-compose.yml`
* **Deployment:** Vercel (via `vercel.json` configuration) for frontend, containerized hosting for backend.

---

## 3. Weekly Development Phases & Milestones

**Philosophy:** Since development will pause during exams, each "Session" is designed to be highly modular. You can pick up any session after a 2-3 week hiatus without losing track. 

### Phase 1: Core System & Architecture Lock-in (Months 1-2)
* **Session 1.1:** Review and finalize `docker-compose.yml` for local dev. Ensure the Vite frontend and Express backend can talk to each other without CORS issues.
* **Session 1.2:** Finalize `TelemetryEvent.js` Mongoose schema. Ensure `TelemetryContext.jsx` properly batches and sends payload every 10 seconds.
* **Session 1.3:** Complete the W3Schools-style split-pane UI in `ArcadePage.jsx`. Polish the Monaco Editor implementation.
* **Session 1.4:** Connect Monaco Editor to the Piston API. Handle runtime states (Loading, Output, Compilation Error).

### Phase 2: Curriculum & Gamification Engines (Months 2-3)
* **Session 2.1:** Author initial Java & Python lessons in `curriculum.js`. Establish the strict mission validation logic (e.g., locking Lesson 2 until Lesson 1 output matches expected strings).
* **Session 2.2:** Build the Gamification UI (XP Bars, Leveling system based on `.xp` attributes in the curriculum).
* **Session 2.3:** Integrate the Web Speech API so Sensei can read the `narrative` element of the current lesson to the student.
* **Session 2.4:** End-to-End Lesson loop test. Confirm a student can start at 0 XP, type code, pass validation, and level up.

### Phase 3: "Ask Sensei" AI Integration (Months 3-4)
* **Session 3.1:** Write the `SYSTEM_PROMPT` in `arcadeController.js`. Lock in the "professional, deep technical mentor" voice. Prohibit childish metaphors.
* **Session 3.2:** Wire the "Ask Sensei" frontend button to the backend AI endpoint.
* **Session 3.3:** Pass the student's current Monaco Editor code and terminal output to Gemini for contextual, non-spoiler hints.
* **Session 3.4:** UI polish for Sensei's feedback widget—ensure hints look great and don't break the code pane layout.

### Phase 4: Data & Edge Cases (Month 4)
* **Session 4.1:** Test Telemetry analytics under load. Build a way to extract/view telemetry logs to see where students get stuck.
* **Session 4.2:** Graceful error handling (What happens if Piston API times out? What if Gemini fails?). Provide friendly UI fallbacks.
* **Session 4.3:** Mobile responsiveness pass (ensure the platform works reasonably well if a student uses an iPad).

### Phase 5: The "One Month Before" Completion Sprint (Final Month)
* **Session 5.1 (Code Freeze T-Minus 4 Weeks):** Full Curriculum audit. Verify all content in `curriculum.js` is correct.
* **Session 5.2 (Code Freeze T-Minus 3 Weeks):** Vercel deployment checks. Ensure production environment variables are properly set.
* **Session 5.3 (Code Freeze T-Minus 2 Weeks):** User Testing. Have 2-3 classmates run through the platform. Catch UI bugs.
* **Session 5.4 (Code Freeze T-Minus 1 Week):** Create Presentation materials (Slides, Demo scripts, Screen recordings in case of live-demo failure). **Hard Code Freeze.**

---

## 4. Maintenance & Survival Rules for a Busy Student
1. **The 30-Minute Git Rule:** If you only have 30 minutes, don't start a huge feature. Use that time to write a new lesson in `curriculum.js` or comment existing code. Update `README.md`.
2. **Comment Aggressively:** Because of exam hiatuses, you will forget how `telemetryController.js` works. Write docstrings.
3. **No "Frankenstein" Features:** Stick to the plan. Do not add arbitrary new frameworks (like moving to Next.js or GraphQL) midway through. 
4. **Always Leave a Breadcrumb:** At the end of every coding session, leave a `TODO:` comment exactly where you stopped so your future self knows where to start next week.

*Developed by your Seasoned Project Planner.*
