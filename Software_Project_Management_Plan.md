# University of Mpumalanga
**School of Computing & Mathematical Sciences**

## Project Proposal: Software Project Management Plan

**Author(s):** Chosen333
**Mentor(s):** 
**Approver:** Mr. C Ndlovu
**Document reference number:** SPMP-CD-001
**Author contact details:**
Tel:	+2713 002 0255
e-mail: 	000000@ump.ac.za

---

### Document Information
| Field | Description |
|---|---|
| **CONFIDENTIALITY** | Confidential |
| **PROJECT TITLE** | CodeDojo Arcade Software Project Plan |
| **AUTHOR(S)** | Chosen333 |
| **DATE OF ISSUE** | 14 April 2026 |
| **KEYWORDS** | Gamified Learning, IDE, AI Mentor, Programming Education |
| **UNIT(s)** | School of Computing & Mathematical Science |

### Approved By
| Responsibility | Name | Signature |
|---|---|---|
| Approver | Mr. C Ndlovu | |

### Distribution To
| Company / Institution | Representative |
|---|---|
| University of Mpumalanga | Mr. C Ndlovu |

### Version Control
| Version | Date | Editor | Description |
|---|---|---|---|
| 1.0 | 2026-04-14 | Chosen333 | Initial Draft of the SPMP for CodeDojo Arcade |

---

## Table of Contents
1. Introduction
   1.1 Project Overview (Background & Motivation)
   1.2 References
   1.3 Project Deliverables
   1.4 Evolution of the SPMP
   1.5 Reference Material
   1.6 Definitions and Acronyms
2. Project Organization
   2.1 Process Model
   2.2 Organizational Structure
   2.3 Organizational Boundaries and Interfaces
   2.4 Project Responsibilities
3. Management Process
   3.1 Management Objectives and Priorities
   3.2 Assumptions, Dependencies, and Constraints
   3.3 Risk Management
   3.4 Monitoring and Control Mechanisms
4. Technical Process
   4.1 Methods, Tools, and Techniques
   4.2 Software Documentation
   4.3 Project Support Functions
5. Work Packages, Schedules, and Budget
   5.1 Work Packages
   5.2 Dependencies
   5.3 Resource Requirements
   5.4 Budget Requirements
   5.5 Budget and Resource Allocation
   5.6 Schedule
6. Project Success Criteria
   6.1 Network Diagram
   6.2 Project Milestones
   6.3 Approval Process
   6.4 Acceptance Criteria
   6.5 Critical Success Factors
7. Success Criteria
   7.1 Success Criteria
8. Summary

---

## 1. Introduction

### 1.1 Project Overview (Background & Motivation)
The modern educational landscape is rapidly evolving, with digital tools playing an increasingly vital role in how students grasp complex technical subjects. In computer science and related fields, first-year students often struggle with the steep learning curve associated with programming syntax, logic, and abstract concepts like memory management and control flow. Traditional lectures and static textbooks frequently fall short of providing the necessary interactive, hands-on experience required to build confidence and competence in writing code.

To address these challenges, interactive coding platforms have emerged as highly effective educational aids. Platforms that combine immediate execution feedback with guided instruction help bridge the gap between theoretical knowledge and practical application. However, many existing platforms either lack a structured, syllabus-aligned progression suitable for university courses or fail to provide contextual, personalized mentorship when a student encounters compilation or logic errors. This leaves a critical need for a more supportive, intelligent learning environment.

The CodeDojo Arcade application is a web-based, gamified programming tutor specifically targeted at university-level students. It transforms complex programming concepts into a structured, W3Schools-style split-pane experience, bringing hands-on coding directly to the browser. Fed by a curated curriculum, the platform utilizes advanced AI integration to embody "Sensei," a passionate technical mentor who provides contextual, non-spoiler hints based on a student's live code. By integrating a real-time experience points (XP) system and intelligent telemetry data to monitor student engagement and stumbling blocks, CodeDojo Arcade motivates self-paced learning and lowers the barrier to entry for mastering languages like Python and Java.

### 1.2 References
This document shall be used concurrently with any following publication, such that the latest approved version shall be the current document. 

### 1.3 Project Deliverables
The project will produce a running system that provides an intelligent, gamified programming education platform. The following items will be produced by the CodeDojo System developers:

