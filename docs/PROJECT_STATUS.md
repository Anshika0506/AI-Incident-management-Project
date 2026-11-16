# 📌 AI Incident Intelligence Platform — Project Context & Progress Tracker

> **Last Updated:** October 17, 2026  
> **Status:** Backend RAG Pipeline + Full React (Vite + Tailwind) SRE Command Center UI Implemented, Connected, and Verified.

---

## 🧭 1. Project Overview & Working Rules

* **Project Goal:** Build an enterprise-grade Site Reliability Engineering (SRE) & Incident Management platform powered by Spring Boot and Google Gemini AI (RAG).
* **Learning Philosophy:** Pair-programming approach. Clear explanations, structured components, and complete full-stack connectivity.
* **Workspace Paths:**
  * **Documentation & Notes Workspace:** `C:\Users\lenovo\OneDrive\Documents\AI Incident Management`
  * **Frontend Web Application (Vite + React):** `C:\Users\lenovo\OneDrive\Documents\AI Incident Management\frontend`
  * **Spring Boot Project (IntelliJ):** `C:\Users\lenovo\OneDrive\Documents\AI Incident management Project\incident-management\incident-management`

---

## 🛠️ 2. Technology Stack & Configuration

* **Backend:** Java 22, Spring Boot 3.2.5, Maven, Spring Web, Spring Data JPA, Spring Security (CORS enabled), Lombok, Bean Validation.
* **Database:** H2 In-Memory (`jdbc:h2:mem:incidentdb`) / MySQL target.
* **AI / RAG Model:** Google Gemini 3.5 Flash (`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent`).
* **Frontend:**
  * React 19 (Vite 8, JSX, Tailwind CSS, Axios, Lucide Icons — No TypeScript).
  * Proxy: Vite server reverse proxies `/api` requests to Spring Boot (`http://localhost:8080`).
  * Real-time SRE Dashboard: Active incident queue, live telemetry terminal with stack traces, Gemini RAG analysis card, and interactive recovery playbooks.

---

## 🏗️ 3. What Has Been Completed So Far

### A. Domain Entities & Database Models (`model/`)
* `Incident.java`: Tracks incident `id`, `title`, `description`, `severity`, `status`, `createdAt`, `updatedAt`, `rootCause`, `suggestedPlaybook`, `confidenceScore`.
* `LogEntry.java`: Stores raw log entries mapped to an `incidentId`, `logLevel`, `sourceService`, `message`, `stackTrace`, `timestamp`.
* `User.java`: Authentication entity with `username`, `email`, `password`, `role`.
* Enums: `Severity`, `IncidentStatus`, `LogLevel`, `Role`.

### B. Repositories & DTOs (`repository/` & `dto/`)
* `IncidentRepository.java`, `LogRepository.java`, `UserRepository.java`.
* Request / Response DTOs with validation.

### C. Security & Cross-Origin Resource Sharing (CORS)
* `SecurityConfig.java`: Configured stateless security with BCrypt and full CORS support (`CorsConfigurationSource` permitting requests from frontend origins like `http://localhost:5173`).

### D. Controllers & Services
* `IncidentController.java`, `LogController.java`, `AuthController.java`.
* `AIServiceImpl.java`: Formats logs into RAG context string, calls Google Gemini 3.5 Flash API via Spring 3.2 `RestClient`, and persists results to the database.
* **AI Analysis Caching (Cache-Aside Pattern):**
  * Configured `@EnableCaching` in `IncidentManagementApplication.java`.
  * Implemented `@Cacheable(value = "incidentAnalysis", key = "#id")` in `IncidentServiceImpl.java`.
  * First AI request calls Google Gemini API (~3.5s); consecutive calls return instantly (<5ms) from RAM cache without repeating LLM token costs.

### E. Frontend Application (`frontend/`)
* **API Client Layer (`src/api/`):**
  * `client.js`: Axios client with proxy routing, JWT Bearer interceptor, and error handling.
  * `authService.js`: User login, registration, token persistence in localStorage, and logout.
  * `incidentService.js`: Full CRUD + Status Patch + Gemini Analysis trigger.
  * `logService.js`: Fetch incident logs & ingest telemetry events.
* **Components (`src/components/`):**
  * `Navbar.jsx`: Live backend connection badge, user auth pill (username + role), Sign In / Logout triggers.
  * `AuthModal.jsx`: SRE Security Gateway with Sign In and Create Account tabs, JWT authentication, and 1-click demo autofill.
  * `MetricsBar.jsx`: Key SRE metrics (Total Incidents, Active Critical, AI RAG Rate, MTTR).
  * `IncidentList.jsx`: Searchable, filterable queue with real-time severity styling.
  * `IncidentDetail.jsx`: Coordinated master-detail panel with lifecycle status switcher.
  * `LogStream.jsx`: Terminal-style telemetry viewer with log-level badges and expandable stack traces.
  * `AIDiagnosis.jsx`: Gemini RAG diagnosis card with root-cause callouts and interactive checklist playbook.
  * `CreateIncidentModal.jsx`: Incident creation form with validation.
  * `IngestLogModal.jsx`: Telemetry ingestion modal with 1-click presets (HikariCP, Redis, OOM, Stripe 502).

---

## 🚀 4. How to Run Frontend & Backend

1. **Backend (Spring Boot):**
   * Open IntelliJ IDEA.
   * Run `IncidentManagementApplication.java`.
   * Backend starts on `http://localhost:8080`.

2. **Frontend (React Vite):**
   * Terminal: `cd "C:\Users\lenovo\OneDrive\Documents\AI Incident Management\frontend"`
   * Run: `npm run dev`
   * Open: `http://localhost:5173` in any browser!

