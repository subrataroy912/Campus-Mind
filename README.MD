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
- `src/components/layout` contains app-wide layouts.
- `src/features` owns domain services and feature-local boundaries.
- `src/mock` provides deterministic frontend fixtures.
- `src/context` contains client-wide providers.
- `src/pages` remains route composition only.
- `src/routes` centralizes route definitions and client-side guards.
