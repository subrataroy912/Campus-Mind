import React from "react";
import { Navigate, useParams, useLocation } from "react-router";

/**
 * Backward-Compatible Parameterized Redirect Component.
 *
 * For dynamic routes (e.g., `/old/:id` -> `/new/:id`), standard static
 * `<Navigate to="..."/>` cannot inject URL parameters or preserve search queries.
 * This helper resolves target paths dynamically via a path string or resolver function.
 *
 * @param {Object} props
 * @param {string | ((params: Record<string, string | undefined>, location: import('react-router-dom').Location) => string)} props.to
 *   Target path string or a function receiving the current route params and location object.
 * @param {boolean} [props.keepSearch=true] Whether to forward the existing query string (e.g., `?tab=grades`).
 * @param {boolean} [props.replace=true] Whether to replace the current entry in history stack.
 * @returns {JSX.Element}
 */
export default function ParamRedirect({
  to,
  keepSearch = true,
  replace = true,
}) {
  const params = useParams();
  const location = useLocation();

  const resolved = typeof to === "function" ? to(params, location) : to;
  const search = keepSearch && location.search ? location.search : "";

  // Prevent duplicate '?' if resolved already contains query params
  const targetPath =
    search && !resolved.includes("?") ? `${resolved}${search}` : resolved;

  return <Navigate to={targetPath} replace={replace} />;
}