* **A Software Project Management Plan (SPMP)** defining the technical and managerial processes necessary for the development and delivery of the CodeDojo Arcade system (This document).
* **System Requirements Specification (SRS)** describing the functional requirements (curriculum rendering, AI integration, code execution) and non-functional requirements (performance, reliability) of the platform.
* **A System Design Document** describing the high-level architecture (React frontend, Node/Express backend, MongoDB database), integration with third-party APIs (Piston for code execution, Google Gemini for the AI Sensei), UI/UX wireframes, and component interactions.
* **Curriculum Data Package** containing structured JSON models of the Java and Python lessons integrated into the platform.
* **A Test Manual** detailing unit tests, integration tests, and user acceptance tests performed on the CodeDojo Arcade before final deployment, ensuring all AI responses and code validations function as intended.
* **Source code** for all subsystems (Frontend and Backend) of the CodeDojo System, successfully containerized using Docker.

### 1.4 Evolution of the SPMP
The software project management plan is under version control. Proposed changes and new versions of the plan are submitted to the main stakeholder (Mr. C Ndlovu) for review and approval.

### 1.5 Reference Material
1. React.js and Vite Official Documentation
2. Google Gemini API Documentation for prompt integration
3. Piston Code Execution Engine API Documentation
4. MongoDB and Mongoose Documentation
5. W3Schools (as a structural layout reference)

### 1.6 Definitions and Acronyms
* **API:** Application Programming Interface
* **IDE:** Integrated Development Environment
* **JSON:** JavaScript Object Notation
* **MERN:** MongoDB, Express.js, React.js, Node.js
* **SPMP:** Software Project Management Plan
* **TTS:** Text-to-Speech
* **UI/UX:** User Interface / User Experience

## 2. Project Organization 

### 2.1 Process Model 
An Agile-based, iterative development model will be utilized. Because of periodic pauses due to university exams and tests, development occurs in weekly "sessions," each producing a testable internal release (e.g., UI rendering, code execution integration, AI integration).

### 2.2 Organizational Structure 
The project is executed by a single primary developer serving as the Project Manager, UX Designer, and Full-Stack Engineer, operating under the guidance of project mentors and the project approver.

### 2.3 Organizational Boundaries and Interfaces
The developer interfaces directly with the Approver (Mr. C Ndlovu) regarding milestone delivery and evaluation criteria. External system interfaces include the Piston API provider and Google Gemini API layer.

### 2.4 Project Responsibilities 
The primary developer is responsible for curriculum configuration, UI/UX design, frontend and backend implementation, testing, and deployment. The Approver handles final project sign-off and academic grading.

## 3. Management Process

### 3.1 Management Objectives and Priorities 
1. Deliver a functional, bug-free core application (code execution and gamified UI).
2. Ensure the "Sensei" AI persona operates within strict guidelines (no direct answers, appropriate professional tone).
3. Complete the project one month before the final presentation date to allow for rigorous testing and polish.

### 3.2 Assumptions, Dependencies, and Constraints 
* **Assumptions:** Users have access to a modern web browser and stable internet connection.
* **Dependencies:** The application relies on Google Gemini for AI operations and the Piston API for real-time code compilation. 
* **Constraints:** Time availability is highly restricted due to academic assessments. The system must accommodate a minimum engagement of exactly 1 focused session per week.

### 3.3 Risk Management 

**Table 2: Project risks with respective contingency measures**

| # | Risk | Likelihood: Low(L), Medium(M), High(H) | Significance | Contingency / Mitigation |
|---|---|---|---|---|
| 1 | Incomplete understanding of requirements, specifications or implementation | H | L | Mitigation depends on the ability to obtain all required documents, careful analysis, thus good relation and communication with the client and stakeholders. |
| 2 | Under-scoping the work | H | M | Frequent review of project milestones and discussions with the supervisor/client. |
| 3 | Poor timing on delivery | M | H | Adherence to the project rhythm (1 session/week); setting the "Code Freeze" one month before submission. Good project management practices. |
| 4 | External API Failure (Piston or Gemini) | M | H | Build robust frontend error handling and potential fallback messaging for students when APIs timeout. |
| 5 | System malfunctions or poor network testing | L | M | Careful preparation for and execution of tests, keeping awareness by involving the stakeholders. |
| 6 | Scope creep (adding too many features) | H | M | Strict adherence to the core W3Schools-style split-pane curriculum interface. |

