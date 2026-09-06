# Campus Mind

Campus Mind is a standalone React + Vite interface. It runs entirely in the browser with local mock fixtures and localStorage-backed interactions—no backend, API server, WebSocket, or environment configuration is required.

## Run locally

```bash
npm install
npm run dev
```

## Demo sign-in

Use `student@campusmind.local` and `password123`, or create a local account. Authentication and classroom mutations persist in browser localStorage.

## Architecture

- `src/components/common` contains reusable, domain-agnostic UI primitives.
- `src/app/layouts` contains app-wide route layouts.
- `src/features` owns domain services and feature-local boundaries.
- `src/features/*/pages` contains route-level implementations owned by each domain.
- `src/mock` provides deterministic frontend fixtures.
- `src/context` contains client-wide providers.
- `src/pages` contains only global route pages and shared page shells.
- `src/routes` centralizes route definitions and client-side guards.

## Local data behavior

- Demo users and passwords are frontend fixtures only; this is not production authentication.
- The active session is stored under `campus-mind.session`.
- Classroom records are stored per user under `campus-mind.classrooms.<userId>`.
- Settings such as the selected theme are stored in browser localStorage.
- Clear the site data in browser developer tools to reset the local demo state.

## Verification

```bash
npm run lint
npm test -- --run
npm run build
```
