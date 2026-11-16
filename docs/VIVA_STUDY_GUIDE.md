# 🎓 AI Incident Intelligence Platform — College Viva & Interview Guide

> **Prepared for:** Anshika Kushwah  
> **Topic:** Full-Stack Architecture, Spring Boot 3, Google Gemini AI (RAG), and SRE Engineering.

---

## 📌 Top 10 Viva Questions & Exact Answers

### Q1. What does your project actually do? (Elevator Pitch)
**Answer:**  
*"In production systems, when an outage occurs (like database connection exhaustion or server timeouts), on-call engineers receive hundreds of noisy error logs and spend 45 to 60 minutes finding the root cause.  
My project, the **AI Incident Intelligence Platform**, automates this process. It ingests microservice logs, links them to incidents, and uses a **RAG (Retrieval-Augmented Generation)** pipeline with **Google Gemini AI** to produce an accurate **Root Cause Analysis (RCA)** and a step-by-step **Remediation Playbook** in under 5 seconds."*

---

### Q2. What is RAG and how did you implement it in this project?
**Answer:**  
*"RAG stands for **Retrieval-Augmented Generation**. A standard LLM like ChatGPT or Gemini cannot diagnose our company's private server crashes because it has never seen our private logs.  
RAG solves this in 3 clear steps in my code:
1. **Retrieve:** When the `/analyze` API is called, `IncidentServiceImpl` queries the database for all recent error logs associated with that incident ID.
2. **Augment:** In `AIServiceImpl`, I build a domain-specific system prompt that injects the incident title, description, and the retrieved raw error logs into a structured context.
3. **Generate:** I send this augmented prompt to the Google Gemini API using Spring 3.2's `RestClient`. Gemini reads the real logs and returns a structured JSON containing the root cause, confidence score, and remediation playbook, which I then save back into the database."*

---

### Q3. Why did you choose Spring Boot instead of Node.js or Python?
**Answer:**  
*"Spring Boot is the global enterprise standard for high-throughput, mission-critical backend systems:
1. **Strong Typing & Safety:** Java 22 catches type mismatches and syntax errors at compile-time rather than during runtime in production.
2. **Layered Architecture:** Enforces a clean separation of concerns (`Controller` $\rightarrow$ `Service` $\rightarrow$ `Repository` $\rightarrow$ `Model`), making the codebase scalable and maintainable.
3. **Enterprise Security:** Spring Security provides industry-standard stateless JWT filtering out of the box."*

---

### Q4. Explain the Spring Boot Layered Architecture in your project.
**Answer:**  
* **Controller Layer (`IncidentController`, `LogController`):** Handles incoming HTTP requests, validates request body DTOs (`@Valid`), and returns HTTP responses with appropriate status codes (`200 OK`, `201 Created`).
* **Service Layer (`IncidentServiceImpl`, `AIServiceImpl`):** Contains the core business logic, RAG prompt construction, and external AI API communication.
* **Repository Layer (`IncidentRepository`, `LogRepository`):** Interfaces extending `JpaRepository` that automatically generate SQL queries via Hibernate/JPA without writing raw SQL.
* **Model/Entity Layer (`Incident`, `LogEntry`, `User`):** Java classes annotated with `@Entity` that map directly to database tables.

---

### Q5. What is the difference between DTO and Entity? Why not expose Entities directly?
**Answer:**  
*"An **Entity** (`Incident`, `User`) directly maps to database tables and columns.  
A **DTO (Data Transfer Object)** (`CreateIncidentRequest`, `IncidentResponse`) is a plain object used specifically for sending and receiving data over the network.  
**Why separate them?**
1. **Security:** Exposing entities directly could leak sensitive fields (e.g., hashed user passwords or internal DB IDs).
2. **Validation:** DTOs allow strict input validation using `@NotBlank` and `@NotNull` without cluttering database mapping logic.
3. **Decoupling:** Database schema changes won't break client API contracts."*

---

