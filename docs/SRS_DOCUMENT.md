# Software Requirements Specification (SRS)
## for AegisOps AI: An AI-Powered Incident Intelligence and Autonomous Remediation Platform

---

### **Preliminary Pages (Medi-Caps University Format)**

#### **Title Page / Cover**
```
========================================================================================
                          A SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
                                              ON
            AI-POWERED INCIDENT INTELLIGENCE AND AUTONOMOUS REMEDIATION PLATFORM
                    (AegisOps AI — SRE Autonomous Incident Intelligence System)

           Submitted in partial fulfillment of the requirements for the award of 
                                    the degree of
                                BACHELOR OF TECHNOLOGY
                                          IN
                            COMPUTER SCIENCE & ENGINEERING

                                [ Medi-Caps University Logo ]

    SUBMITTED BY:                                          UNDER THE GUIDANCE OF:
    Anshika Kushwah                                        Prof. Trishna Panse
    Enrollment No: EN23CS301xxx                            Assistant Professor
    B.Tech (VII Sem), Dept. of CSE                         Dept. of Computer Science & Engg.

                                DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
                                            FACULTY OF ENGINEERING
                                     MEDI-CAPS UNIVERSITY, INDORE - 453331
                                           Academic Session: 2026-2027
========================================================================================
```

---

#### **Candidate's Declaration**
I hereby declare that the Software Requirements Specification (SRS) report entitled **"AI-Powered Incident Intelligence and Autonomous Remediation Platform" (AegisOps AI)** submitted to the Department of Computer Science & Engineering, Faculty of Engineering, Medi-Caps University, Indore, in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science & Engineering**, is an authentic record of my own research and development work carried out under the supervision and guidance of **Prof. Trishna Panse**.

I further declare that the content, system architecture, functional requirements, and models incorporated in this specification document have not been submitted previously to any other university, institute, or organization for the award of any degree, diploma, or fellowship.

**Date:** October 2026  
**Place:** Indore (M.P.)  

**Anshika Kushwah**  
Enrollment No: EN23CS301xxx  
B.Tech (VII Semester, CSE)  
Medi-Caps University, Indore  

---

#### **Certificate of Approval**
This is to certify that the Software Requirements Specification (SRS) entitled **"AI-Powered Incident Intelligence and Autonomous Remediation Platform" (AegisOps AI)** is a bonafide record of the work successfully carried out by **Anshika Kushwah (Enrollment No: EN23CS301xxx)** under my guidance and supervision, in partial fulfillment of the requirements for the degree of **Bachelor of Technology in Computer Science & Engineering** from Medi-Caps University, Indore during the academic session 2026-2027.

To the best of my knowledge, this report embodies original work and satisfies the technical depth and documentation standards prescribed by the University.

\
\
**Prof. Trishna Panse**  
Project Guide  
Department of CSE  
Medi-Caps University, Indore  

\
\
**Head of Department**  
Department of Computer Science & Engineering  
Faculty of Engineering  
Medi-Caps University, Indore  

\
\
**External Examiner**  
(Board of Examiners)  

---

# 1. Introduction

## 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) document is to provide a complete, formal description of the design, functional capabilities, performance boundaries, and operational constraints of **AegisOps AI: An AI-Powered Incident Intelligence and Autonomous Remediation Platform**.

This document defines the functional behavior of the system's high-throughput telemetry ingestion pipeline, its context-aware Retrieval-Augmented Generation (RAG) diagnostic engine powered by Google Gemini 3.5 Flash, its in-memory Cache-Aside acceleration layer, its relational audit persistence schema, and its real-time Site Reliability Engineering (SRE) command center dashboard. It serves as the definitive reference agreement between system developers, project supervisors, academic evaluators, and operations engineers.

