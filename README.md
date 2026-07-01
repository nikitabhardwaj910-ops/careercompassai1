# CareerCompass AI (Talent Navigate) 🚀

An advanced, AI-powered career navigation and recruitment platform built with modern full-stack web technologies. Designed to bridge the gap between emerging talent and top employers through intelligent recommendations, resume analytics, and mock interview simulations.

---

## ✨ Key Features

### 🎓 For Candidates & Students
- **Dashboard Overview**: Comprehensive tracking of applications, interviews, and career milestones.
- **Swipe Discovery**: Tinder-style interactive job and internship exploration.
- **AI Career Assistant**: Powered by Google Gemini for real-time career guidance and mentorship.
- **Mock Interview Simulator**: Voice and text-based simulated interviews tailored to target roles.
- **Resume Analyzer**: Instant AI feedback on resume structure, impact, and ATS compatibility.
- **Skill Gap Analysis & Learning Roadmaps**: Actionable insights into missing competencies and step-by-step learning paths.

### 🛡️ For System Administrators
- **Control Panel Overview**: Real-time analytics, user metrics, and platform usage statistics.
- **User Management**: Comprehensive administration of student profiles and platform roles.
- **Job & Internship Moderation**: Curate and manage active opportunity listings.
- **Secure Access**: Protected admin portal authenticated via secret passkeys (`MORNIK-2026`).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [TanStack Start](https://tanstack.com/start) / Vite + React 19
- **Routing**: TanStack Router (File-based routing)
- **Styling**: Tailwind CSS v4 + Vanilla CSS + Framer Motion animations
- **UI Components**: Radix UI primitives + Lucide React icons

### Backend
- **Framework**: Java 21 + Spring Boot 3
- **Database**: PostgreSQL (Neon Cloud DB) + Spring Data JPA
- **AI Integration**: Google Gemini API integration for generative recommendations

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v20+ or **Bun** v1+
- **JDK 21** & Maven

### Running the Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend application will run at `http://localhost:8080`.

### Running the Backend
```bash
cd backend
# Start Spring Boot backend server
./mvnw spring-boot:run
```
The backend API server will run at `http://localhost:8081`.

---

## 🔒 Security Notes
- Admin access requires authenticating with the active admin passkey (`MORNIK-2026`).
- JWT tokens are used to secure API communications between frontend client and backend server.

---

## 📝 License
All rights reserved. © 2026 Career Compass AI.
