**🥋 CodeDojo - Software Requirements Specification (SRS)**  
 **Project Title:** CodeDojo Arcade  
   
 **Target Audience:** First-Year University Students, Instructors, Developers, Approvers & Testers  
   
 **Date:** 10 August 2026  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSPBCj7fFRYQwYwEZiywEZJWQZeZ2ao9AAD+4lyruzq+ngAA8Nr1AMTJBeJDClAyAAAAAElFTkSuQmCC)  
**Table of Contents**  
- [1. Overview](#anchor-1 "#anchor-1")  
  - [1.1 Purpose](#anchor-2 "#anchor-2")  
  - [1.2 Document Conventions](#anchor-3 "#anchor-3")  
  - [1.3 Intended Audience and Reading Suggestions](#anchor-4 "#anchor-4")  
  - [1.4 Product Scope](#anchor-5 "#anchor-5")  
  - [1.5 References](#anchor-6 "#anchor-6")  
  - [1.6 Definitions, Acronyms and Abbreviations](#anchor-7 "#anchor-7")  
- [2. Overall Description](#anchor-8 "#anchor-8")  
  - [2.1 Product Perspective](#anchor-9 "#anchor-9")  
  - [2.2 Change Requests for Old VOR](#anchor-10 "#anchor-10")  
  - [2.3 Product Functions](#anchor-11 "#anchor-11")  
  - [2.4 User Classes and Characteristics](#anchor-12 "#anchor-12")  
  - [2.5 Operating Environment](#anchor-13 "#anchor-13")  
  - [2.6 Design and Implementation Constraints](#anchor-14 "#anchor-14")  
  - [2.7 User Documentation](#anchor-15 "#anchor-15")  
  - [2.8 Assumptions and Dependencies](#anchor-16 "#anchor-16")  
- [3. External Interface Requirements](#anchor-17 "#anchor-17")  
  - [3.1 User Interfaces](#anchor-18 "#anchor-18")  
  - [3.2 Hardware Interfaces](#anchor-19 "#anchor-19")  
  - [3.3 Software Interfaces](#anchor-20 "#anchor-20")  
  - [3.4 Communications Interfaces](#anchor-21 "#anchor-21")  
- [4. System Features](#anchor-22 "#anchor-22")  
  - [4.1 User Registration and Authentication](#anchor-23 "#anchor-23")  
  - [4.2 AI-Powered Document Study](#anchor-24 "#anchor-24")  
  - [4.3 Dojo Path Coding Arena](#anchor-25 "#anchor-25")  
  - [4.4 Gamification (XP, Levels & Leaderboard)](#anchor-26 "#anchor-26")  
  - [4.5 Notifications Center](#anchor-27 "#anchor-27")  
- [5. Other Nonfunctional Requirements](#anchor-28 "#anchor-28")  
  - [5.1 Performance Requirements](#anchor-29 "#anchor-29")  
  - [5.2 Safety Requirements](#anchor-30 "#anchor-30")  
  - [5.3 Security Requirements](#anchor-31 "#anchor-31")  
  - [5.4 Software Quality Attributes](#anchor-32 "#anchor-32")  
  - [5.5 Business Rules](#anchor-33 "#anchor-33")  
- [6. Appendix A: Glossary](#anchor-34 "#anchor-34")  
- [7. Appendix B: Analysis Models](#anchor-35 "#anchor-35")  
- [8. Appendix C: To Be Determined List](#anchor-36 "#anchor-36")  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/khWsYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4qjBdKlX6OKAAAAAElFTkSuQmCC)  
**1. Overview**  
This Software Requirements Specification (SRS) describes the requirements for the **CodeDojo** web platform and explains how this document is organized for different readers. It guides stakeholders to relevant sections without repeating the table of contents. General users and reviewers should focus on the product description and user-facing behavior, while developers and testers should focus on detailed functional, interface, and quality requirements.  
**1.1 Purpose**  
The purpose of this SRS is to define all requirements for **CodeDojo**, a gamified AI-powered programming learning platform for first-year university students. This document specifies what the system must do, the expected quality attributes, and the implementation constraints. The intended audience includes students, project supervisors/approvers, developers, and software testers.  
**1.2 Document Conventions**  
Requirements in this document follow these standard terms:  
- **shall**: Indicates a mandatory requirement.  
- **should**: Indicates a recommended requirement.  
- **may**: Indicates an optional feature.  
Requirement identifiers and numbering are used consistently throughout the document. Special terms are defined in Section 1.6.  
**1.3 Intended Audience and Reading Suggestions**  
- **Students & General Reviewers:** Read Sections 1.4, 2.2, and Section 4 to understand system features and user experience.  
- **Developers:** Focus on Sections 2, 3, 4, and 5 for complete technical specifications.  
- **Project Supervisors & Approvers:** Review Sections 1, 2.5, and 5.  
- **Testers:** Read Sections 4 and 5 to derive functional and non-functional test cases.  
**1.4 Product Scope**  
CodeDojo is an integrated web application for first-year university students to learn programming through a structured, gamified, and AI-assisted platform. Students can:  
1. Progress through a structured curriculum (**Dojo Path**).  
2. Write and execute live Java and Python code directly in the browser using the Monaco Editor and Piston API.  
3. Receive real-time AI mentorship (**Sensei**) powered by Mistral AI when stuck.  
4. Upload PDF lecture slides/documents into the **Document Study Suite** to automatically generate AI flashcards, quizzes, and summaries via Google Gemini.  
The system runs entirely in modern web browsers without requiring local software installation. All progress, XP, and study materials are saved in MongoDB Atlas.  
**1.5 References**  
1. IEEE Std 830-1998, *IEEE Recommended Practice for Software Requirements Specifications*.  
2. UMP SPMP Document: SPMP-CD-001, *CodeDojo Arcade Software Project Plan*, April 2026.  
3. Vite Documentation: [https://vitejs.dev](https://vitejs.dev "https://vitejs.dev")  
4. React 19 Documentation: [https://react.dev](https://react.dev "https://react.dev")  
5. Express.js v5 Documentation: [https://expressjs.com](https://expressjs.com "https://expressjs.com")  
6. Mongoose v9 Documentation: [https://mongoosejs.com](https://mongoosejs.com "https://mongoosejs.com")  
7. Google Gemini API: [https://aistudio.google.com](https://aistudio.google.com "https://aistudio.google.com")  
8. Mistral AI API: [https://console.mistral.ai](https://console.mistral.ai "https://console.mistral.ai")  
9. Piston Code Execution API: [https://github.com/engineer-man/piston](https://github.com/engineer-man/piston "https://github.com/engineer-man/piston")  
10. Cloudinary API: [https://cloudinary.com](https://cloudinary.com "https://cloudinary.com")  
11. LangChain Documentation: [https://js.langchain.com](https://js.langchain.com "https://js.langchain.com")  
12. Monaco Editor: [https://microsoft.github.io/monaco-editor](https://microsoft.github.io/monaco-editor "https://microsoft.github.io/monaco-editor")  
13. Tailwind CSS v4: [https://tailwindcss.com](https://tailwindcss.com "https://tailwindcss.com")  
**1.6 Definitions, Acronyms and Abbreviations**  
| | |  
|-|-|  
| **Term / Acronym** | **Definition** |   
| **User** | A person using CodeDojo, primarily a first-year student learning to code. |   
| **Developer** | A person building, maintaining, and improving the CodeDojo software. |   
| **Tester** | A person validating that the software matches requirements. |   
| **Sensei** | The AI mentor persona embedded in the Dojo Path providing coding hints. |   
| **Dojo Path** | The structured, gamified curriculum module with coding challenges. |   
| **XP** | Experience Points earned by completing learning activities. |   
| **Piston API** | External code execution engine used to run Python and Java code. |   
| **JWT** | JSON Web Token used for secure user authentication. |   
| **Google Gemini** | AI service used for document processing, flashcards, and quizzes. |   
| **Mistral AI** | AI service powering Sensei's contextual coding hints. |   
   
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OMQ2AABAAsSNhRAF6EPYDLhGADSywEZJWQZeZ2aszAAD+4l6rrTq+ngAA8Nr1AIWsBDYDm5cLAAAAAElFTkSuQmCC)  
**2. Overall Description**  
**2.1 Product Perspective**  
CodeDojo is a brand new, self-contained web application built from scratch. It consists of two primary components connected via a REST API:  
| | | |  
|-|-|-|  
| **Part** | **Description** | **Technology Stack** |   
| **Backend API Server** | Handles user accounts, AI integration, document parsing, code execution proxying, quizzes, flashcards, leaderboards, and database operations. | Node.js, Express 5, Mongoose |   
| **Frontend User Interface** | Provides the browser dashboard, Dojo Path split-pane editor, document studio, quizzes, flashcards, and leaderboard. | React 19, Vite, Tailwind CSS v4, Monaco Editor |   
   
***External Services:***  
- **MongoDB Atlas:** Main database for user profiles, XP, documents, and progress.  
- **Google Gemini AI (** **gemini-2.5-flash-lite** **):** Generates summaries, flashcards, and quizzes from uploaded PDFs.  
- **Mistral AI (** **codestral-latest** ** via LangChain):** Powers Sensei, the AI programming mentor.  
- **Piston API:** Compiles and executes student Python and Java code safely.  
- **Cloudinary:** Cloud file storage for uploaded PDF study documents.  
**2.2 Change Requests for Old VOR**  
Not applicable. CodeDojo is a brand new software application with no legacy version.  
**2.3 Product Functions**  
***2.3.1 User Account Management***  
- **Registration:** Users sign up with a unique username (3+ chars), email, and password (6+ chars).  
- **Login:** Authentication returns a JSON Web Token (JWT) valid for 7 days.  
- **Profile Management:** View/update profile photo, username, and password.  
***2.3.2 Dojo Path (Arcade Learning Path)***  
- W3Schools-style split-pane view with curated Java and Python lessons.  
- Left side shows lesson narrative, concept explanation, code examples, and goals.  
- Right side contains a live Monaco Editor with pre-loaded starter code and terminal output console.  
- Lessons unlock sequentially (Lesson 1 must be completed to unlock Lesson 2).  
***2.3.3 Sensei AI (Coding Mentor)***  
- AI mentor powered by Mistral AI giving warm, professional, non-spoiler coding hints.  
- Evaluates lesson goals, student code, and terminal errors to provide logical guidance.  
- Maintains conversational chat history (up to 30 messages).  
***2.3.4 Document Study (AI Upload & Processing)***  
- Upload PDF lecture notes (up to 10MB) stored on Cloudinary.  
- Text extraction enables automated generation of flashcards, multiple-choice quizzes, and document summaries.  
***2.3.5 Flashcard & Quiz System***  
- Interactive flashcard viewer with card flipping, difficulty tags, and favoriting.  
- Automated 4-option multiple-choice quizzes with scoring and detailed post-quiz answer reviews.  
***2.3.6 Live Code Execution & Gamification***  
- Real-time compilation and execution of Java and Python code via Piston API (10s execution timeout).  
- Automatic XP awarding and dynamic level calculation: \text{Level} = \lfloor \sqrt{\text{XP} / 100} \rfloor + 1.  
- Global Top 50 Leaderboard updating in real time.  
**2.4 User Classes and Characteristics**  
- **Primary User (Student / "Ninja"):** First-year university students studying CS or IT.  
- **Technical Skill:** Beginner level. Requires intuitive UX, visual feedback, and clear explanation of errors.  
- **Usage Pattern:** Multiple times per week during university semesters.  
**2.5 Operating Environment**  
- **Server Side:** Node.js 18+, Express 5.2+, MongoDB 9.1+ (Mongoose), Docker & Docker Compose.  
- **Client Side:** Modern web browsers (Chrome, Firefox, Safari, Edge) supporting React 19, JavaScript ES2022+, and Web Speech API.  
**2.6 Design and Implementation Constraints**  
- **Code Execution Timeout:** 10-second hard limit on code execution requests to prevent server hang.  
- **Request Payload Limit:** JSON body request limit capped at 10 MB.  
- **AI Provider Dependency:** Reliance on Google Gemini and Mistral AI APIs.  
- **Database Dependency:** MongoDB Atlas instance is required for all data storage.  
**2.7 User Documentation**  
- Project README.md with complete installation, Docker, environment setup, and API route docs.  
- In-app lesson objectives, starter code descriptions, and Sensei AI on-demand help.  
**2.8 Assumptions and Dependencies**  
- **Assumptions:** Stable internet connection, modern web browser, English language support, PDF file uploads, Java and Python curriculum focus.  
- **Dependencies:** System availability relies on MongoDB Atlas, Google Gemini API, Mistral AI API, Piston API, and Cloudinary.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSeYxZw/lVeDGMACBrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA6fOBdd+dKAKAAAAAElFTkSuQmCC)  
**3. External Interface Requirements**  
**3.1 User Interfaces**  
- **Navigation:** Sidebar layout with direct links to Dashboard, Documents, Flashcards, Arcade, Leaderboard, Notifications, and Profile.  
- **Dojo Path Editor:** Split-screen layout combining curriculum narrative, Monaco code editor, and terminal output.  
- **Document Suite:** Integrated workspace featuring PDF previewer, chat panel, flashcards, and quizzes.  
**3.2 Hardware Interfaces**  
No specialized hardware is required. Standard personal computers, laptops, or tablets with internet access, keyboard, mouse/touchscreen, and optional audio speakers (for Web Speech API voice narration) are supported.  
**3.3 Software Interfaces**  
- **Backend:** Express 5 RESTful API.  
- **Database:** MongoDB via Mongoose ODM.  
- **External APIs:** Google Gemini, Mistral AI (via LangChain), Piston API, Cloudinary.  
**3.4 Communications Interfaces**  
- All client-server communications use **HTTPS / TLS encryption** with JSON request/response bodies.  
- JWT headers protect authenticated routes.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhwgJOUPcjIpnRgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseaJEEL8XMiYMAAAAASUVORK5CYII=)  
**4. System Features**  
**4.1 User Registration and Authentication**  
- **REQ-1:** New users shall register with a unique email, username, and password.  
- **REQ-2:** Returning users shall log in using valid email and password credentials.  
- **REQ-3:** Users shall be able to toggle password visibility during input.  
- **REQ-4:** Invalid credentials shall trigger clear error messages.  
- **REQ-5:** Successful login shall issue a secure JWT session token valid for 7 days.  
- **REQ-6:** Users shall be able to log out at any time.  
- **REQ-7:** Protected routes shall restrict access to authenticated users only.  
**4.2 AI-Powered Document Study**  
- **REQ-1:** Users shall upload PDF study documents up to 10MB in size.  
- **REQ-2:** Uploaded PDFs shall be stored in Cloudinary and rendered in an in-app viewer.  
- **REQ-3:** The system shall generate concise document summaries using Google Gemini.  
- **REQ-4:** The system shall extract and explain key concepts on demand.  
- **REQ-5:** The system shall generate interactive question-and-answer flashcards.  
- **REQ-6:** The system shall generate 4-option multiple-choice quizzes with explanations.  
- **REQ-7:** The quiz interface shall track answered questions and calculate final percentage scores.  
- **REQ-8:** Users shall chat with an AI assistant about document content.  
**4.3 Dojo Path Coding Arena**  
- **REQ-1:** Students shall select between Java and Python curriculum tracks.  
- **REQ-2:** Lessons shall be organized into ordered chapters starting from fundamentals.  
- **REQ-3:** Chapter progression shall be strictly sequential (unlocking upon completion).  
- **REQ-4:** Each lesson shall provide starter code in a Monaco Editor.  
- **REQ-5:** Code execution requests shall be processed via Piston API and display stdout/stderr.  
- **REQ-6:** Students shall request contextual coding hints from Sensei AI.  
- **REQ-7:** Incorrect code submissions shall prompt hints rather than direct full solutions.  
- **REQ-8:** Completing a lesson shall award XP and unlock the subsequent lesson.  
**4.4 Gamification (XP, Levels & Leaderboard)**  
- **REQ-1:** User level, title, and XP progress shall be prominently displayed in the top header.  
- **REQ-2:** XP shall be automatically awarded upon verified lesson completion.  
- **REQ-3:** The system shall maintain a live global leaderboard ranking top users by XP.  
- **REQ-4:** Daily login and activity streaks shall be tracked and displayed.  
**4.5 Notifications Center**  
- **REQ-1:** Notifications shall be generated for milestones, achievements, and system alerts.  
- **REQ-2:** The top bar notification icon shall feature an unread counter badge.  
- **REQ-3:** Users shall filter notifications by All, Unread, Achievements, or System.  
- **REQ-4:** Users shall mark notifications as read or clear their notification log.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OMQ2AABAAsSNhwgJGkPcrHpnRgQU2QtIq6DIze3UGAMBf3Gu1VcfXEwAAXrseaJkELjbMzy0AAAAASUVORK5CYII=)  
**5. Other Nonfunctional Requirements**  
**5.1 Performance Requirements**  
- **API Response Time:** API endpoints (authentication, progress, leaderboard) shall respond within  **200 milliseconds** under normal operation.  
- **AI Mentor Latency:** Sensei AI responses shall begin streaming/rendering within  **2 to 4 seconds**.  
- **Code Execution Speed:** Code execution via Piston API shall return stdout/stderr within  **3 to 5 seconds**.  
- **Page Load Time:** Application pages shall achieve full load within  **2 seconds** on standard broadband connections (10 Mbps+).  
- **Concurrent Capacity:** The system shall support at least  **500 concurrent active users** without performance degradation.  
- **Browser Memory Footprint:** The React client frontend memory usage shall not exceed  **150 MB** in the browser.  
**5.2 Safety Requirements**  
- **Auto-Save Guard:** Student code in the editor shall auto-save every  **10 to 15 seconds** to guard against unexpected connection loss.  
- **Isolated Sandbox Execution:** Student code execution shall run inside isolated sandboxed environments with strict memory (128 MB) and CPU timeout (5s) constraints to prevent host server crashes.  
- **AI Content Filtering:** Safety prompts shall block inappropriate or toxic AI outputs.  
- **Database Backups:** Automatic daily database backups shall prevent data loss.  
**5.3 Security Requirements**  
- **Authentication Security:** User sessions shall be secured using JWT tokens.  
- **Password Hashing:** Passwords shall be hashed using bcryptjs with 10 salt rounds prior to storage.  
- **Data Encryption:** All client-server and third-party API traffic shall enforce  **HTTPS / TLS encryption**.  
- **Role-Based Access Control:** API endpoints shall enforce permission checks for user data isolation.  
- **Environment Protection:** API keys and connection secrets must remain in server-side .env files.  
- **Input Sanitization:** Server inputs shall be validated against SQL/NoSQL injection and XSS.  
**5.4 Software Quality Attributes**  
- **Usability:** Intuitive split-screen interface, visual gamification, plain-language error reporting, and simple navigation.  
- **Reliability & Availability:** Target  **99.5% uptime** during academic semesters, with graceful fallback handling if third-party AI APIs experience service limits.  
- **Maintainability:** Modular component structure with clear separation of frontend, backend, AI services, and database models.  
- **Portability:** Cross-browser support for Chrome, Firefox, Safari, and Edge, responsive layouts, and Docker container support.  
- **Testability:** Decoupled REST API architecture supporting isolated automated unit and integration tests.  
**5.5 Business Rules**  
- **Account Prerequisite:** Only authenticated users may earn XP, save code progress, and submit leaderboard ranks.  
- **XP Award Policy:** XP is awarded exclusively for verified successful code submissions. Submitting duplicate identical code does not yield additional XP.  
- **Pedagogical AI Rule:** Sensei AI must guide students with conceptual hints and debugging tips, strictly withholding direct full copy-paste solutions on initial query.  
- **AI Rate Limiting:** Students are limited to  **30 AI mentor requests per hour** to prevent quota exhaustion.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANklEQVR4nO3OQQmAABRAsSfYxZo/jVEMYQLPJrCCNxG2BFtmZquOAAD4i3Ot7mr/egIAwGvXA4rLBc059ysnAAAAAElFTkSuQmCC)  
**6. Appendix A: Glossary**  
- **API:** Application Programming Interface.  
- **CORS:** Cross-Origin Resource Sharing.  
- **JWT:** JSON Web Token for stateless authentication.  
- **Monaco Editor:** Browser-based code editor powering VS Code.  
- **Piston:** Open-source code execution engine.  
- **RBAC:** Role-Based Access Control.  
- **REST:** Representational State Transfer architecture for web APIs.  
- **SRS:** Software Requirements Specification.  
- **SPMP:** Software Project Management Plan.  
- **XSS:** Cross-Site Scripting security vulnerability.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSfYxKK/kJXEkyE8WcGbCFuCLTOzVXsAAPzFsVZ3dX4cAQDgvesB/vEF9H9odtUAAAAASUVORK5CYII=)  
**7. Appendix B: Analysis Models**  
**B.1 System Context Model**  
[ Student Web Browser ]   
        │ (React 19 + Monaco Editor)  
        │ HTTPS / REST API  
        ▼  
 [ Node.js + Express Backend ]  
        ├──► MongoDB Atlas (Data Persistence)  
        ├──► Piston API (Code Execution)  
        ├──► Google Gemini API (Document Flashcards & Quizzes)  
        ├──► Mistral AI / LangChain (Sensei Coding Mentor)  
        └──► Cloudinary (PDF File Storage)  
   
**B.2 Data Flow: Code Execution**  
1. Student writes code in Monaco Editor and clicks **Run Code**.  
2. Frontend posts payload { language, code } to /api/arcade/run.  
3. Backend proxies execution request to **Piston API**.  
4. Piston API compiles/executes code and returns stdout, stderr, and exit code.  
5. Backend returns JSON result to frontend; terminal console displays output.  
**B.3 Data Flow: Sensei AI Hint Request**  
1. Student clicks **Ask Sensei** in Dojo Path.  
2. Frontend sends current lesson goals, student code, and terminal errors to /api/arcade/hint.  
3. Backend constructs prompt context and invokes **Mistral AI** via LangChain.  
4. Mistral AI generates a non-spoiler conceptual hint.  
5. Backend returns hint text; frontend renders hint in Sensei panel.  
**B.4 Data Flow: Document Study & Flashcard Generation**  
1. Student uploads PDF document on Documents page.  
2. Backend uploads PDF to **Cloudinary** and parses text via pdf-parse.  
3. Extracted text is dispatched to **Google Gemini** with flashcard prompt.  
4. Gemini generates structured question-and-answer pairs.  
5. Q&A pairs are saved to MongoDB linked to user ID and displayed in Flashcard Manager.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAANUlEQVR4nO3OQQmAABRAsSfYxKK/kYXEkyk8WcGbCFuCLTOzVXsAAPzFuVZ3dXw9AQDgtesB/v8F8JQadPwAAAAASUVORK5CYII=)  
**8. Appendix C: To Be Determined List**  
- **[TBD-01]:** Finalize exact XP threshold scaling formulas for higher student level boundaries.  
- **[TBD-02]:** Expand Java and Python curriculum content beyond initial 10 foundational chapters.  
- **[TBD-03]:** Design instructor telemetry dashboard UI for tracking class-wide struggle points.  
- **[TBD-04]:** Implement automated password reset / forgot-password email flow.  
- **[TBD-05]:** Determine maximum PDF upload count cap per student account.  
- **[TBD-06]:** Finalize mobile phone layout strategy for screen widths below 768px.  
![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnEAAAACCAYAAAA3pIp+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAM0lEQVR4nO3OUQmAABBAsaeI2MKqV8RyJrGCfyJsCbbMzFldAQDwF/dWrdXx9QQAgNf2B/NkAzRb7P0YAAAAAElFTkSuQmCC)  
