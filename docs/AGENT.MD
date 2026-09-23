# AGENT.MD — Campus Mind

Guidance for AI coding agents working in this repository. Read this before making changes.
Facts below were taken from the source; items marked **(verify)** are inferences worth confirming before you rely on them.

## 1. What this is

Campus Mind is a single-page **React 19 + Vite 8** client for a separate **Spring Boot backend** (default `https://m198-backend.onrender.com`, API prefix `/v1`). It is a classroom / learning-community product: users create and join **Spaces** (courses), post to a class feed, publish coursework, submit and grade work, explore public classes and people, and receive notifications.

This repo is **frontend only**. There is no server code here except a small Cloudflare Worker proxy (`src/worker/index.js`).

| Concern | Choice |
|---|---|
| Language | **JavaScript + JSX** (no TypeScript; types are JSDoc in `src/types/` and `src/app/apiContracts.js`) |
| UI | Tailwind CSS **v4** (`@tailwindcss/vite`), shadcn/ui **`base-nova`** style on **Base UI** (`@base-ui/react`), lucide-react icons |
| Routing | `react-router` v8 data router (`createBrowserRouter`), all pages lazy-loaded |
| State / data | Redux Toolkit 2 + **RTK Query** (single `baseApi`), plus React contexts for auth and theme |
| Tests | Vitest 5, **Node environment** (no jsdom, no Testing Library) |
| Hosting | Cloudflare (Worker + static assets), CI via GitHub Actions |
| Package manager | npm (`package-lock.json`); Node 20 in CI |

## 2. Commands

```bash
npm install
npm run dev                 # vite dev server (also runs ESLint via vite-plugin-checker)
npm run lint                # eslint .
npm test -- --run           # vitest, single run  (plain `npm test` = watch mode locally)
npm run build               # vite build -> dist/
npm run preview
npm run deploy              # wrangler deploy (needs a prior build; serves ./dist + Worker)
```

**Before you finish any change, run in this order:** `npm run lint` → `npm test -- --run` → `npm run build`.
`vite-plugin-checker` is configured with ESLint, so lint errors can surface during dev and build **(verify build behavior)**.

## 3. Environment variables

Set in `.env.local` (git-ignored). Restart Vite after changing.

| Var | Purpose | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend origin. `/v1` is appended automatically if missing | `https://m198-backend.onrender.com` |
| `VITE_MAINTENANCE_MODE` | `"true"` renders `ServerDown` instead of the app (see `main.jsx`) | off |
| `VITE_CSRF_COOKIE_NAME` | Cookie read to send the `x-csrf-token` header | `XSRF-TOKEN` (CI sets `csrf_token`) |

Local backend example: `VITE_API_BASE_URL=http://localhost:8080/v1`.

## 4. Directory map

```
src/
  main.jsx                 entry: providers (Redux > Theme > Tooltip > Toaster > RouterProvider)
  app/                     store, baseApi (RTK Query), cache persistence, refresh events, layouts
    layouts/               RootLayout (public), AuthLayout, DashboardLayout (header+sidebar shell)
  routes/                  paths.js (route table), AppRoutes.jsx, ProtectedRoute/PublicRoute/CreatorRoute, ParamRedirect
  context/                 AuthContext (session bootstrap), authSession.js (pure helpers), ThemeContext
  features/<domain>/       auth, classroom, dashboard, explore, notifications, profile, settings, ui
    api/                   RTK Query endpoints (*Api.js) and imperative wrappers (*Service.js)
    components/ pages/ hooks/ model/ utils/   (only where the domain needs them)
  components/ui/           shadcn primitives (60 files, generated; edit sparingly)
  components/common/       small domain-agnostic building blocks
  pages/                   only global pages: GetStarted, NotFound, ServerDown, PageShell
  config/                  appConfig.js (maintenance flag), navigation.js (sidebar items)
  hooks/                   useLocalStorage, useMobile, usePreventSamePageNavigation
  lib/                     utils.js (`cn`), apiUtils.js (`unwrapResponse`), errorUtils.js (`parseApiError`)
  utils/                   storage (safe localStorage), dates, text, image optimization, web-vitals
  types/                   JSDoc typedefs only (no runtime exports)
  worker/index.js          Cloudflare Worker reverse proxy
docs/                      indexes of external library docs (React Router, Redux Toolkit, shadcn/studio)
```