## 1.2 Document Conventions
This document adheres to the **IEEE Std 830-1998** [1] (Recommended Practice for Software Requirements Specifications) standard. The following typographical and structural conventions are used throughout:
* **Boldface:** Used to indicate system components, modules, architectural layers, and mathematical variables (e.g., **Spring Boot**, **Google Gemini Flash**, **RestClient**, **Cache-Aside**, **JPA**).
* *Italics:* Used to introduce technical terms, file paths, and citations on first mention (e.g., *Retrieval-Augmented Generation*, *src/main/java/AIServiceImpl.java*, *application.properties*).
* `Monospace / Code Blocks:` Used for URLs, HTTP methods, headers, status codes, terminal commands, and database tables (e.g., `POST /api/v1/incidents/1/analyze`, `HTTP 403 Forbidden`, `log_entries`, `incidents`).
* **Requirement Identifiers:** 
  - `REQ-X.Y`: Functional Requirements (e.g., `REQ-1.1`, `REQ-2.3`).
  - `NFR-X.Y`: Non-Functional Requirements (e.g., `NFR-1.1`, `NFR-2.1`).
* **Priority Levels:** Each requirement implicitly carries a priority of *Essential* (mandatory for core incident intelligence operation) unless marked as *Desirable* or *Optional*.

## 1.3 Intended Audience and Reading Suggestions
This document is prepared for the following distinct groups of readers:
* **Academic Evaluation Committee & Project Supervisors:** 
  - *Reading Focus:* Section 1 (Introduction), Section 2 (System Overview & Architecture), and Section 6 (System Models & Behavioral Specifications).
  - *Purpose:* To evaluate academic rigor, technical feasibility, theoretical modeling (RAG grounding, Cache-Aside pattern), and benchmark validation against enterprise SRE standards.
* **Software & Systems Engineers / Developers:** 
  - *Reading Focus:* Section 3 (External Interface Requirements), Section 4 (System Features), and Section 5 (Database Schema & DTOs).
  - *Purpose:* To implement, maintain, and extend backend services, API controllers, and frontend visualization components.
* **Site Reliability Engineers (SREs) & DevOps Analysts:** 
  - *Reading Focus:* Real-Time SRE Dashboard Specifications, Telemetry Ingestion, Incident Logging, Playbook Execution, and Failure Recovery.
  - *Purpose:* To monitor live incident queues, interpret root-cause diagnoses, and execute recovery playbooks.

## 1.4 Product Scope
**AegisOps AI** is an intelligent, high-speed, self-contained Incident Intelligence and Autonomous Remediation Platform designed to protect distributed microservices and cloud infrastructures from extended outages and cascading failures.

**Core Capabilities:**
* **High-Throughput Telemetry Ingestion:** Operates as an enterprise ingestion gateway that continuously captures distributed exception traces and logs across microservices with sub-millisecond response times.
* **Context-Aware RAG Diagnostic Engine:** Pairs real-time system logs with Google Gemini 3.5 Flash using low-temperature prompt engineering to deliver deterministic, hallucination-free Root Cause Analysis (RCA) and actionable remediation playbooks in under 5 seconds.
* **High-Velocity Cache-Aside Layer:** Utilizes Spring Boot's Cache Abstraction (`@Cacheable`) to store analysis results in memory/Redis, slashing repeat query latencies to < 5ms and eliminating 100% of redundant LLM token costs.
* **Relational Audit Persistence:** Maintains strict ACID relational integrity across users, operational incidents, and telemetry logs in H2 In-Memory and MySQL 8.0 databases.
* **Live SRE Command Center:** Provides a modern, dark-mode single-page dashboard built with React 19, Tailwind CSS, and Axios featuring real-time KPI metrics, terminal-style telemetry streaming, expandable stack traces, and interactive recovery playbooks.

---

# 2. Overall Description

## 2.1 Product Perspective
AegisOps AI is a self-contained, high-performance reliability management layer positioned between distributed microservices and on-call engineering teams. It functions as an autonomous Layer 7 Incident Commander.