### Q6. How does Spring Security work with JWT in your application?
**Answer:**  
*"My backend uses **Stateless Authentication**:
1. When a user logs in with valid credentials, `JwtUtils` generates an HMAC-SHA256 encrypted JWT containing the user's identity and expiry time.
2. The client receives this token and attaches it to the `Authorization: Bearer <token>` header for subsequent requests.
3. Our custom `AuthTokenFilter` (which extends `OncePerRequestFilter`) intercepts every incoming request, validates the token signature and expiration, extracts the username, and populates the `SecurityContextHolder`.
4. If valid, the request proceeds to the controller; if invalid or missing on a protected route, Spring Security returns `403 Forbidden`."*

---

### Q7. Why did you use H2 database during development? What will you use in production?
**Answer:**  
*"During development, I used **H2 In-Memory Database** because:
* It requires zero external installation and starts up instantly with the Spring Boot application.
* It provides an interactive web console at `/h2-console` to inspect tables and execute SQL queries in real-time.  
In production, we simply change `spring.datasource.url` in `application.properties` to connect to **MySQL** or **PostgreSQL** for persistent disk storage with full ACID transaction guarantees."*

---

### Q8. What happens if the Gemini AI API goes down or exceeds its quota?
**Answer:**  
*"I implemented **Graceful Degradation** using a `try-catch` block inside `AIServiceImpl.java`.  
If Gemini returns an error (such as a 503 Server Unavailable or rate limit), the backend catches the exception, logs it to `System.err`, and returns a safe fallback `AnalysisResponse` stating that AI analysis is temporarily unavailable and advising the engineer to review raw logs manually. This ensures the server never crashes or throws an unhandled 500 error to the client."*

---

### Q9. What is HikariCP? Why is it mentioned in your logs?
**Answer:**  
*"**HikariCP** is the default high-performance JDBC connection pool used by Spring Boot. Instead of opening a new database connection for every single HTTP request (which is extremely slow), HikariCP maintains a pool of pre-established database connections that threads can borrow and return instantly, drastically increasing throughput."*

---

### Q10. What are the next planned features for this platform?
**Answer:**  
* **Redis Caching:** Storing AI analysis results in Redis RAM with a 1-hour TTL to prevent redundant LLM API costs for identical incidents.
* **Vector Database (Qdrant / PGVector):** Converting past post-mortems into vector embeddings for semantic similarity search.
* **React Dashboard:** A modern on-call incident dashboard with live log streaming and automated alerts.


---

## 📌 Section 11: Real-World Website Integration & Production Caching

### Q11. "Mere paas ek website hai, to main uske sath ise kaise use karoon?" (Production Integration)
**Answer:**  
In real-world production environments, our platform exposes the standard ingestion endpoint: `POST /api/v1/logs`. Any external web application (Node.js, Express, Python, Next.js, or React) connects via a simple **Global Error Listener / Logger Interceptor**:

```javascript
// Example: External website error handler
window.addEventListener('error', (event) => {
  fetch('http://your-incident-server:8080/api/v1/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      incidentId: 1, // Active incident ID
      logLevel: 'ERROR',
      sourceService: 'my-production-app',
      message: event.message,
      stackTrace: event.error?.stack || null
    })
  });
});
```

---

### Q12. "Aapke system me Redis / Caching kaise implement hui hai agar local system par Redis server na ho?"
**Answer (Key Viva Answer):**  
*"Sir/Ma'am, humne **Spring Boot Cache Abstraction** design pattern use kiya hai with `@EnableCaching` and `@Cacheable(value = "incidentAnalysis", key = "#id")`.
- **Loose Coupling:** Code Redis ya kisi specific database vendor se hard-code nahi hota.
- **Development / Demonstration Mode:** Spring Boot internal high-performance in-memory RAM cache use karta hai, jisse bina kisi external Docker ya Redis server installation ke application direct run ho sakti hai.
- **Production Mode:** Sirf `application.properties` me `spring.cache.type=redis` set karke real Redis cluster / AWS ElastiCache se seamlessly connect ho jata hai without changing a single line of Java code!
- **Performance Impact:**
  - **1st Request (Cache MISS):** Google Gemini API call hoti hai $\rightarrow$ ~3.2 seconds.
  - **2nd Request (Cache HIT):** LLM API call bypass ho jati hai $\rightarrow$ **< 5 milliseconds** response time! API quota aur cost 100% save hoti hai."*

