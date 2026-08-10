# 5. Other Nonfunctional Requirements

This document outlines the nonfunctional requirements for **CodeDojo**, an AI-powered programming learning platform. These requirements define the system's performance, safety, security, quality attributes, and business rules in simple, easy-to-understand English.

---

## 5.1 Performance Requirements

Performance requirements describe how fast and efficient the CodeDojo platform must operate under different conditions.

* **Fast API Responses:** Standard platform actions (such as logging in, fetching user progress, or loading the leaderboard) must respond within **200 milliseconds** under normal network conditions.
* **Quick AI Sensei Responses:** The AI Mentor (Sensei) must begin generating hints or code feedback within **2 to 4 seconds** after a student asks a question.
* **Rapid Code Execution:** When a student submits code for testing, the Piston execution engine must compile, run, and return the test results within **3 to 5 seconds**.
* **Fast Page Load Time:** The web application pages must load completely within **2 seconds** on a standard internet connection (10 Mbps or faster).
* **High Concurrent User Support:** The system must support at least **500 active students simultaneously** (for example, during a university lab session or online test) without dropping connections or slowing down significantly.
* **Low System Resource Footprint:** The web frontend must use less than **150 MB of memory** in the user's web browser to run smoothly on standard laptops and low-spec computers.

### Rationale
First-year programming students need fast, real-time feedback when practicing code. If the platform or AI mentor is slow to respond, students lose focus and motivation.

---

## 5.2 Safety Requirements

Safety requirements protect students from losing their work and protect the system servers from damage or crashes caused by incorrect or malicious student code.

* **Automatic Work Saving:** The code editor must automatically save student code every **10 to 15 seconds** so no work is lost if the browser closes unexpectedly or if internet connection drops.
* **Isolated Code Sandbox:** All code submitted by students must run inside a secure, isolated container sandbox (Piston API). Student code is strictly forbidden from accessing server files, running system commands, or accessing the host operating system.
* **Execution Resource Limits:** Student programs are capped at a maximum of **5 seconds of runtime** and **128 MB of memory**. This prevents infinite loops or excessive memory usage from freezing the server.
* **Safe AI Content Filtering:** The AI Mentor must include automated content filters to prevent it from generating inappropriate, toxic, or abusive responses.
* **Daily Data Backups:** The database must perform daily automatic backups to ensure student accounts, completed lessons, and earned XP points can be recovered if system hardware fails.

### Rationale
Students will make coding mistakes like writing infinite loops or memory leaks. Isolating student code and backing up data ensures the system stays online and student effort is never lost.

---

## 5.3 Security Requirements

Security requirements specify how user data, system resources, and private credentials are protected against unauthorized access and attacks.

* **User Authentication:** Users must log in using a secure account (Email/Username and Password). Authentication is managed using JSON Web Tokens (JWT) with encrypted tokens stored safely.
* **Password Encryption:** User passwords must never be stored in plain text. Passwords must be hashed using `bcrypt` (with at least 10 salt rounds) before saving them to the database.
* **Encrypted Network Traffic:** All communications between the browser and backend server must use **HTTPS (TLS encryption)** to prevent data interception.
* **Role-Based Access Control (RBAC):** The system must separate permissions between **Students** and **Admins/Instructors**. Students can only modify their own profile and view their own code, while Admins can manage curriculum content and view system logs.
* **Protected API Keys:** Sensitive system keys (such as Google Gemini AI keys, Cloudinary credentials, and MongoDB connection strings) must be stored in server-side environment variables (`.env`) and never exposed in frontend code.
* **Input Validation & Sanitization:** All user inputs (forms, code fields, search boxes) must be sanitized on the server to prevent common web attacks like SQL/NoSQL Injection and Cross-Site Scripting (XSS).

### Rationale
Protecting student personal data and keeping API keys secure prevents unauthorized access, account compromise, and costly API overuse.

---

## 5.4 Software Quality Attributes

Software quality attributes describe the overall characteristics and user experience of the CodeDojo software.

* **Usability (Ease of Use):** 
  * The user interface must be clean, visual, and easy to navigate for beginner programmers.
  * Gamification elements (XP progress bars, level badges, streak counts) must be clearly visible.
  * Clear error messages must be displayed in plain language rather than raw technical tracebacks.
* **Reliability & Availability:**
  * The platform aims for **99.5% uptime** during academic semesters.
  * **Graceful Failure:** If the AI service reaches its limit or fails, the platform must display a friendly fallback message and allow the student to continue coding without crashing the application.
* **Maintainability:**
  * The frontend and backend codebases must be structured logically into modular components, routes, and services.
  * Code must follow standard formatting and include clear inline comments for future maintenance.
* **Portability & Compatibility:**
  * The application must work seamlessly across all major modern web browsers (Google Chrome, Mozilla Firefox, Microsoft Edge, and Apple Safari).
  * The frontend interface must be responsive, adapting smoothly to different screen sizes from tablets to large desktop monitors.
  * The application must support containerized deployment using Docker and Docker Compose.
* **Testability:**
  * Backend API routes and services must be decoupled so individual functions can be automatically tested.

### Rationale
First-year students come from diverse backgrounds and use different devices. A usable, reliable, and portable platform ensures all students get an equal and frustration-free learning experience.

---

## 5.5 Business Rules

Business rules define the operational policies and logic that govern how users interact with CodeDojo.

* **Account Requirement:** Only registered, logged-in users can earn XP, unlock Dojo Path levels, submit code for grading, and appear on leaderboards. Guests can only view the public home page.
* **Fair XP & Leveling Logic:**
  * XP is awarded only when a student's code successfully passes all test cases for a given exercise.
  * Submitting the exact same correct code multiple times will not reward additional XP (anti-farming rule).
* **Guiding AI Mentor Policy:**
  * The AI Sensei is designed to act as a mentor. It must provide hint-based guidance, explain errors, and suggest concepts. It must not provide complete, copy-paste homework solutions on first request.
* **Rate Limiting on AI Requests:** To ensure fair access and prevent API quota exhaustion, students are limited to a maximum of **30 AI mentor requests per hour**.
* **Leaderboard Fairness:** Leaderboards are updated dynamically based on verified XP earned through completed challenges. Suspicious or tampered scores can be reviewed and reset by an Instructor/Admin.

---