Instead of requiring engineers to manually aggregate CloudWatch logs, search Grafana graphs, and trace code commits during a 2:00 AM outage, AegisOps AI centralizes telemetry ingestion. Every incoming error trace is parsed, linked to an operational incident, grounded into an LLM context window, and transformed into an actionable recovery checklist.

## 2.2 Product Functions
The major functional capabilities of AegisOps AI include:
* **Traffic & Telemetry Ingestion:** Intercepts and persists raw application exception logs, stack traces, and severity levels from upstream microservices.
* **Incident Lifecycle State Machine:** Governs operational outage workflows strictly adhering to deterministic lifecycle states: `OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
* **Dynamic RAG Prompt Engineering:** Dynamically extracts recent contextual logs from the database, builds an augmented SRE system prompt, and submits it to Google Gemini 3.5 Flash.
* **Autonomous Root Cause & Playbook Synthesis:** Parses model outputs into structured JSON containing the definitive root cause, statistical confidence score, and numbered recovery steps.
* **Cache-Aside Acceleration:** Caches incident diagnoses in memory, dropping subsequent query latencies from ~3.5 seconds to < 5 milliseconds.
* **Live SRE Command Center UI:** Renders active incident queues, severity filter toggles, live telemetry terminals, and interactive playbook checkboxes.
* **Outage Simulation & Smart Demo Mode:** Provides 1-click real-world outage presets (HikariCP pool exhaustion, Redis split-brain, Kafka offset lag, Out-of-Memory) for instant evaluation.

## 2.3 User Classes and Characteristics
| User Class | Technical Skill Level | Primary Responsibilities & Interaction |
| :--- | :--- | :--- |
| **On-Call SRE Engineer** | Advanced / DevOps & SRE | Monitors active incident feeds, inspects stack traces, triggers Gemini AI analysis, and executes recovery playbooks. |
| **Backend Microservice Developer** | Intermediate / Software Eng. | Integrates service error handlers with `POST /api/v1/logs`; inspects root-cause reports to fix recurring bugs. |
| **DevOps / Infrastructure Admin** | Advanced / Systems Engineering | Manages database connections, configures cloud Gemini API keys, and audits MTTR performance metrics. |
| **Technical Auditor / Evaluator** | Advanced / Academic Reviewer | Inspects architectural design, compile-time safety, stateless security enforcement, and test coverage. |

## 2.4 Operating Environment
AegisOps AI is engineered to operate in cross-platform containerized and on-premise cloud environments:
* **Hardware Platform:** x86_64 or ARM64 architecture (minimum 2.0 GHz dual-core CPU, 4 GB RAM, 1 GB disk space).
* **Operating Systems:** Windows 10/11, Ubuntu 20.04/22.04 LTS, Debian 12, or macOS 12+.
* **Backend Runtime:** Java Development Kit (JDK) 21 or 22 (LTS 64-bit), Spring Boot 3.2.5, Maven 3.9+.
* **Database Engine:** H2 In-Memory Database (development/demo) and MySQL 8.0+ / PostgreSQL (production target).
* **Frontend Runtime:** Node.js 20+, Vite 8.x, React 19, Tailwind CSS 3.4, Axios 1.7.
* **Cloud AI Service:** Google Gemini 3.5 Flash REST API (`generativelanguage.googleapis.com`).
* **Web Client / Browser:** Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+.

## 2.5 Design and Implementation Constraints
* **Compile-Time Type Safety:** Java strong typing and JPA entity relationships catch schema bugs at compile-time rather than during production runtime.
* **Ultra-Low Latency Budget (<5 ms Cache Hit):** Repeated queries must bypass the cloud AI model and return instantly from in-memory cache.
* **Stateless Architecture:** HTTP sessions are strictly stateless (`SessionCreationPolicy.STATELESS`); all authentication relies on cryptographically signed JWTs.
* **DTO Encapsulation:** Database entities are never exposed over the network; all communications utilize validated Data Transfer Objects (DTOs).
* **Token Budget Control:** Prompts limit log windows to the latest contextual error traces to prevent LLM token overflow.

## 2.6 User Documentation
The system provides comprehensive technical documentation:
* **Interactive REST API Documentation:** Clean controller contracts and DTO definitions across `/api/v1/incidents`, `/api/v1/logs`, and `/api/auth`.
* **System README & Walkthrough:** Comprehensive markdown guides detailing quickstart steps, frontend architecture, and SRE flows.
* **College Viva & Interview Guide:** Exhaustive question-and-answer guide covering RAG architecture, Cache-Aside pattern, and Spring Security.

## 2.7 Assumptions and Dependencies
* **Outbound HTTPS Connectivity:** Assumes the host server has stable outbound HTTPS access on port 443 to Google Cloud AI APIs.
* **Structured Microservice Logs:** Assumes upstream services produce JSON error payloads conforming to standard severity levels.
* **Database Availability:** Assumes H2 In-Memory DB or MySQL server is active and accessible via Spring Data JPA.
* **Modern Web Standards:** Assumes user browsers support modern ECMAScript standards, CSS Flexbox/Grid, and HTML5.

---

# 3. External Interface Requirements

## 3.1 User Interfaces
The system provides a responsive, dark-mode single-page web dashboard for incident intelligence and remediation. The interface is built using React 19, Vite, and Tailwind CSS, accessible at `http://localhost:5173`.

