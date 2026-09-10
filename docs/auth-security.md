# Authentication security contract

Refresh and logout use `credentials: "include"`. The backend must issue refresh
credentials only as `Secure`, `HttpOnly`, `SameSite` cookies and validate the
`X-CSRF-Token` request header against the readable CSRF cookie named by
`VITE_CSRF_COOKIE_NAME` (default: `XSRF-TOKEN`). CORS must allow credentials and
the CSRF header for the deployed client origin.

During the transition, the application still accepts access credentials returned
by login/refresh responses to support API authorization. Any bearer token held in
JavaScript is exposed to a successful XSS attack. Keep access tokens short-lived,
do not add token storage outside `src/context/authSession.js`, and complete the
cookie-only access-token migration as soon as the backend supports it.
