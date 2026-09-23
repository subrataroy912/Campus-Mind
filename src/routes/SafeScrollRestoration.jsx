import { ScrollRestoration } from "react-router";

/**
 * Safe wrapper around React Router's ScrollRestoration.
 *
 * Excludes execution in Node.js server environments (e.g., during SSR
 * or Vitest Node test suite runs) to prevent data-router hook errors.
 */
export default function SafeScrollRestoration() {
  if (typeof window === "undefined") {
    return null;
  }
  return <ScrollRestoration />;
}