The dashboard is structured into five core visual sections:
* **Header & Status Bar:** Displays platform branding (**AegisOps AI**), an on-call engineer badge, and a real-time backend connection status pill (*Connected* vs. *Demo Mode*).
* **Top SRE Metrics Cards:** Four summary KPI cards showing live operational metrics: **Total Incidents**, **Active Critical Outages**, **AI RAG Rate**, and **Target MTTR (<5s)**.
* **Incident Queue & Priority Filter:** Searchable master list of incidents with color-coded severity badges (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) and status lifecycle dropdowns.
* **Telemetry Terminal & Stack Trace Inspector:** Dark console terminal streaming raw microservice logs with color-coded log-level tags (`ERROR`, `FATAL`) and expandable exception stack traces.
* **AI Diagnosis Card & Interactive Playbook:** Displays Gemini AI root-cause analysis, confidence score, and an interactive checklist of recovery steps that engineers can check off during an outage.
* **Ingest Log Modal:** Telemetry submission form with 1-click real-world SRE outage presets (HikariCP exhaustion, Redis split-brain, OOM).

## 3.2 Hardware Interfaces
* **Network Interface Card (NIC):** Listens for incoming HTTP REST traffic on port 8080 (Spring Boot) and port 5173 (Vite).
* **Storage Drive (SSD/HDD):** Persists database records to disk (when using MySQL) and logs system events.
* **Processor (CPU):** Executes Java Virtual Machine bytecode, Spring Security cryptographic hashing, and JPA relational queries.

## 3.3 Software Interfaces
* **Spring Boot 3.2.5 Framework:** Core application runtime managing dependency injection, controller routing, and JPA repositories.
* **Relational Database (H2 / MySQL 8.0):** Connected via Spring Data JPA / Hibernate and HikariCP connection pooling.
* **Google Gemini 3.5 Flash REST API:** Invoked via Spring 3.2's `RestClient` over HTTPS with server-isolated API keys.
* **React 19 & Axios:** Frontend HTTP client communicating with backend endpoints via Vite reverse proxy.

## 3.4 Communications Interfaces
* **HTTP / REST (Client-to-Backend):** Clients send asynchronous HTTP/1.1 requests (`GET`, `POST`, `PATCH`) carrying JSON request bodies and `Authorization: Bearer <token>` headers.
* **Reverse Proxy:** Vite server forwards `/api` requests from port 5173 to backend port 8080.
* **CORS Policy:** Spring Security `CorsConfigurationSource` permits frontend origins, preventing cross-origin blocking.

---

