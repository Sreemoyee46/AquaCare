---
marp: true
theme: default
class: lead
paginate: true
backgroundColor: #f0f8ff
color: #333
---

# AquaCare 🐠
## Smart Aquarium Health Monitor
Team: Team AquaCare (6th Semester CSE)

---

## 1. Problem Statement

Aquarium owners lack a unified tool to properly track optimal water parameters, diagnose fish diseases early, and maintain consistent care routines, leading to stress and high fish mortality rates.

---

## 2. Proposed Solution

**AquaCare** is a full-stack platform designed to be the ultimate companion for aquarium owners:
- **Parameter Logging & AI Analysis:** Keep track of water parameters (pH, temp, ammonia) and get real-time AI feedback tailored to 25+ specific fish species.
- **AI-Powered Disease Diagnosis:** Input observed symptoms and receive instant disease identification, along with actionable Do's and Don'ts.
- **Smart Reminders:** Automated, intelligent scheduling for daily feeding, water changes, and filter maintenance.

---

## 3. Technology Stack

- **Frontend:** React 18, Vite (Fast, responsive UI)
- **Backend:** Node.js, Express.js (Scalable API operations)
- **Database:** MongoDB (Flexible and scalable data storage)
- **Artificial Intelligence:** Google Gemini API (Log analysis and disease diagnosis)
- **Authentication:** JSON Web Tokens (JWT) for secure user sessions
- **Data Visualization:** Recharts (Trend charts for parameter history)

---

## 4. System Architecture & Workflow

- **Layered Arch.:** Clear separation between React Frontend, Express API, and DB.
- **Workflow:**
  1. **User Auth:** Users securely register and login.
  2. **Tank Setup:** Users register tanks and add specific fish species.
  3. **Data Ingestion:** Users log water parameters or fish symptoms.
  4. **AI Processing:** Gemini API analyzes data against expert-validated parameter ranges.
  5. **Actionable Output:** System returns visual trend charts, AI recommendations, and treatment steps.

---

## 5. Key Features

- **Species-Specific Monitoring:** Parameter validation customized for 25 different fish species.
- **Intelligent Dashboard:** Visualized trend charts (Recharts) for historical parameter data.
- **Smart Reminders system:** One-click "Mark as Done" auto-reschedules tasks.
- **Integrated Shop:** Browse and purchase aquarium products locally.
- **Multi-Tank Support:** Seamlessly manage multiple aquariums under one profile.

---

## 6. Expected Impact

- **Reduced Fish Mortality:** Proactive alerts and care reminders ensure a healthier aquatic environment.
- **Empowered Hobbyists:** Democratizes expert-level aquarium knowledge for beginners.
- **Cost Savings:** Prevents catastrophic tank crashes and expensive fish loss through early AI diagnosis.
- **Data-Driven Breeding:** Helps advanced aquarists maintain the exact parameters required for sensitive species.

---

## 7. Target Users & Use Cases

- **Beginner Aquarists:** Needing guidance on step-by-step disease diagnosis and automated maintenance reminders.
- **Advanced Hobbyists:** Tracking complex water parameters over time across multiple specialized tanks.
- **Local Aquarium Shops:** (Future integration) Reaching customers through the integrated vendor and shop features.

---

## 8. Scalability

- **Database Design:** MongoDB document model natively supports flexible datasets (adding new species, parameters, or shop items).
- **Stateless Authentication:** JWT allows the backend to scale horizontally without session bottlenecks.
- **API-First Approach:** RESTful endpoints allow easy integration of future mobile apps (React Native) or external hardware.

---

## 9. Future Scope

- **Phase 2 - Hardware Integration:** Arduino/ESP32 sensor modules for automated, real-time parameter tracking.
- **Phase 3 - Predictive ML Alerts:** Machine learning models to predict water quality crashes before they happen.
- **Phase 4 - Community Heatmaps:** Disease outbreak heatmaps filtered by region and season.
- **Phase 5 - Mobile Application:** Cross-platform React Native app for on-the-go monitoring.

---

# Thank You! 🐟
**AquaCare:** Making Aquarium Management Smarter and Safer.
