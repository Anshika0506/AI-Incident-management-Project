# 🖥️ Frontend Architecture & SRE Command Center Guide (Viva & Code Walkthrough)

> **Platform:** AegisOps AI — SRE Autonomous Incident Intelligence & RAG Platform  
> **Frontend Stack:** React 19 (JSX) + Vite 8 + Tailwind CSS + Axios + Lucide Icons (Zero TypeScript)  
> **Local App URL:** `http://localhost:5173`  
> **Backend URL:** `http://localhost:8080`  

---

## 🧭 1. Folder Structure & Component Breakdown

Sabhi frontend files aapke workspace ke is folder me hain:  
`C:\Users\lenovo\OneDrive\Documents\AI Incident Management\frontend\`

```
frontend/
├── index.html                   # HTML entry point: JetBrains Mono & Inter fonts, dark background
├── vite.config.js               # Reverse Proxy (/api -> http://localhost:8080)
├── tailwind.config.js           # Custom SRE dark theme colors, glow animations, fonts
├── package.json                 # React 19, Axios, Lucide-react, Tailwind CSS
└── src/
    ├── main.jsx                 # React root mount
    ├── index.css                # Radial gradient mesh, glow effects, glassmorphic styling
    ├── App.jsx                  # Main State Controller (Incidents, Logs, Outage Simulation, Health)
    │
    ├── api/                     # 🔌 BACKEND CONNECTIVITY LAYER
    │   ├── client.js            # Axios client with 45s timeout for AI inference & interceptors
    │   ├── authService.js       # JWT Login & Registration state management
    │   ├── incidentService.js   # Incident CRUD, Status Patch, and /analyze API calls
    │   └── logService.js        # Telemetry Log Ingestion and fetch logs by Incident ID
    │
    ├── data/
    │   └── mockData.js          # Realistic SRE Outage Presets (HikariCP, Redis, Kafka, OOM)
    │
    └── components/              # 🎨 UI COMPONENTS
        ├── Navbar.jsx           # Brand logo, Backend live pill (8080), Gemini badge, 1-Click Simulate
        ├── MetricsBar.jsx       # 4 Interactive SRE KPI cards (Total, Active P1/P2, AI Rate, MTTR)
        ├── IncidentList.jsx     # Searchable queue with segmented tabs (All, P1/P2, Active, Resolved)
        ├── IncidentDetail.jsx   # Master-Detail view with 4 coordinated deep-dive tabs
        ├── AIDiagnosis.jsx      # Gemini 3.5 Flash RAG Card, Root Cause, Playbook with Checkboxes & Code copy
        ├── LogStream.jsx        # SRE Dark telemetry terminal with log levels, search & stack traces
        ├── IncidentTopology.jsx # 🗺️ NEW: Distributed microservice dependency failure map
        ├── IncidentTimeline.jsx # ⏱️ NEW: Chronological incident audit log & sequence stepper
        ├── OutageSimulatorModal.jsx # ⚡ NEW: 1-Click Outage Injection (HikariCP, Redis, Kafka, OOM)
        ├── CreateIncidentModal.jsx  # New incident modal with severity selectors
        ├── IngestLogModal.jsx       # Telemetry log ingestion modal with 1-click presets
        └── AuthModal.jsx            # SRE Security gateway (JWT Login & Registration)
```

---

## 🚀 2. Nayi UI Me Kya-Kya Zordar Features Add Hue Hain?

1. **Aesthetic SRE Command Center Theme (`index.css`):**
   - Deep radial gradient mesh backdrop (`#070b14`) with ambient cyan & indigo glow spots.
   - Glassmorphic panels (`backdrop-blur-xl`) with sleek border highlights.
2. **Top Navigation & System Telemetry (`Navbar.jsx`):**
   - AegisOps AI animated gradient shield.
   - Real-time status indicators: **Backend Status**, **Gemini 3.5 Flash Model: Active**, **Cache: <5ms RAM**.
   - **⚡ Simulate Outage** button: 1-click live demo trigger for examiners.
3. **Interactive SRE Metrics Bar (`MetricsBar.jsx`):**
   - **Total Recorded:** Total count with active/resolved counts.
   - **Active Critical:** Glowing rose badge with pulsing P1 alert.
   - **AI RAG Rate:** Animated gradient progress bar showing % of incidents diagnosed by AI.
   - **Est. MTTR:** 4.2m with 88% reduction badge and sub-5ms cache hit latency.
4. **Active Incident Queue (`IncidentList.jsx`):**
   - Instant search across ID, title, and microservice names.
   - Segmented filter buttons: **All**, **P1/P2**, **Active**, **Resolved**.
   - Relative timestamps (*"2m ago"*, *"35m ago"*), monospace ID tags (`#001`), and AI confidence pills.
5. **Master-Detail Deep Dive (`IncidentDetail.jsx`):**
   - Coordinated status switcher: 1-click transition between **OPEN**, **IN_PROGRESS**, and **RESOLVED**.
   - 4 Dedicated Deep-Dive Tabs:
     - 🧠 **AI Diagnosis & Playbook:** Gemini RAG Root Cause, Confidence meter, interactive step-by-step checklist, copyable shell commands, and automated fix simulation.
     - 💻 **Telemetry Logs:** Hacker-style dark terminal with syntax highlighting, search filter, and expandable stack traces.
     - 🗺️ **Failure Topology:** Visual microservice node graph showing where in the path (`Client -> Gateway -> Service -> Database`) the outage occurred.
     - ⏱️ **Incident Timeline:** Step-by-step audit history from alert trigger to ingestion and resolution.
6. **1-Click Outage Simulator (`OutageSimulatorModal.jsx`):**
   - 5 pre-configured enterprise outages ready to inject during viva:
     - 💳 *HikariCP DB Connection Pool Starvation* (Payment Service)
     - 🔐 *Redis Master-Replica Split-Brain* (Auth Service)
     - 📦 *Kafka Consumer Partition Lag Overload* (Order Service)
     - 💥 *JVM Heap Saturation & Stop-The-World GC* (Catalog Service)

---

## 🛠️ 3. How to Run Frontend & Test UI

1. Open Terminal:
   ```bash
   cd "C:\Users\lenovo\OneDrive\Documents\AI Incident Management\frontend"
   npm run dev
   ```
2. Open in Browser:
   `http://localhost:5173`
3. Enjoy the ultra-modern SRE Incident Intelligence Command Center!