# 4. System Features

## 4.1 Feature 1: Real-Time Telemetry Ingestion and Relational Log Correlation
### 4.1.1 Description and Priority
Intercepts and persists raw application exception logs and stack traces from distributed microservices, mapping them relationally to active incidents.
* **Priority:** High (Core Ingestion Functionality)
* **Benefit:** 9/9 (Required to capture production error telemetry)
* **Risk:** 2/9 (Low risk, standard asynchronous REST API)

### 4.1.2 Stimulus/Response Sequences
1. **Stimulus:** External microservice emits `POST /api/v1/logs` with `incidentId`, `logLevel`, `sourceService`, `message`, and `stackTrace`.
2. **Validation:** Backend validates foreign key integrity against the `incidents` table.
3. **Persistence:** Log is saved to the database with a server timestamp.
4. **Response:** Server returns `HTTP 201 Created` with saved `LogResponse` DTO.

### 4.1.3 Functional Requirements
* **REQ-1.1:** The system SHALL expose `POST /api/v1/logs` to ingest microservice telemetry records.
* **REQ-1.2:** The system SHALL enforce foreign key integrity; if the referenced incident does not exist, it SHALL reject the payload with `HTTP 400 Bad Request`.
* **REQ-1.3:** The system SHALL store `log_level`, `source_service`, `message`, multiline `stack_trace`, and automatic timestamp.
* **REQ-1.4:** The system SHALL expose `GET /api/v1/logs/incident/{id}` returning logs sorted chronologically descending.
* **REQ-1.5:** The ingestion pipeline SHALL complete log persistence in under 15 milliseconds.

## 4.2 Feature 2: Context-Aware RAG Pipeline and Gemini AI Root Cause Analysis
### 4.2.1 Description and Priority
Performs Retrieval-Augmented Generation (RAG) by retrieving real incident logs from the database, constructing an engineered SRE prompt, and invoking Google Gemini 3.5 Flash.
* **Priority:** High (Core Intelligence Engine)
* **Benefit:** 9/9 (Automates root cause diagnosis and playbook generation)
* **Risk:** 3/9 (Requires robust error handling for cloud API quotas)

### 4.2.2 Stimulus/Response Sequences
1. **Stimulus:** On-call engineer clicks 'Run Gemini Analysis' (`POST /api/v1/incidents/{id}/analyze`).
2. **Retrieval:** System retrieves incident metadata and all linked logs from the database.
3. **Augmentation:** Injects logs into a domain prompt instructing Gemini to act as a Principal SRE.
4. **Generation:** Gemini 3.5 Flash returns structured JSON with `rootCause`, `confidenceScore`, and `suggestedPlaybook`.
5. **Persistence:** Findings are saved to the incident entity and returned to the client.

### 4.2.3 Functional Requirements
* **REQ-2.1:** The system SHALL retrieve all linked telemetry logs for the specified incident ID upon analysis trigger.
* **REQ-2.2:** The system SHALL construct a domain-specific SRE prompt mandating JSON output format.
* **REQ-2.3:** The system SHALL invoke Google Gemini 3.5 Flash using `RestClient` with low temperature (`0.2`).
* **REQ-2.4:** The system SHALL parse returned JSON and update `root_cause`, `confidence_score`, and `suggested_playbook` in the database.
* **REQ-2.5:** If Gemini API times out or returns HTTP 429/503, the system SHALL catch the error and return a safe fallback diagnosis without crashing.

## 4.3 Feature 3: Cache-Aside Acceleration Layer
### 4.3.1 Description and Priority
Implements the Cache-Aside pattern via Spring Boot Cache Abstraction to eliminate redundant LLM calls and achieve sub-5ms repeat query performance.
* **Priority:** High (Cost and Latency Optimization)
* **Benefit:** 9/9 (Saves 100% LLM token costs on repeat queries)
* **Risk:** 2/9 (Low risk, standard in-memory caching)