Import alias: `@/` → `src/` (Vite + `jsconfig.json`). Prefer `@/…` over long relative paths in new code.

## 5. Routing and guards

Route paths live in **`src/routes/paths.js`** — never hard-code path strings; use `routes.*`.
Route tree is in `src/routes/AppRoutes.jsx` (exported as `appRouteConfig` and `AppRoutes`), wrapped by `<AuthProvider>`.

- **Public branch** (`PublicRoute`): `/` (GetStarted), `/auth/login|register|forgot-password|reset-password|callback`. Authenticated users are redirected to `/dashboard`.
- **Protected branch** (`ProtectedRoute` → `DashboardLayout`): `/dashboard`, `/community`, `/messages`, `/saved`, `/explore`, `/search`, `/spaces`, `/spaces/join`, `/spaces/:classId`, `/profile`, `/users/:userId`, `/settings`. Unauthenticated users go to login with `state.from`.
- **Profile gate**: if `user.profileCompleted === false`, everything redirects to `/users/new` (`CreateProfilePage`); once completed, `/users/new` redirects to `/dashboard`.
- **Creator gate** (`CreatorRoute`): `/spaces/new` requires `user.canCreateCourses || user.isAdmin`.
- **Legacy redirects** for `/classes/*` and `/dashboard/*` → new paths (`ParamRedirect` preserves params and query string). Keep them.
- Route `handle` flags drive session restore: `requiresSessionRestore` (both branches) and `isProtected`. `AppRoutes.test.jsx` asserts these and finds routes by **component function name** (`PublicRoute`, `ProtectedRoute`) — do not rename those components without updating the test.

To add a page: create it under `features/<domain>/pages/`, `lazy()`-import it in `AppRoutes.jsx`, add its path to `paths.js`, place it under the right guard, and (if it belongs in the sidebar) add it to `src/config/navigation.js`.

## 6. Auth and session model (read carefully — it is subtle)

- **Access token lives only in Redux memory** (`state.auth.accessToken`, `state.auth.user`). It is sent as `Authorization: Bearer …` by `baseApi`.
- **Refresh token is stored in `localStorage`** (`campus-mind.refreshToken`). A boolean hint `campus-mind.hasSession` is also stored. The backend may additionally use cookies (`credentials: "include"`, CSRF header).
- **Bootstrap** (`AuthContext.jsx`): on routes marked `requiresSessionRestore`, if there is no access token, status becomes `"hydrating"` → `POST /auth/refresh` → commit session → `GET /users/me` (profile) → merge into session. 400/401 during bootstrap means "logged out" (quiet); other errors surface as `authError`. Guards show `SessionBootstrapSkeleton` while hydrating.
- **401 handling** (`baseApi.js`): a single shared in-flight refresh promise; on success the failed request is retried once with `skipAuthRefresh`; on failure `clearLocalAuthSession` runs and a normalized 401 is returned. Endpoints named `login`, `register`, `refresh` never trigger refresh. `getExploreFeed`, `searchExploreCourses` are treated as public (no bearer token).
- **Logout** (`authService.logout`): sends `POST /auth/logout` *while credentials are still installed*, then always clears local state (`clearLocalAuthSession`: resets RTK Query cache, removes persisted cache, refresh token, hint). Don't reorder this.
- **OAuth**: `/auth/oauth/{google|github}` on the backend, redirecting back to `/auth/callback` with `accessToken`, `refreshToken`, and either flat fields or a JSON `user`. Parsing is in `features/auth/oauth.js` (note: `URLSearchParams` already decodes — do not decode twice).
- `normalizeAuthResponse` maps many backend field spellings to one user shape (`id`, `name`, `avatar`, `handle`, `isAdmin`, `canCreateCourses`, `profileCompleted`, …). Use `useAuth()` / auth selectors rather than reading raw payloads.
- Redux root reducer **wipes everything except `ui`** on `clearCredentials` / `forcedSignOut` (`app/store.js`).

## 7. Data layer conventions

**Single API slice.** `src/app/baseApi.js` creates `baseApi` (`reducerPath: "baseApi"`, `refetchOnFocus`, `refetchOnReconnect`, `keepUnusedDataFor: 300`). Features add endpoints with `baseApi.injectEndpoints(...)` in `features/<domain>/api/*Api.js` and export the generated hooks. Do **not** create a second `createApi`.

