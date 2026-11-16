# 15. IMPORTANT — I WANT TO BUILD THIS MANUALLY

This is a learning project, not just a project-generation task.

I do NOT want Antigravity/Gemini or any AI tool to build the entire project automatically for me.

My goal is to understand everything from scratch:
* The core Problem Statement
* Overall System Architecture
* Spring Boot project structure
* How controllers, services and repositories interact
* Spring Security & JWT authentication
* JPA/Hibernate & Database relationships
* Redis integration
* AI integration (RAG concept)
* React ↔ Spring Boot communication

### How you should help me

Act as my **mentor + pair programmer**, NOT as an autonomous developer.

Do NOT:
* Generate the entire project at once
* Create hundreds of files automatically
* Modify multiple files without explaining
* Automatically complete the next feature
* Use AI-generated code that I cannot understand

Instead:

### Step-by-step learning approach

For every feature:
1. First explain what we are going to build.
2. Explain WHY we need it.
3. Explain where it belongs in the project structure.
4. Tell me which file I should create.
5. Give me a small amount of code at a time to type manually.
6. Let me run and test it.
7. Help me debug if I get an error.

---

# DEVELOPMENT ENVIRONMENT

## Backend
I will develop the Spring Boot backend manually in: **IntelliJ IDEA**
Backend stack: Java 21, Spring Boot, Maven, Spring Web, Spring Data JPA, Spring Security, MySQL, Redis, Lombok, Bean Validation.
I will write the backend code myself based on your guidance.

## Frontend
Frontend will be developed separately using: React, Vite, JavaScript / JSX, Tailwind CSS, Axios, Recharts (NO TypeScript). I will use VS Code for the frontend.

---

# PROJECT DEVELOPMENT RULE

We will build the project incrementally. Never skip steps.
STEP 1: You explain the concept.
STEP 2: You give me the architecture/flow.
STEP 3: You tell me what I need to create.
STEP 4: I create the file/code manually.
STEP 5: I send you my implementation.
STEP 6: You review it.
STEP 7: We test and debug.

---

# CURRENT TASK: PHASE 0 - PROBLEM STATEMENT & TECH STACK Q&A

I am a beginner and I want to start from absolute zero. Before writing ANY code or setting up ANY project, please teach me the foundational theory in a basic Q&A format.

Please explain the following in simple terms:
1. **The Problem Statement:** What exact problem does an "AI Incident Intelligence Platform" solve in the real world? Give a brief, realistic example of an on-call engineer using it.
2. **Tech Stack Q&A:** Why are we using this specific tech stack?
   - Why Spring Boot instead of Node.js or Python?
   - Why React instead of Angular or Vue?
   - Why MySQL?
   - Why Redis? (Explain simply)
   - How will the AI/LLM be integrated? (Explain the RAG concept simply)
3. **System Flow:** How will all these components talk to each other?

Then stop. Do NOT create the project automatically or give me `pom.xml` dependencies yet. Ask me if I understood the theory and if I am ready to start Phase 1 (Project Setup in IntelliJ).

My priority is:
**LEARNING > SPEED**

Welcome! I am thrilled to be your mentor and pair programmer on this journey. Building an **AI Incident Intelligence Platform** from absolute scratch will give you deep, real-world understanding of modern full-stack development, system architecture, enterprise patterns, and AI integration.

Learning by doing — typing every line of code yourself — is the single best way to master software engineering. I will guide you step-by-step without skipping anything or generating files automatically.

Let me break down **Phase 0: Foundational Theory** for you in clear, simple terms.

---

# Phase 0: Foundational Theory & Architecture

## 1. The Problem Statement

### What is an "AI Incident Intelligence Platform"?
In production software environments (like e-commerce apps, banks, or cloud services), servers and databases occasionally break, run out of memory, or drop connections. These events are called **Incidents**.

When an incident occurs:
1. Monitoring tools trigger hundreds of noisy log errors and system alerts.
2. Engineers on-call are woken up in the middle of the night.
3. They spend hours manually sifting through raw log files, database metrics, and code commits to understand **what broke** and **how to fix it**.

Our platform acts as an **intelligent command center**. It aggregates alerts, analyzes logs, correlates them with past post-mortems, and uses AI to automatically determine the **Root Cause** and suggest **Actionable Playbooks** to resolve the issue quickly.

---

### Realistic Scenario: Before vs. After

> **Scenario:** It is 2:00 AM on a Sunday. The payment processing service at a retail website suddenly starts throwing `HTTP 500 Internal Server Error` responses.

* **Without our platform (Traditional):**
  * The on-call engineer, Alex, gets alerted.
  * Alex logs into multiple tools: CloudWatch for logs, Grafana for server metrics, GitHub for recent code deployments.
  * Alex manually reads 5,000 lines of error logs to find the first stack trace.
  * **Time wasted finding the problem:** 45 - 60 minutes while users fail to check out.

* **With our AI Incident Intelligence Platform:**
  * The system receives the alert stream and raw logs.
  * **RAG (Retrieval-Augmented Generation)** searches historical incidents and finds a similar outage from 3 months ago.
  * The platform displays a unified card:
    * **Root Cause:** Database Connection Pool Exhausted (Max limit 20 reached).
    * **Correlated Trigger:** Deployment commit `#d8a29e` 15 minutes ago introduced an unclosed DB connection in `PaymentController.java`.
    * **AI Recommended Fix:** Revert commit `#d8a29e` or increase `spring.datasource.hikari.maximum-pool-size` to 50.
  * **Time to resolution:** 3 - 5 minutes.