### 4.3.2 Stimulus/Response Sequences
1. **Stimulus:** Client requests analysis for an incident (`POST /api/v1/incidents/{id}/analyze`).
2. **Cache Check:** System checks cache key `incidentAnalysis::{id}`.
3. **Cache HIT:** Returns cached analysis in < 5ms without calling Gemini.
4. **Cache MISS:** Executes Gemini AI call, populates cache, and returns result.

### 4.3.3 Functional Requirements
* **REQ-3.1:** The system SHALL annotate `analyzeIncident(id)` with `@Cacheable(value="incidentAnalysis", key="#id")`.
* **REQ-3.2:** Repeat analysis requests for an analyzed incident SHALL return in under 5 milliseconds.
* **REQ-3.3:** Cached queries SHALL consume zero Google Gemini API tokens.
* **REQ-3.4:** The caching layer SHALL support seamless migration to Redis without code changes.

## 4.4 Feature 4: SRE Command Center Dashboard, Incident Lifecycle & Interactive Playbook
### 4.4.1 Description and Priority
Provides an interactive React 19 single-page dashboard for incident investigation, lifecycle transitions, and playbook execution.
* **Priority:** High (Primary Operator Interface)
* **Benefit:** 8/9 (Empowers on-call engineers with unified visibility)
* **Risk:** 2/9 (Non-blocking asynchronous frontend)

### 4.4.2 Stimulus/Response Sequences
1. **Stimulus:** Engineer selects an incident and toggles status dropdown to `RESOLVED`.
2. **API Call:** Frontend issues `PATCH /api/v1/incidents/{id}/status?status=RESOLVED`.
3. **DB Update:** Entity status and `updatedAt` timestamp are persisted in the database.
4. **UI Sync:** UI dynamically updates status badges and metrics counters.

### 4.4.3 Functional Requirements
* **REQ-4.1:** The dashboard SHALL display live KPI metrics: Total Incidents, Active Critical, RAG Rate, MTTR.
* **REQ-4.2:** The dashboard SHALL render AI playbooks as interactive checklist checkboxes.
* **REQ-4.3:** The system SHALL support status transitions: `OPEN` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
* **REQ-4.4:** The dashboard SHALL include 1-click outage presets for instant testing.
* **REQ-4.5:** If the backend is offline, the frontend SHALL display a Demo Mode banner without crashing.

---

# 5. Nonfunctional Requirements

## 5.1 Performance Requirements
Because AegisOps AI manages live telemetry and incident response, latency directly impacts the Mean Time to Resolution (MTTR).
* **NFR-1.1 (Inspection & AI Latency Overhead):** On a cache miss, the complete RAG cycle (log retrieval + Gemini inference + DB update) SHALL complete within 3.0 to 5.0 seconds.
* **NFR-1.2 (Cache-Hit Sub-5ms Latency):** Repeat queries for analyzed incidents SHALL return from in-memory cache in under 5 milliseconds (< 5ms).
* **NFR-1.3 (Database Query Throughput):** Indexed primary and foreign key queries via HikariCP connection pool SHALL execute in under 15 milliseconds.
* **NFR-1.4 (Frontend Responsiveness):** Dashboard UI state updates and tab switches SHALL render within 50 milliseconds.

## 5.2 Safety Requirements
In enterprise reliability software, safety refers to preventing system crashes and ensuring exceptions in external cloud APIs do not disrupt service availability.
* **NFR-2.1 (Fail-Safe Exception Handling):** If Google Gemini API encounters rate limits (HTTP 429) or cloud downtime (HTTP 503), the backend catches the exception and returns a safe fallback diagnosis without throwing unhandled 500 errors.
* **NFR-2.2 (Database Connection Pool Safeguard):** HikariCP maintains pre-established database connections, preventing connection leaks or exhaustion.
* **NFR-2.3 (Payload Truncation Safeguard):** Log ingestion truncates oversized payloads to prevent out-of-memory crashes.

