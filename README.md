Classroom Chat Platform

A modern Google Classroom-inspired learning and communication platform that combines classroom management, assignments, study materials, grading, and real-time chat in one simple application.

«Note: This project does not include video calling.»

1. Project Overview

The Classroom Chat Platform is designed for teachers and students to manage academic activities digitally.

Teachers can create classes, publish announcements, upload materials, create assignments, review submissions, provide marks and feedback, and communicate with students.

Students can join classes, access learning materials, submit assignments, check grades, receive notifications, and communicate with teachers and classmates through real-time chat.

The main goal is to create a clean, simple, responsive, and easy-to-use educational platform.

---

2. Main Features

Authentication

- User registration
- Login/logout
- JWT authentication
- Forgot password
- Password reset
- Role-based access
- Student and Teacher accounts

Teacher Features

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

Student Features

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

Chat System

- Real-time messaging
- One-to-one chat
- Class group chat
- Online/offline status
- Typing indicator
- Read/unread messages
- File attachments
- Message timestamps
- Message notifications

Notifications

- New assignment
- Assignment deadline
- Assignment submission
- New announcement
- New message
- Grade published
- Teacher/student activity

---

3. Technology Stack

Frontend

- React.js
- React Router
- Tailwind CSS
- Axios
- JavaScript/TypeScript
- WebSocket/STOMP Client

Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- REST API
- WebSocket
- STOMP

Database

- PostgreSQL / MySQL

File Storage

Development:

Local File Storage

Production:

Cloud Object Storage

---

4. Application Architecture

                    ┌─────────────────────┐
                    │      React.js       │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                 REST API      │      WebSocket
                               │
                    ┌──────────▼──────────┐
                    │     Spring Boot     │
                    │       Backend       │
                    └───────┬───────┬─────┘
                            │       │
                     ┌──────▼───┐ ┌─▼──────────┐
                     │ Database │ │   Storage  │
                     │ PostgreSQL│ │   Files    │
                     └──────────┘ └────────────┘

---

5. Main Pages

The application will contain approximately 20 core UI screens.

Public Pages

/
 /login
 /register
 /forgot-password

Main Application

/dashboard
/classes
/classes/create
/classes/join

Class

/classes/:classId
/classes/:classId/classwork
/classes/:classId/assignments/:assignmentId
/classes/:classId/materials
/classes/:classId/people
/classes/:classId/chat

Communication

/chat
/notifications

User

/profile
/settings

Other

/404

---

6. Core UI Screens

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

7. User Roles

Teacher

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

Student

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

---

8. Database Entities

The backend should use a relational database.

Core entities:

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

Relationships should be properly normalized using foreign keys.

---

9. REST API Structure

The backend API should follow a clean resource-based structure.

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

Authentication:

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/logout

---

10. Real-Time Chat

The chat system will use:

WebSocket
+
STOMP
+
Spring Boot

Example flow:

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

REST APIs should handle normal data operations, while WebSocket should handle real-time communication.

---

11. UI/UX Principles

The application should follow these principles:

Clean

Avoid unnecessary elements and complicated interfaces.

Simple

A student should understand the interface without training.

Responsive

The application must work properly on:

Mobile
Tablet
Laptop
Desktop

Consistent

Use a consistent:

- Color system
- Typography
- Spacing
- Buttons
- Cards
- Forms
- Icons
- Navigation

Light Mode

The primary design should use a modern light interface with:

- White backgrounds
- Soft gray sections
- Blue primary actions
- Rounded cards
- Subtle shadows
- Clear typography

---

12. Frontend Structure

Recommended React structure:

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

---

13. Backend Structure

Recommended Spring Boot structure:

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

Use a layered architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Database

---

14. Security Requirements

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

Passwords must never be stored as plain text.

---

15. Important Development Rules

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

16. MVP Scope

The first version should contain:

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

Advanced features should only be added after the core system is stable.

---

17. Future Features

Possible future additions:

- AI study assistant
- AI assignment assistant
- AI-generated quizzes
- Attendance management
- Study planner
- Calendar
- Discussion forums
- Quiz system
- Online exams
- Analytics dashboard
- Leaderboards
- Email notifications
- Push notifications
- Dark mode
- Admin dashboard

These features are not required for the initial MVP.

---

18. Project Goal

The final application should feel like a real-world educational SaaS product rather than a basic college CRUD project.

The most important technical areas demonstrated by this project are:

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

The project should prioritize clean architecture, good UI/UX, security, maintainability, and real-world functionality over simply adding a large number of features.
