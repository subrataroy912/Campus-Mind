# AGENTS.md Frontend Configuration File

# AI Agent Instructions & Guidelines: Classroom Chat Platform (Frontend Only)
This file provides context, architectural constraints, strict code conventions, and execution boundaries for AI assistants operating exclusively on the frontend repository workspace. Read this file completely before writing, modifying, or refactoring UI components or routing layers.
---## 1. Project Overview & ScopeThe **Classroom Chat Platform** is a modern, responsive, Google Classroom-inspired educational management and real-time communication application. It integrates academic course management, assignments, submissions, workflows, grading, and chat modules.
### 🛑 CRITICAL SCOPE BOUNDARY- **NO VIDEO CALLING:** Video calling, conferencing, and audio streaming features are explicitly **out of scope**. Do not write or suggest any frontend code relating to WebRTC, Agora, Zoom SDKs, or peer-to-peer media interfaces. Focus exclusively on text messaging, asset management, and assignment tracking within the user interface.
---## 2. Frontend Technology Stack Context- **Framework:** React.js (Functional components with hooks)- **Routing:** React Router (Declarative browser routing rules)- **Styling:** Tailwind CSS (Modern Light Mode theme focus with custom utility classes)- **Networking:** Axios (Stateless REST API integration with interceptors for JWT injection)- **Real-Time Communication:** WebSocket with STOMP Client (SockJS or native browser WebSockets layer)
Links:
https://vite.dev/guide/
---## 3. Strict Directory Structure
All code updates must align perfectly with this preset folder topology inside the frontend workspace root:
```text
src/
├── assets/         # Static images, SVG assets, system icons
├── components/     # Reusable custom UI components
│   ├── common/     # Loading spinners, custom inputs, buttons, card shells
│   ├── layout/     # Navbars, Sidebars, AppLayout wrappers
│   ├── classroom/  # Stream elements, class selectors, class code displays
│   ├── assignment/ # Deadline badges, submission lists, grading forms
│   ├── chat/       # Chat bubbles, message windows, status indicators
│   └── notification/# Notification dropdowns, list entries
├── pages/          # Complete operational screen views
│   ├── auth/       # Login, Register, Forgot/Reset Password
│   ├── dashboard/  # Unified landing desk for teachers and students
│   ├── classroom/  # Class Stream, People tabs, Course Materials
│   ├── assignment/ # Student submission pages, teacher evaluation dashboards
│   ├── chat/       # Group and Direct messaging centers
│   ├── profile/    # Account customization views
│   └── settings/   # Configurations and access controls
├── routes/         # Routing definitions and GuardedRoute blocks
├── services/       # Network gateways
│   ├── api/        # Axios clients and explicit route endpoints
│   └── websocket/  # STOMP/WebSocket hook setups and client handling
├── hooks/          # Custom hooks (e.g., useAuth, useSocket)
├── context/        # React Global contexts (AuthContext, SocketContext)
├── utils/          # Formatters, converters, date managers (e.g., date-fns)
├── App.jsx         # App configuration routing baseline
└── main.jsx        # Root execution node
```
---## 4. UI/UX Design System & PrinciplesEnsure all newly constructed UI layers obey these visual mandates:
- **Light Mode Default:** White backgrounds, soft gray sectional separators (`bg-gray-50`, `border-gray-100`), crisp charcoal typography (`text-gray-900`, `text-gray-700`).
- **Primary Color:** Clean blue primary elements (`bg-blue-600`, `hover:bg-blue-700`, `text-blue-600`) signaling focal actions.
- **Card Design:** Rounded modern layouts (`rounded-xl` or `rounded-lg`) accompanied by soft drop shadows (`shadow-sm`, `shadow-md`).- **Responsiveness:** Fluid grid structures that collapse elegantly from Desktop (4 columns or flexible rows) to Tablet (vertical layout stack, collapsible sidebars) and Mobile screens (hidden overlays, drawer navigations, explicit touch targets of at least 44x44px).
- **UX States:** Every dynamic element must gracefully handle `isLoading`, `isEmpty` (no submissions/messages found), and `hasError` states cleanly without breaking the React layout tree.
---## 5. System Routing Blueprint### Public Screens- `/` (Landing Page)
- `/login` (User Authentication portal)
- `/register` (Teacher/Student onboarding sign up)
- `/forgot-password` / `/reset-password` (Credential recovery vectors)
### Main Application- `/dashboard` (Aggregated workspace context)
- `/classes` (Complete classroom tracking deck)
- `/classes/create` (Teacher authorization boundary required)
- `/classes/join` (Student token entry deck)
### Classroom Internal Modules- `/classes/:classId` (Unified stream context)
- `/classes/:classId/classwork` (Assignments and materials workspace)
- `/classes/:classId/assignments/:assignmentId` (Granular workspace for specific items)
- `/classes/:classId/materials` (Resource download panels)
- `/classes/:classId/people` (Student rosters and faculty arrays)
- `/classes/:classId/chat` (Contextual group chat view)
### Cross-System Modules- `/chat` (Standalone global DM matrix and general channel hub)
- `/notifications` (Transactional system audit list)
- `/profile` / `/settings` (User details modifications)
- `/404` (Fallthrough safety template)
---## 6. Frontend Client API & WebSocket Integration### REST API Consumption MappingAll network requests must utilize custom Axios client instances interacting with the following specific endpoint resource paths:
- **Authentication Routes:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`
- **Classroom Routes:** `/api/classes`, `/api/classes/{classId}/members`, `/api/classes/{classId}/announcements`, `/api/classes/{classId}/materials`, `/api/classes/{classId}/assignments`
- **Submissions & Grading Routes:** `/api/assignments/{assignmentId}`, `/api/submissions`, `/api/grades`
- **Conversations & Alerts Routes:** `/api/conversations`, `/api/messages`, `/api/notifications`
### WebSocket STOMP Client LifecyclesReal-time chat modules and live user updates must adhere to strict React lifecycle hooks:
1. **Connection Init:** Establish socket connections upon application dashboard mounting inside a global `SocketContext`. Read JWT credentials from persistent client storage and inject them directly into the connection handshake header object.
2. **Dynamic Subscriptions:** Bind specific topic handlers dynamically when components mount within a room or channel context (e.g., sub to `/topic/classroom.{classId}` or direct messages via `/user/queue/messages`). Ensure strict unsubscribing behaviors occur during cleanups to mitigate leakage risks.
3. **Payload Dispatches:** Transmit real-time event frames to handlers using standardized configurations: `stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(messagePayload))`.
---## 7. Important Development Rules & Guardrails for UI1. **Component Reusability:** Keep layouts highly atomic. Extract repeating inputs, layout buttons, card containers, and profile avatars into `components/common/`.2. **State Management Cleanliness:** Keep client states local wherever possible. Utilize global React Contexts strictly for application-wide attributes (e.g., Session Authentication status, Live Socket instances, and global System Notifications).
3. **Naming Synchronization:** Retain strict camelCase nomenclature formatting across variables, properties, custom hooks, and state descriptors corresponding exactly with the backend API network definitions (e.g., use `assignmentDeadline`, `classCode`, `messageTimestamp`).
4. **Defensive UI Rendering:** Always design defensive structures against empty or undefined payload keys. Use optional chaining (`user?.profileImage`) to prevent runtime script crashes during latency or state synchronization intervals.