## 5.3 Security Requirements
As an enterprise operations platform, AegisOps AI must preserve system security and credential safety.
* **NFR-3.1 (Stateless JWT Authentication):** Protected endpoints validate HMAC-SHA256 tokens on every request via `AuthTokenFilter`.
* **NFR-3.2 (Password Hashing):** User passwords MUST be hashed using BCrypt (cost factor 10). Plaintext passwords SHALL NEVER be stored.
* **NFR-3.3 (API Secret Isolation):** Google Gemini API keys remain server-side and are NEVER exposed to client bundles.
* **NFR-3.4 (SQL Injection Prevention):** All database queries use parameterized Spring Data JPA/Hibernate ORM mappings.
* **NFR-3.5 (CORS Configuration):** Spring Security permits trusted frontend origins (e.g., `localhost:5173`).

## 5.4 Software Quality Attributes
1. **Correctness & Determinism:** Low temperature (`0.2`) in LLM prompts ensures deterministic root cause analysis.
2. **Maintainability & Modularity:** Strict 3-layer architecture (`Controller` $\rightarrow$ `Service` $\rightarrow$ `Repository`) ensures clean separation of concerns.
3. **Portability:** Runs cross-platform on Windows, Linux, and macOS using standard JDK 21+ and Node.js.
4. **Usability & Testability:** Self-contained demonstration setup with 1-click outage presets and automated sample data seeding.

---

# 6. Project Plan

## 6.1 Team Members
This is an individual engineering capstone project designed, developed, and evaluated by:
* **Name:** Anshika Kushwah
* **Enrollment No:** EN23CS301xxx
* **Role:** Lead Researcher & Full-Stack System Developer
* **Project Title:** AegisOps AI — AI-Powered Incident Intelligence and Autonomous Remediation Platform
* **Academic Level:** Undergraduate / B.Tech (VII Semester) Project-1

## 6.2 Division of Work
As a solo engineering project, all software development lifecycle (SDLC) responsibilities were carried out individually across five distinct phases:
1. **Requirements Analysis & SRE Domain Research:** Investigated SRE downtime bottlenecks, formulated problem statement, and drafted IEEE Std 830-1998 compliant SRS.
2. **Database Schema & JPA Entity Modeling:** Modeled relational entities (`User`, `Incident`, `LogEntry`), implemented repositories, and configured HikariCP connection pool.
3. **AI RAG Pipeline & Gemini API Integration:** Implemented `AIServiceImpl` with Spring `RestClient`, engineered structured SRE system prompts, and built JSON response parsing.
4. **Cache-Aside Layer & Security Implementation:** Configured `@EnableCaching` with `@Cacheable`, implemented BCrypt password hashing, and built stateless JWT filter chain.
5. **React SRE Command Center & Verification:** Built responsive React 19 UI with Tailwind CSS, live telemetry terminal, interactive checklist playbooks, and 1-click outage presets.

## 6.3 Time Schedule
| Week | Focus Area | Detailed Activities & Deliverables |
| :--- | :--- | :--- |
| **Week 1** | Literature Review & Topic Finalization | Surveyed enterprise SRE outages; studied MTTR bottlenecks; defined scope of AegisOps AI; drafted project synopsis. |
| **Week 2** | Architecture Design & Tech Stack Selection | Finalized Spring Boot 3.2, Java 22, React 19, and Google Gemini Flash; designed system block diagram. |
| **Week 3** | Requirement Gathering & Analysis | Collected functional and non-functional requirements; determined latency budgets (<5s AI, <5ms Cache). |
| **Week 4** | SRS Formulation & Validation | Formulated IEEE Std 830-1998 compliant SRS; validated functional requirements and data dictionaries. |
| **Week 5** | Database Design & JPA Modeling | Modeled User, Incident, and LogEntry entities; established foreign key relationships; configured H2/MySQL. |
| **Week 6** | Security & JWT Authentication | Built AuthTokenFilter, JwtUtils, BCrypt password hashing, and Spring Security CORS configuration. |
| **Week 7** | Core RAG Pipeline & Gemini AI Engine | Implemented log retrieval, prompt engineering, Google Gemini 3.5 Flash RestClient call, and JSON parser. |
| **Week 8** | Cache-Aside Acceleration Layer | Configured @EnableCaching and @Cacheable; verified sub-5ms latency on repeat incident analysis calls. |
| **Week 9** | React 19 SRE Command Center UI | Built master-detail incident queue, telemetry terminal with stack trace viewer, and interactive playbooks. |
| **Week 10** | System Verification & Final Submission | Executed end-to-end test cases TC-01 to TC-08; compiled final report, slides, and viva documentation. |

