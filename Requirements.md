Campus Mind — Frontend Requirements

1. Project Stack

Frontend: React + Vite
Language: JavaScript + JSX
Styling: Tailwind CSS
Routing: React Router DOM
API: Axios
Real-time Chat: STOMP.js + SockJS
Icons: Lucide React
Date/Time: date-fns
Utility: clsx
Linting: ESLint

---

2. Required Programming

- JavaScript ES6+
- JSX
- Functional React Components
- React Hooks
- Async/Await
- ES Modules
- Responsive CSS
- REST API integration
- WebSocket/STOMP integration

Do not mix JavaScript and TypeScript unless the team officially decides to migrate the project to TypeScript.

---

3. Required Libraries

Runtime

react
react-dom
react-router-dom
axios
@stomp/stompjs
sockjs-client
lucide-react
clsx
date-fns

Development

vite
@vitejs/plugin-react
tailwindcss
@tailwindcss/vite
eslint
@eslint/js
globals
eslint-plugin-react-hooks
eslint-plugin-react-refresh

---

4. React Requirements

Use:

- Functional components
- React Hooks
- Reusable components
- Props
- Context where required
- Controlled forms
- Proper loading/error/empty states

Avoid:

- Large monolithic components
- Duplicate components
- Unnecessary global state
- Direct API calls inside every UI component

---

5. Styling

Use Tailwind CSS as the primary styling system.

UI principles

- Light mode
- Clean
- Minimal
- Modern
- Responsive
- Mobile-first
- Accessible
- Consistent spacing
- Consistent typography
- Consistent buttons/cards/forms

Do not add Bootstrap, Material UI, Ant Design, or another CSS framework without team approval.

---

6. Routing

Use React Router DOM.

Main route groups:

/auth
/dashboard
/classes
/assignments
/chat
/notifications
/profile
/settings

Class-related routes should support:

/classes/:classId
/classes/:classId/classwork
/classes/:classId/materials
/classes/:classId/people
/classes/:classId/chat

---

7. API Communication

Use Axios for Spring Boot REST APIs.

Create a centralized API client:

src/services/
├── apiClient.js
├── authService.js
├── classService.js
├── assignmentService.js
├── materialService.js
├── submissionService.js
├── gradeService.js
├── notificationService.js
└── chatService.js

Do not write large Axios implementations directly inside page components.

---

8. WebSocket / Chat

Use:

@stomp/stompjs
sockjs-client

Chat must support:

- Direct messaging
- Class group chat
- Real-time messages
- Online/offline status
- Typing indicator
- Read/unread status
- Message timestamps
- File attachments
- Message notifications

No video calling or WebRTC.

---

9. Project Structure

src/
├── assets/
├── components/
├── context/
├── hooks/
├── pages/
├── routes/
├── services/
├── utils/
├── App.jsx
├── main.jsx
├── App.css
└── index.css

Responsibilities

components/
Reusable UI components.

pages/
Complete application screens.

routes/
React Router configuration.

services/
REST API and WebSocket communication.

context/
Global application state where required.

hooks/
Reusable custom React hooks.

utils/
Small reusable helper functions.

assets/
Images and static assets.

---

10. Recommended Components

Button
Input
Modal
Dropdown
Avatar
Badge
Card
Loader
EmptyState
ErrorState
Navbar
Sidebar
ClassCard
AssignmentCard
MaterialCard
AnnouncementCard
ChatMessage
ChatInput
NotificationItem

Repeated UI should always become a reusable component.

---

11. Authentication

Frontend must support:

- Registration
- Login
- Logout
- Forgot password
- Password reset
- JWT authentication
- Protected routes
- Student role
- Teacher role

Frontend should respect backend authorization.

Never rely only on hiding buttons for security.

---

12. Environment Variables

Use Vite environment variables.

Example:

VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws

Never hard-code production URLs inside components.

Never commit:

API keys
JWT secrets
Passwords
Private tokens
Database credentials
Cloud credentials

---

13. Responsive Design

The application must work on:

- Mobile
- Tablet
- Laptop
- Desktop

Every page must be responsive.

Required:

- Mobile navigation
- Responsive sidebar
- Responsive cards
- Responsive forms
- Responsive tables/lists
- Responsive chat
- Touch-friendly buttons
- No unnecessary horizontal scrolling

---

14. Accessibility

Use:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Meaningful "alt" text
- Proper heading hierarchy
- Good color contrast

---

15. Performance

Developers should:

- Avoid unnecessary dependencies
- Avoid unnecessary re-renders
- Lazy-load large pages when useful
- Optimize images
- Avoid duplicated API requests
- Paginate large datasets where supported
- Keep components small

---

16. Code Quality

Use meaningful names.

Good:

const assignmentService = ...

Bad:

const x = ...

Rules:

- Remove unused imports.
- Remove unused variables.
- Avoid duplicated code.
- Avoid commented-out dead code.
- Keep functions small.
- Keep components focused.
- Do not hard-code API URLs.
- Do not introduce unnecessary libraries.

---

17. NPM Commands

Install:

npm install

Development:

npm run dev

Build:

npm run build

Preview:

npm run preview

Lint:

npm run lint

Before submitting frontend work:

npm run lint
npm run build

Both should pass.

---

18. Git Rules

Branch naming:

feature/<feature-name>
fix/<issue-name>
ui/<page-name>
refactor/<area-name>

Examples:

feature/class-chat
feature/assignment-submission
ui/dashboard
fix/login-validation

Commit examples:

feat: add class dashboard
feat: implement assignment submission
fix: handle expired session
ui: improve mobile dashboard
refactor: separate chat service

---

19. Libraries Not Allowed by Default

Do not add these without team approval:

Bootstrap
Material UI
Ant Design
Chakra UI
jQuery
Redux
Zustand
TanStack Query
Firebase
Socket.IO
WebRTC
Additional icon libraries
Additional date libraries

The goal is to keep Campus Mind lightweight and easy to maintain.

---

20. Frontend ↔ Backend

REST API

Use REST for:

Authentication
Users
Classes
Class Members
Announcements
Materials
Assignments
Submissions
Grades
Notifications
Files

WebSocket/STOMP

Use WebSocket for:

Chat Messages
Typing Status
Online/Offline Status
Read Status
Real-time Chat Notifications

---

21. Definition of Done

A frontend feature is complete when:

- [ ] UI matches approved design
- [ ] Responsive on mobile and desktop
- [ ] API integration is completed
- [ ] Loading state exists
- [ ] Error state exists
- [ ] Empty state exists where required
- [ ] Authentication is handled correctly
- [ ] No secrets are committed
- [ ] No unnecessary dependency is added
- [ ] "npm run lint" passes
- [ ] "npm run build" passes
- [ ] Code is reusable
- [ ] Code is understandable by other team members

---

Final Standard

Campus Mind Frontend = React + Vite + JavaScript/JSX + Tailwind CSS + React Router + Axios + STOMP/SockJS + Lucide React + date-fns.

Keep the frontend simple, clean, responsive, lightweight, maintainable, and consistent.
