# Campus Mind

Campus Mind is a React + Vite client for the Campus Mind API.

## Run locally

```bash
npm install
npm run dev
```

Set the API URL in `.env.local` when the backend is not running at the default address:

```bash
VITE_API_BASE_URL=http://localhost:8080/v1
```

Set `VITE_MAINTENANCE_MODE=true` in `.env.local` to show the server maintenance page across the app while updating the codebase. Set it to `false` or remove it to restore normal routing. Restart Vite after changing environment variables.

## Architecture

- `src/components/common` contains reusable, domain-agnostic UI primitives.
- `src/app/layouts` contains app-wide route layouts.
- `src/features` owns domain services and feature-local boundaries.
- `src/features/*/pages` contains route-level implementations owned by each domain.
- `src/context` contains client-wide providers.
- `src/pages` contains only global route pages and shared page shells.
- `src/routes` centralizes route definitions and client-side guards.

## Runtime data behavior

- Authentication and feature data are requested from the configured API.
- The active session is retained locally so route guards can restore the last session.
- Settings such as the selected theme remain client preferences.

## API contract used by the client

The client currently calls these endpoints under `VITE_API_BASE_URL`:

- `POST /auth/login` and `POST /auth/register`
- `GET /auth/oauth/google` and `GET /auth/oauth/github`
- `PATCH /users/:id` and `DELETE /users/:id`
- `GET /courses`, `GET /explore/feed`, `GET /courses/:id`
- `POST /courses`, `POST /courses/:id/enrollment`
- `POST /courses/cover-upload`
- `GET /community/feed`, `GET /messages/conversations`, `GET /assignments`
- `GET /users/explore`

Login responses should contain `accessToken`, `refreshToken`, `userId`, `email`, `displayName`, and `avatarUrl`. Other responses may be returned directly or wrapped in a `data` property. The backend must provide the classroom, community, message, assignment, and user fields consumed by the existing views.

OAuth endpoints receive `mode` (`login` or `register`) and `redirect_uri` query parameters. After provider authentication, they should redirect to that URI with `accessToken`, `refreshToken`, and either a URL-encoded `user` object or the flat user fields. On failure, return an `error` query parameter instead.

## Verification

```bash
npm run lint
npm test -- --run
npm run build
```