---

# Appendix

## Appendix A: Glossary
| Term | Definition |
| :--- | :--- |
| **SRE** | Site Reliability Engineering — Discipline that applies software engineering principles to infrastructure and operations. |
| **RAG** | Retrieval-Augmented Generation — Architectural pattern grounding LLM outputs in private database telemetry context. |
| **RCA** | Root Cause Analysis — The systematic process of identifying the fundamental originating cause of a service failure. |
| **MTTR** | Mean Time to Resolution — Average duration required to diagnose, triage, and remediate a production outage. |
| **JWT** | JSON Web Token — Compact, URL-safe means of representing signed claims between client and server (RFC 7519). |
| **JPA** | Java Persistence API — Jakarta enterprise standard for object-relational mapping and entity persistence in Java. |
| **DTO** | Data Transfer Object — Dedicated network boundary object isolating database entities from external clients. |
| **HikariCP** | Default high-performance JDBC connection pool used by Spring Boot for rapid database connection reuse. |
| **Cache-Aside** | Caching design pattern where the application checks cache first, queries DB/API on miss, and populates cache. |

## Appendix B: To Be Determined (TBD) List
| TBD ID | Component / Area | Description & Resolution Strategy |
| :--- | :--- | :--- |
| **TBD-1** | Vector Database (Qdrant / PGVector) | Convert historical post-mortems into vector embeddings for semantic cross-incident similarity search. |
| **TBD-2** | Distributed Kafka Telemetry Ingestion | Migrate REST log ingestion to Apache Kafka event streams for high-throughput scaling (>50,000 logs/sec). |
| **TBD-3** | Closed-Loop Autonomous Remediation | Implement automated Kubernetes pod restart and connection pool expansion webhooks with human approval triggers. |
| **TBD-4** | Asymmetric RSA / ECDSA JWKS Rotation | Replace symmetric HMAC-SHA256 secret keys with asymmetric public-key JWKS rotation endpoints. |

---

# References
[1] IEEE Std 830-1998, *IEEE Recommended Practice for Software Requirements Specifications*, IEEE Computer Society, 1998.  
[2] P. Lewis et al., *"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks,"* in *Advances in Neural Information Processing Systems (NeurIPS)*, vol. 33, pp. 9459-9474, 2020.  
[3] B. Beyer, C. Jones, J. Petoff, and N. R. Murphy, *Site Reliability Engineering: How Google Runs Production Systems*. O'Reilly Media, 2016.  
[4] Broadcom / VMware Tanzu, *"Spring Boot Reference Documentation (v3.2.5),"* 2024. [Online]. Available: `https://docs.spring.io/spring-boot/docs/3.2.5/reference/html/`  
[5] Google Cloud AI, *"Google Gemini Generative AI Platform Documentation,"* 2025/2026. [Online]. Available: `https://ai.google.dev/docs`  
[6] M. Jones, J. Bradley, and N. Sakimura, *"JSON Web Token (JWT),"* RFC 7519, IETF Internet Standard, May 2015.  
[7] B. Poitras, *"HikariCP: Fast, simple, reliable JDBC connection pool,"* 2024. [Online]. Available: `https://github.com/brettwooldridge/HikariCP`  
