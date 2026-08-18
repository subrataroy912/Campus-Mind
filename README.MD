<div align="center">

# 🎓 Classroom Chat Platform

### A modern classroom, assignment, study material, grading & real-time communication platform.

<p>
  <a href="https://campus-mind-ev1s.onrender.com">
    <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Campus%20Mind-4285F4?style=for-the-badge" alt="Live Demo"/>
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React.js-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React.js"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/PostgreSQL%20%2F%20MySQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="Database"/>
  <img src="https://img.shields.io/badge/WebSocket-Realtime-FF6B6B?style=flat-square" alt="WebSocket"/>
  <img src="https://img.shields.io/badge/STOMP-Messaging-8B5CF6?style=flat-square" alt="STOMP"/>
</p>

<p>
  <strong>Clean UI • Real-Time Chat • Assignments • Materials • Grading • Notifications</strong>
</p>

</div>

---

## 🌐 Live Demo

<div align="center">

### 🚀 Try Campus Mind

**[👉 Open the Live Application](https://campus-mind-ev1s.onrender.com)**

</div>

> ⚠️ **Note:** This project does not include video calling.

---

## 🧪 Local Run & White Screen Troubleshooting

This repository is a **Vite + React single-page application**. It must be served by Vite or by a static host that serves the built `dist/` folder. Do **not** open `index.html` directly with a `file://` URL; browser ES module loading will be blocked and the result can look like a blank white screen.

### Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

### Build and preview production output

```bash
npm run build
npm run preview
```

Open the preview URL printed by Vite.

### Environment variables

A `.env` file is optional for the UI to start. The frontend has safe defaults for API and WebSocket paths:

```text
VITE_API_BASE_URL=/api
VITE_WS_URL=/ws
```

Copy `.env.example` only when you need to point the frontend at a specific backend host, for example during local backend development.

### Render/static hosting deployment

For Render, deploy this project as a **Static Site** with:

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- SPA rewrite: `/*` → `/index.html`

The included `render.yaml` captures those settings. If the app is deployed as a static site without publishing `dist`, or if it is opened directly as an HTML file, the browser can show a white page even though `npm run build` succeeds.

---

## 📚 Table of Contents

- [📖 Project Overview](#-project-overview)
- [✨ Main Features](#-main-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [🏗️ Application Architecture](#️-application-architecture)
- [📱 Main Pages](#-main-pages)
- [🖥️ Core UI Screens](#️-core-ui-screens)
- [👥 User Roles](#-user-roles)
- [🗄️ Database Entities](#️-database-entities)
- [🔌 REST API Structure](#-rest-api-structure)
- [💬 Real-Time Chat](#-real-time-chat)
- [🎨 UI/UX Principles](#-uiux-principles)
- [⚛️ Frontend Structure](#️-frontend-structure)
- [☕ Backend Structure](#-backend-structure)
- [🔐 Security Requirements](#-security-requirements)
- [📏 Important Development Rules](#-important-development-rules)
- [🚀 MVP Scope](#-mvp-scope)
- [🔮 Future Features](#-future-features)
- [🎯 Project Goal](#-project-goal)

---

## 📖 Project Overview

The **Classroom Chat Platform** is designed for teachers and students to manage academic activities digitally.

Teachers can create classes, publish announcements, upload materials, create assignments, review submissions, provide marks and feedback, and communicate with students.

Students can join classes, access learning materials, submit assignments, check grades, receive notifications, and communicate with teachers and classmates through real-time chat.

### 🎯 Main Goal

Create a **clean, simple, responsive, and easy-to-use educational platform**.

---

## ✨ Main Features

### 🔐 Authentication

- User registration
- Login/logout
- JWT authentication
- Forgot password
- Password reset
- Role-based access
- Student and Teacher accounts

### 👨‍🏫 Teacher Features

- Create classes
- Edit/delete classes
- Generate class code
- Manage students
- Create announcements
- Upload study materials
- Create assignments
- Set deadlines
- View student submissions
- Grade assignments
- Provide feedback
- Class group chat
- Direct messaging

### 👨‍🎓 Student Features

- Join class using class code
- View enrolled classes
- View announcements
- Access study materials
- View assignments
- Submit assignments
- Upload files
- View grades
- View teacher feedback
- Class group chat
- Direct messaging

### 💬 Chat System

- Real-time messaging
- One-to-one chat
- Class group chat
- Online/offline status
- Typing indicator
- Read/unread messages
- File attachments
- Message timestamps
- Message notifications

### 🔔 Notifications

- New assignment
- Assignment deadline
- Assignment submission
- New announcement
- New message
- Grade published
- Teacher/student activity

---

## 🛠️ Technology Stack

### ⚛️ Frontend

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP requests |
| JavaScript/TypeScript | Programming |
| WebSocket/STOMP Client | Real-time communication |

### ☕ Backend

| Technology | Purpose |
|---|---|
| Java | Backend programming |
| Spring Boot | Backend framework |
| Spring Security | Security |
| JWT | Authentication |
| Spring Data JPA | Data access |
| Hibernate | ORM |
| REST API | Normal data operations |
| WebSocket | Real-time communication |
| STOMP | Real-time messaging |

### 🗄️ Database

- PostgreSQL / MySQL

### 📦 File Storage

**Development**

- Local File Storage

**Production**

- Cloud Object Storage

---

## 🏗️ Application Architecture

```text
                     ┌─────────────────────┐
                     │      React.js       │
                     │     Frontend        │
                     └──────────┬──────────┘
                                │
                 REST API       │       WebSocket
                                │
                     ┌──────────▼──────────┐
                     │     Spring Boot     │
                     │       Backend       │
                     └───────┬───────┬─────┘
                             │       │
                      ┌──────▼───┐ ┌─▼──────────┐
                      │ Database │ │   Storage  │
                      │PostgreSQL│ │   Files    │
                      └──────────┘ └────────────┘
```

---

## 📱 Main Pages

The application will contain approximately **20 core UI screens**.

### 🌍 Public Pages

```text
/
├── /login
├── /register
└── /forgot-password
```

### 🏠 Main Application

```text
/dashboard
/classes
/classes/create
/classes/join
```

### 🏫 Class

```text
/classes/:classId
/classes/:classId/classwork
/classes/:classId/assignments/:assignmentId
/classes/:classId/materials
/classes/:classId/people
/classes/:classId/chat
```

### 💬 Communication

```text
/chat
/notifications
```

### 👤 User

```text
/profile
/settings
```

### ❌ Other

```text
/404
```

---

## 🖥️ Core UI Screens

The major screens are:

1. Landing Page
2. Login
3. Register
4. Dashboard
5. My Classes
6. Create Class
7. Join Class
8. Class Stream
9. Classwork
10. Assignment Details
11. Submit Assignment
12. Assignment Review
13. Class Chat
14. Direct Chat
15. People
16. Grades
17. Notifications
18. Profile
19. Settings
20. Mobile Responsive Views

---

## 👥 User Roles

### 👨‍🏫 Teacher

```text
TEACHER
   │
   ├── Create Class
   ├── Manage Class
   ├── Create Assignment
   ├── Upload Material
   ├── Post Announcement
   ├── Review Submission
   ├── Give Grade
   ├── Give Feedback
   └── Chat
```

### 👨‍🎓 Student

```text
STUDENT
   │
   ├── Join Class
   ├── View Class
   ├── View Materials
   ├── View Assignments
   ├── Submit Assignment
   ├── View Grade
   ├── View Feedback
   └── Chat
```

---

## 🗄️ Database Entities

The backend should use a **relational database**.

### Core Entities

```text
User
Role
Classroom
ClassMember
Announcement
Material
Assignment
Submission
Grade
Message
Conversation
ConversationMember
Notification
Attachment
```

Relationships should be properly normalized using foreign keys.

---

## 🔌 REST API Structure

The backend API should follow a **clean resource-based structure**.

### Main Resources

```text
/api/auth
/api/users
/api/classes
/api/classes/{classId}/members
/api/classes/{classId}/announcements
/api/classes/{classId}/materials
/api/classes/{classId}/assignments
/api/assignments/{assignmentId}
/api/submissions
/api/grades
/api/conversations
/api/messages
/api/notifications
```

### 🔐 Authentication Endpoints

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/logout
```

---

## 💬 Real-Time Chat

The chat system will use:

```text
WebSocket
    +
STOMP
    +
Spring Boot
```

### 🔄 Example Flow

```text
Student
   │
   │ Send Message
   ▼
WebSocket
   │
   ▼
Spring Boot
   │
   ├── Validate User
   ├── Save Message
   └── Broadcast Message
           │
           ▼
      Other Users
```

> REST APIs should handle normal data operations, while WebSocket should handle real-time communication.

---

## 🎨 UI/UX Principles

The application should follow these principles:

### 🧹 Clean

Avoid unnecessary elements and complicated interfaces.

### ✨ Simple

A student should understand the interface without training.

### 📱 Responsive

The application must work properly on:

- Mobile
- Tablet
- Laptop
- Desktop

### 🎯 Consistent

Use a consistent:

- Color system
- Typography
- Spacing
- Buttons
- Cards
- Forms
- Icons
- Navigation

### ☀️ Light Mode

The primary design should use a modern light interface with:

- White backgrounds
- Soft gray sections
- Blue primary actions
- Rounded cards
- Subtle shadows
- Clear typography

---

## ⚛️ Frontend Structure

Recommended React structure:

```text
src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── classroom/
│   ├── assignment/
│   ├── chat/
│   └── notification/
│
├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── classroom/
│   ├── assignment/
│   ├── chat/
│   ├── profile/
│   └── settings/
│
├── routes/
│
├── services/
│   ├── api/
│   └── websocket/
│
├── hooks/
├── context/
├── utils/
│
├── App.jsx
└── main.jsx
```

---

## ☕ Backend Structure

Recommended Spring Boot structure:

```text
src/main/java/com/example/classroom/

├── config/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── mapper/
├── security/
├── exception/
├── websocket/
└── ClassroomApplication.java
```

### 🧱 Layered Architecture

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

---

## 🔐 Security Requirements

The application should implement:

- JWT authentication
- Password hashing
- Spring Security
- Role-based authorization
- Protected APIs
- Input validation
- File validation
- Secure file access
- Authentication expiration
- Proper error handling

> 🔒 **Passwords must never be stored as plain text.**

---

## 📏 Important Development Rules

The AI/developer working on this project should follow these rules:

1. Do not unnecessarily over-engineer the application.
2. Keep the code beginner-friendly and maintainable.
3. Use reusable React components.
4. Follow REST API conventions.
5. Keep frontend and backend responsibilities separate.
6. Never put database logic directly inside controllers.
7. Use DTOs for API requests/responses where appropriate.
8. Validate all user input.
9. Handle loading, empty, and error states.
10. Make every important page responsive.
11. Do not introduce unnecessary dependencies.
12. Keep naming consistent across frontend, backend, and database.
13. Do not implement video calling.
14. Chat must be real-time.
15. Build the MVP before adding advanced features.

---

## 🚀 MVP Scope

The first version should contain:

```text
Authentication
      ↓
Dashboard
      ↓
Create / Join Class
      ↓
Class Stream
      ↓
Classwork
      ↓
Assignments
      ↓
Submission
      ↓
Grades
      ↓
Class Chat
      ↓
Direct Chat
      ↓
Notifications
```

> Advanced features should only be added after the core system is stable.

---

## 🔮 Future Features

Possible future additions:

- 🤖 AI study assistant
- 🤖 AI assignment assistant
- 🧠 AI-generated quizzes
- 📋 Attendance management
- 📅 Study planner
- 🗓️ Calendar
- 💬 Discussion forums
- 📝 Quiz system
- 🧪 Online exams
- 📊 Analytics dashboard
- 🏆 Leaderboards
- 📧 Email notifications
- 🔔 Push notifications
- 🌙 Dark mode
- 🛡️ Admin dashboard

> These features are not required for the initial MVP.

---

## 🎯 Project Goal

The final application should feel like a **real-world educational SaaS product** rather than a basic college CRUD project.

### 💡 Most Important Technical Areas

```text
React.js
    +
Spring Boot
    +
REST API
    +
JWT Authentication
    +
Role-Based Authorization
    +
SQL Database
    +
File Upload
    +
WebSocket
    +
Real-Time Chat
    +
Responsive UI
```

The project should prioritize:

- Clean architecture
- Good UI/UX
- Security
- Maintainability
- Real-world functionality

over simply adding a large number of features.

---

<div align="center">

### 🚀 Built to make digital classrooms simpler.

**[🌐 Visit Campus Mind](https://campus-mind-ev1s.onrender.com)**

<br>

<sub>Classroom Management • Assignments • Materials • Grading • Real-Time Chat</sub>

</div>
