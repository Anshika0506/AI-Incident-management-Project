# ⚡ AI Incident Intelligence Platform

> **An intelligent Site Reliability Engineering (SRE) & Incident Management platform powered by Spring Boot 3, Spring Security (JWT), and Google Gemini AI (RAG).**

[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Security-JWT%20Stateless-blue.svg)](https://spring.io/projects/spring-security)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%201.5%20Flash-blueviolet.svg)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Problem Statement

During production outages (e.g., database connection pool exhaustion, memory leaks, unhandled exceptions), on-call engineers receive hundreds of noisy alerts and spend **45–60 minutes** manually grepping logs, inspecting stack traces, and diagnosing issues.

**This platform acts as an automated AI Incident Commander:**
1. Collects system alerts, incidents, and raw log entries.
2. Ingests and correlates log stack traces to specific incidents.
3. Uses **RAG (Retrieval-Augmented Generation)** with **Google Gemini AI** to produce an instant **Root Cause Analysis (RCA)** and an **Actionable 3-Step Remediation Playbook** in under 5 seconds.

---

## 🏗️ Architecture & Data Flow

[ Client / Postman / React UI ] │ │ HTTP REST Requests (with JWT Bearer Token in Header) ▼ [ Spring Boot Backend ] ├── 1. Spring Security ──► Validates JWT Token (Stateless Filter) ├── 2. REST Controllers ──► AuthController, IncidentController, LogController ├── 3. Service Layer ──► IncidentService, AIServiceImpl │ ├── Storage ──► JPA / Hibernate (H2 / MySQL) │ └── AI Engine ──► Google Gemini 1.5 Flash API (RAG Prompt Construction) └── 4. Repository Layer ──► Spring Data JPA

---
## 🚀 Key Features
* 🔐 **Enterprise Authentication**: User registration and login powered by **Spring Security 6**, **BCrypt Password Hashing**, and **Stateless JWT Tokens**.
* 📋 **Incident Lifecycle Management**: Full CRUD operations with severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) and statuses (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
* 🪵 **Log Correlation**: Attach raw logs, timestamps, log levels (`INFO`, `WARN`, `ERROR`), and stack traces to specific incidents.
* 🤖 **AI-Powered RAG Analysis**: Connects with **Google Gemini 1.5 Flash** using Spring Boot 3.2 `RestClient` to evaluate raw logs and return structured JSON diagnosis.
* 🛡️ **Zero Config Database**: Configured with **H2 In-Memory Database** for out-of-the-box local testing, with simple toggle for **MySQL**.
---

## 🛠️ Tech Stack
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Language** | Java 21 | Modern LTS Java runtime |
| **Framework** | Spring Boot 3.2.5 | Enterprise REST API framework |
| **Security** | Spring Security + JJWT | Stateless JWT authentication |
| **Database** | H2 Database / MySQL | Relational persistence & JPA Hibernate |
| **AI Integration** | Google Gemini 1.5 Flash API | RAG Root Cause & Playbook Generation |
| **Build Tool** | Apache Maven | Dependency management & lifecycle build |
---

## 📡 REST API Reference
### 1. Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | ❌ No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | ❌ No |
#### Register Request Body:
```json