Existing endpoint groups (see the files for exact routes):
- `classroomApi.js` — `/courses` CRUD, archive, enrollment/join (by id or code), members and roles, join requests (list/approve/decline/cancel), invite links + token validation, cover/logo upload requests.
- `courseworkApi.js` — `/courses/:id/coursework`, submissions (`/coursework/:id/submissions`, `/me`, `/grade`), gradebooks, analytics summary.
- `commentApi.js` — coursework and submission comments. `attachmentApi.js` — signed upload URL → upload → complete; list/download/delete.
- `exploreApi.js` — `/explore/feed`, `/explore/courses/search`, `/explore/recommendations`, people (`/users`), public course.
- `notificationsApi.js` — list, mark read, settings. `profileApi.js` — `/users/me`, public profiles, `unlock-creator`.

**Tags.** Allowed tag types are declared in `baseApi.js` (`Classrooms`, `CourseFeed`, `CourseSearch`, `CourseRecommendations`, `Profile`, `Notifications`, `NotificationSettings`, `PublicCourse`, `Coursework`, `Attachments`, `CourseworkComments`, `SubmissionComments`). A new tag type must be added there. Mutations invalidate tags; do not manually refetch when a tag will do.

**Lifecycle refresh events.** `app/refreshEvents.js` maps named events (`course-created`, `submission-graded`, …) to tags; `main.jsx` listens for the `campusmind:lifecycle-refresh` window event, and `triggerLifecycleRefresh(dispatch, name)` does the same in code.

**Service wrappers.** `*Service.js` files call `store.dispatch(api.endpoints.x.initiate(arg)).unwrap()` and pass the result through `unwrapResponse` (`response?.data ?? response`). Use hooks (`useXQuery`) inside components and services for imperative flows (auth, forms). Some service functions take an unused first `_userId` argument for historical reasons — keep the signature.

**Responses and errors.** Backend responses may be raw or wrapped in `{ data }` — always unwrap. `baseApi` normalizes errors to `{ status, data: { error: string } }` (5xx and network errors become "Service unavailable"). Turn errors into messages with `parseApiError` / `mapErrorToFormFields` (`lib/errorUtils.js`).

**Persisted cache.** `app/apiCachePersistence.js` stores a small subset of queries (`fetchClassrooms`, `findClassroomById`, `getCurrentProfile`, `getPublicProfile`, `listNotifications`) in `localStorage` (`campus-mind.api-cache.v1`, 5 min TTL, 50 KB budget, keyed by user id). If you rename one of those endpoints, update `PERSISTED_ENDPOINTS`.

**Other slices:** `ui` (sidebar open state), `courseContext` (active course/coursework, staff/enrolled flags, filters).

## 8. UI conventions