### 3.4 Monitoring and Control Mechanisms       
Progress will be monitored via weekly codebase commits to the repository. Built-in system Telemetry modules will track compilation errors and usage patterns during user testing phases to refine the curriculum.

## 4. Technical Process

### 4.1 Methods, Tools, and Techniques 
* **Frontend:** React.js, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Web Speech API.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB configured with Mongoose schemas.
* **Containerization:** Docker & Docker-Compose.

### 4.2 Software Documentation 
Documentation will include embedded code comments, a continually updated `README.md` repository guide, the SRS, and this SPMP document. Code components shall adhere strictly to standard JSDoc comment formatting.

### 4.3 Project Support Functions 
Version control will be maintained using Git through a remote repository, providing source code backup and commit-history tracking.

## 5. Work Packages, Schedules, and Budget

### 5.1 Work Packages 
* **WP1: Infrastructure setup** (Docker, Repository setup, Database schemas)
* **WP2: Frontend UI & Framework** (Monaco integration, Curriculum parser, Split-pane layouts)
* **WP3: External API Integrations** (Piston code execution, Telemetry endpoint configurations)
* **WP4: AI Mentorship Integration** ("Ask Sensei" System Prompt, Context-aware hints, TTS module)
* **WP5: Testing & Polishing** (Gamification balancing, End-to-end trials, Code freeze deployment)

### 5.2 Dependencies 
WP3 cannot commence fully until WP1 setup is stable. WP4 depends significantly on the code evaluation logic output developed in WP3.

### 5.3 Resource Requirements 
A development workstation, reliable internet access for testing external service links, and free-tier access to remote endpoints (MongoDB Atlas cluster, Gemini API, Piston API).

### 5.4 Budget Requirements 
The project utilizes open-source resources and free-tier services, maintaining operational and development costs at a budget of R 0.00.

### 5.5 Budget and Resource Allocation
100% of human resources (the single developer's time) will be utilized for software engineering, design, and documentation tasks, distributed across the scheduled weekly blocks.

### 5.6 Schedule 
* **Month 1:** Commence WP1 and WP2.
* **Month 2:** Complete WP3 (Ensuring code compilation works smoothly).
* **Month 3:** Complete WP4 (Sensei AI fully integrated).
* **Month 4:** Complete WP5. The project enters a strict code freeze exactly one month before the presentation.

## 6. Project Success Criteria

### 6.1 Network Diagram 
*(A formal PERT/Gantt chart mapping out WP1 through WP5 will be maintained to reflect the sequential nature of UI, backend, and testing development.)*

### 6.2 Project Milestones 
* Milestone 1: Core frontend UI and code editor correctly initialized.
* Milestone 2: Successful integration of remote code compilation.
* Milestone 3: "Ask Sensei" features return appropriate contextual, non-breaking guidance.
* Milestone 4: Telemetry loop functions correctly. Project moves into Code Freeze for final review.

### 6.3 Approval Process 
Review of each primary milestone by the mentor and Mr. C Ndlovu to ensure alignment with academic expectations.

### 6.4 Acceptance Criteria 
The system must successfully load the curriculum elements, execute user code blocks correctly using external APIs, reject incorrect outputs, give valid AI hints, and properly simulate level-ups without crash errors.

### 6.5 Critical Success Factors
Strict adherence to the weekly 1-session minimum despite concurrent university assessments, ensuring that feature momentum is not entirely lost, and preventing unauthorized scope creep beyond the W3Schools-like split-pane parameters.

## 7. Success Criteria

### 7.1 Success Criteria
* Application environments launch successfully via Docker containers.
* All configured curriculum goals can be completed seamlessly on the UI.
* Student analytics (telemetry logic) transmit to MongoDB securely.
* Final development concludes 30 days prior to the final presentation date.

## 8. Summary
The CodeDojo Arcade project transforms modern web standards into an accessible programming tutor. This Software Project Management Plan organizes those ambitions into a controlled, risk-aware structure. By identifying strict milestone checks, establishing an interrupted but consistent weekly development rhythm, and integrating external APIs methodically, this project ensures academic success and a reliable educational platform for first-year IT learners.