---

## 2. Tech Stack Q&A

Why did we choose this specific tech stack for an enterprise application?

### A. Why Spring Boot (Java 21) instead of Node.js or Python?
* **Enterprise Standard:** Spring Boot is the world's most widely used framework for building mission-critical backend systems in banking, healthcare, and enterprise software.
* **Strong Typing & Safety:** Java 21 enforces strict typing at compile-time. If you rename a variable or misconfigure a function parameter, the compiler catches it *before* it runs in production.
* **Multi-Layer Architecture:** Spring Boot enforces clear separation of concerns (Controller $\rightarrow$ Service $\rightarrow$ Repository), preventing code from becoming messy as the application grows.

### B. Why React instead of Angular or Vue?
* **Component-Based UI:** React allows us to break down complex dashboards (incidents list, log viewer, AI diagnosis card, analytics charts) into small, reusable building blocks (`.jsx` components).
* **Massive Ecosystem & Flexibility:** It seamlessly integrates with libraries like `Recharts` for interactive graphs and `Axios` for HTTP communication.

### C. Why MySQL?
* **Relational Integrity:** Incidents, Users, Logs, Alerts, and Playbooks have strict relationships. For example:
  * One `User` is assigned to many `Incidents`.
  * One `Incident` has many `LogEntries`.
* **ACID Transactions:** Ensures that data is saved reliably without corrupting database states during simultaneous system updates.

### D. Why Redis? (Explained Simply)
* **What is Redis?** Redis is an **In-Memory** data storage system.
  * *Database (MySQL)* writes data to a hard drive disk $\rightarrow$ **Slower to read (~10-50 milliseconds)**.
  * *Redis* stores data directly in system RAM $\rightarrow$ **Ultra-fast to read (<1 millisecond)**.
* **Why do we need it in our platform?**
  1. **Caching:** Storing active, frequently viewed incident status updates so we don't spam the MySQL database with repetitive queries.
  2. **Security & Session Blacklisting:** Rapidly invalidating user JWT tokens on logout.
  3. **Rate Limiting:** Ensuring external log ingestion APIs don't crash our backend under heavy traffic bursts.
w-
### E. How is AI/LLM Integrated? (The RAG Concept)
* **What is RAG (Retrieval-Augmented Generation)?**
  * Think of an LLM (like ChatGPT/Gemini) as a brilliant student taking an exam.
  * If you ask a general LLM: *"Why did my Payment Service crash at 2:00 AM?"*, it cannot answer accurately because it has never seen your private log files or code.
  * **RAG is like giving the AI an open-book exam with your specific company data:**
    1. **Retrieve:** When an incident happens, our system retrieves the exact raw logs and relevant past incident reports from our database.
    2. **Augment:** We inject those real logs into a custom prompt context.
    3. **Generate:** We send the prompt + logs to the LLM API. The LLM reads *your real logs* and *generates* a precise root-cause analysis and step-by-step resolution.

---

## 3. Overall System Architecture & Data Flow

Here is how all the components will communicate with each other:

```
[ Engineer / User ]
        │
        ▼
   [ React UI ]  (Vite + JSX + Tailwind + Axios)
        │
        │ HTTP REST Requests (with JWT Bearer Token in Header)
        ▼
 [ Spring Boot Backend ]
   ├── 1. Spring Security  ──► Validates JWT Token (Checks Redis Blacklist)
   ├── 2. Controller       ──► Receives HTTP Requests & returns JSON responses
   ├── 3. Service Layer    ──► Executes Business Logic & RAG Prompt Building
   │      ├── Reads/Writes ──► [ MySQL Database ] (Persistent Storage)
   │      ├── Fast Caching ──► [ Redis Cache ]    (In-Memory RAM)
   │      └── OpenAI / LLM API ──► [ AI Model ]    (Root Cause Generation)
   └── 4. Repository Layer ──► Spring Data JPA / Hibernate (Executes SQL queries)
```

### Request Flow Step-by-Step:
1. The user opens the **React Dashboard** and clicks **"Analyze Incident"**.
2. **React** makes an HTTP POST request to `/api/v1/incidents/123/analyze` using `Axios`, passing an authentication **JWT Token**.
3. **Spring Security** intercepts the request and verifies the token.
4. The request reaches the **IncidentController**, which forwards it to the **IncidentService**.
5. The **IncidentService**:
   - Fetches incident logs from **MySQL** via **IncidentRepository**.
   - Checks **Redis** to see if an analysis was already cached recently.
   - If not cached, formats a **RAG Prompt** containing the log data and calls the **LLM API**.
6. The **LLM API** returns the root cause and playbook steps.
7. **IncidentService** saves the analysis into **MySQL**, caches it in **Redis**, and returns the result to **React**.
8. **React** renders a sleek analysis panel with actionable steps for the engineer.

---

### Ready for the next step?

Before we open IntelliJ IDEA to set up **Phase 1 (Project Setup & Architecture)**:
1. Did the concepts above make sense to you?
2. Do you have any questions about the problem statement, tech stack, or system flow?

Once you confirm you understand and are ready, we will proceed to **Phase 1**, where I will walk you through initializing your Spring Boot project step-by-step!