- Use **semantic Tailwind tokens** from `src/index.css` (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-muted-foreground`, plus project aliases `bg-canvas`, `bg-surface`, `text-text-muted`). Colors are OKLCH CSS variables; brand primary is a blue-violet.
- **Dark mode** = `.dark` class on `<html>`, set by `ThemeContext` (`light | dark | system`, stored in `campus-mind.theme`). Use `dark:` variants; don't hard-code hex colors.
- **Class merging:** the canonical helper is `cn` from **`@/lib/utils`** (clsx + tailwind-merge). See Known issues for the `from "cn"` inconsistency.
- shadcn config is in `components.json` (`style: base-nova`, `tsx: false`, alias `@/components/ui`). Add primitives with the shadcn CLI (`npx shadcn@latest add <name>`), keep them `.jsx`, and avoid hand-editing generated files unless necessary. `components/ui/*` is exempt from the `react-refresh/only-export-components` lint rule.
- Icons: `lucide-react` by default; `react-icons/fa` is used only for social logos on Login/Register.
- Toasts: `@/components/ui/toast.jsx` (`<Toaster />` mounted in `main.jsx`). `TooltipProvider` is mounted globally — needed by any `Tooltip`.
- Loading UI uses dedicated skeleton components (`*Skeleton.jsx`); match that pattern rather than spinners for page-level loading.
- Images: `optimizeImage()` converts uploads to WebP client-side before upload.

## 9. Domain glossary

- **Space** (UI term) = **course** (API term) = **classroom/class** (older code names). Routes are `/spaces/*`; API is `/courses/*`; many components/files still say `Class*`. `routes.classes` and `routes.spaces` are both defined (same URLs); new code should use `routes.spaces`.
- **Access type** on create: `PUBLIC | PRIVATE | LINK_ONLY`. Joining works by enrollment code, invite link token, direct open enrollment, or a join request that staff approve/decline.
- **Roles seen in code:** `OWNER`, `ADMIN`, `TEACHER`, `MEMBER`, `STUDENT`, `VIEWER` (non-member viewing a public course), `CREATED`. `isStaffRole()` (`features/classroom/utils/roles.js`) treats `owner`, `admin`, `created` (case-insensitive) as staff. Use `isStaffRole` / `isUserEnrolled` instead of re-implementing checks.
- **Coursework types:** `ASSIGNMENT | ANNOUNCEMENT | MATERIAL`; statuses `DRAFT | PUBLISHED | ARCHIVED`. **Submission statuses:** `DRAFT | TURNED_IN | RETURNED | GRADED | MISSING`.
- **Creator**: user flag `canCreateCourses` (unlocked via `POST /users/me/unlock-creator`); `isAdmin` also qualifies.
- **Space page tabs** (`features/classroom/components/classPage/`): Home, Classwork, Grades, Members.

## 10. Feature status — what is real vs placeholder

| Area | Status |
|---|---|
| Auth, profile, spaces, coursework, submissions/grades, comments, attachments, explore, notifications (30 s polling, paused when tab hidden), settings | **Backed by the API** |
| **Community** feed (`useCommunityFeed`) | **Mock data** from `dashboard/model/communityData.js` |
| **Messages** (`useMessages`) | **Mock data** from `dashboard/model/messagesData.js` |
| **Assignments** dashboard hook (`useAssignments`) | **Stub** — always returns `{ data: null }` |
| **Saved** items / collections | **Local only** — `localStorage` (`campus-mind.savedItems`, `campus-mind.savedCollections`), no API |

Do not assume the endpoints `GET /community/feed`, `/messages/conversations`, `/assignments` are called — the README lists them, but the current hooks do not use them.

## 11. Testing conventions

- **51 test files**, co-located with source (`Foo.jsx` + `Foo.test.jsx`). Runner is Vitest with **default Node environment**; `jsdom`/`happy-dom` and `@testing-library/*` are **not installed**.
- Component tests render with `renderToString` from `react-dom/server` and assert on the HTML string. Wrap router-dependent components in `MemoryRouter`.
- Mock collaborators with `vi.mock(...)`: `react-router`, `react-redux`, `@/context/AuthContext.jsx`, and the RTK Query hook modules (see `JoinSpace.test.jsx`). Avoid touching `document`/`window` in component code paths that tests render; where needed tests use `vi.stubGlobal("window", …)` (see `baseApi.test.js`).
- Pure logic (auth session helpers, refresh flow, filters, slices, validation, error parsing) is tested directly; favor extracting logic into pure functions so it stays testable in Node.
- Add or update a test for any change to `baseApi.js`, `authSession.js`, guards, slices, or `model/` / `utils/` functions.

## 12. Build, deploy, CI

- `wrangler.json`: Worker entry `src/worker/index.js`, static assets from `./dist` with SPA fallback; the Worker runs **first** for `/v1/*`, `/oauth2/*`, `/login/*` and reverse-proxies to `BACKEND_API_URL` (adds forwarded headers, sets CORS to the request origin with credentials). Its purpose is to make API calls same-origin (cookies/CSRF). Note that the frontend's default `VITE_API_BASE_URL` points at the backend directly — the proxy is only in the path if the app is configured to call same-origin `/v1`. **(verify which mode production uses)**
- `public/_headers`: security headers and long-lived cache for `/assets/*`, no-cache for `index.html`.
- `vite.config.js`: manual chunks (`vendor-react`, `vendor-router`, `vendor-redux`, `vendor-icons`, `vendor-ui`, `vendor`). Keep new heavy dependencies out of the main chunk by lazy-loading routes.
- `.github/workflows/deploy-cloudflare.yml`: on push to `main` → Node 20 → `npm ci` → `npm test` → `npm run build` → deploy step (only if Cloudflare secrets exist).
- `.github/workflows/keep_alive.yml`: cron every 14 min to keep the Render backend awake.

## 13. Known issues and gotchas (verified in source)

1. **Inconsistent `cn` import.** 58 files import `cn` from the npm package **`"cn"`** (`cn@0.2.5`), only 9 from `@/lib/utils`. The shadcn alias and canonical helper is `@/lib/utils` (clsx + tailwind-merge). Use `@/lib/utils` in new code; don't bulk-change existing files without checking that tailwind-merge behavior is preserved.
2. **Persisted API cache is likely ineffective.** Nothing in `src` writes `campus-mind.session`, yet `getPersistedUserId()` reads it at startup. With no user id at load, `readPersistedApiState` discards (and clears) the stored cache. **(verify at runtime)** before depending on cache persistence.
3. **Stale endpoint name in `baseApi.js`.** `PUBLIC_DISCOVERY_ENDPOINTS` contains `"uploadCourseCover"`, but the real endpoint is `requestCourseCoverUpload` — so it currently *does* send the bearer token / go through refresh. Fix the name if that was not intended.
4. **`keep_alive.yml` pings `https://onrender.com`**, not the backend host, so it does not keep the backend awake. Point it at the backend URL.
5. **Deploy mismatch.** CI runs `wrangler pages deploy dist --project-name=campus-mind` (Pages), while `wrangler.json` and `npm run deploy` describe a **Worker with assets**. A Pages deploy would not run `src/worker/index.js`. Decide on one model before changing deploy config. Also, the deploy step's `if: env.CLOUDFLARE_API_TOKEN != ''` reads variables that are defined in that same step's own `env:` block; GitHub Actions does not expose a step's own `env` to its `if`, so the step may never run **(verify in the Actions logs)**.
6. **`tailwind.config.js` looks unused.** It uses CommonJS `module.exports` in an ESM package and Tailwind v4 only loads a config via `@config` (none in `index.css`). Theme customization belongs in `src/index.css` (`@theme inline` / CSS variables).
7. **Unused or rarely used dependencies:** `inngest` and `date-fns` have no imports in `src`; `@shadcn/react` is used only by `ui/message-scroller.jsx`; `lucide-react` is pinned to `latest`. Don't add imports to these without reason; consider pruning.
8. **README drift.** README lists community/messages/assignments endpoints as part of the client's API contract, but the current hooks don't call them (see §10). Trust the code over the README for what is wired up.
9. **Refresh token in `localStorage`** (XSS-exposed by design here). Don't log tokens; don't widen where they are stored.
10. **Very large components** (>20 KB): `ClassHeader`, `ClassFeedPost`, `ProfilePage`, `EditSpaceModal`, `MembersTab`, `CreateSpace`. Prefer extracting subcomponents/hooks over adding more code inline. Open TODOs: `SpacePage.jsx` (two "make a reusable component"), `NotificationsMenu.jsx` (link navigation).
11. **`usePreventSamePageNavigation`** (used by `RootLayout`) globally swallows clicks on links pointing at the current path in the public layout.
12. ESLint `no-unused-vars` ignores names starting with an uppercase letter or `_` (and `motion`, `heroY`, `heroOpacity`) — don't rely on lint to catch unused component imports.

## 14. Rules for agents

**Do**
- Match the existing feature-folder structure; keep domain code inside `features/<domain>/`.
- Use `routes.*`, `useAuth()`, auth selectors, `unwrapResponse`, `parseApiError`, `safeLocalStorage*` (`utils/storage.js`) instead of raw equivalents.
- Wrap `localStorage` access via the safe helpers or try/catch (private mode / SSR-like test environments).
- Keep the UI accessible (labels, `aria-*`, focus states) — existing components already do this.
- Add/update co-located Vitest tests; keep them Node-runnable.

**Don't**
- Don't add TypeScript, a second data-fetching library, or a second RTK Query API slice.
- Don't store access tokens outside Redux memory; don't call `fetch` directly for backend endpoints (use `baseApi`), except for signed third-party uploads (see `attachmentService.uploadAttachmentFile`).
- Don't rename `PublicRoute`/`ProtectedRoute` or change `handle` flags without updating `AppRoutes.test.jsx` and `authSession.js` restore logic.
- Don't hard-code URLs, colors, or storage keys that already have a constant.
- Don't edit `package-lock.json` by hand or commit `.env*` files.

## 15. Reference docs

`docs/` contains link indexes (not full text) for the libraries this project uses — start there for API details:
`docs/reactrouter-docs-index.md`, `docs/redux-toolkit-docs-index.md`, `docs/shadcn-studio-docs-index.md`.
Official docs: React Router (`https://reactrouter.com`), Redux Toolkit / RTK Query (`https://redux-toolkit.js.org`), shadcn/ui (`https://ui.shadcn.com`), Base UI (`@base-ui/react`).
