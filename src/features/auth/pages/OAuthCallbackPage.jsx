import { useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { normalizeAuthResponse } from "../api/authService.js";
import { handleOAuthFailure, parseOAuthCallback } from "../oauth.js";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { completeOAuth, authError, authStatus } = useAuth();
  const hasStarted = useRef(false);

  useEffect(() => {
    // AuthProvider starts by restoring any existing browser session, so there
    // is no "idle" state to wait for.  Waiting for one left OAuth callbacks
    // permanently on the completing screen after every fresh page load.
    if (authStatus === "hydrating" || hasStarted.current) return;
    hasStarted.current = true;

    const finishOAuth = async () => {
      try {
        const hashParams = new URLSearchParams(location.hash.replace(/^#/, ""));
        const params = hashParams.toString() ? hashParams : searchParams;
        const callback = parseOAuthCallback(params);
        // Tokens are single-use bootstrap data and must not remain in history.
        window.history.replaceState({}, document.title, window.location.pathname);
        if (callback.errorMessage) {
          await handleOAuthFailure({
            completeOAuth,
            errorMessage: callback.errorMessage,
          });
          return;
        }

        const response = normalizeAuthResponse(callback);
        await completeOAuth(response);
        navigate("/dashboard", { replace: true });
      } catch {
        // AuthContext owns the failure state shown below.
      }
    };

    void finishOAuth();
  }, [authStatus, completeOAuth, location, navigate, searchParams]);

  if (authStatus === "failed") {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-text-heading">Sign-in failed</h1>
        <p className="text-sm text-text-muted">
          {authError?.message || "The provider could not authenticate your account."}
        </p>
        <button
          type="button"
          className="text-sm font-semibold text-primary hover:underline"
          onClick={() => navigate("/auth/login", { replace: true })}
        >
          Return to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="grid min-h-48 place-items-center text-sm text-text-muted">
      <span className="inline-flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Completing sign-in…
      </span>
    </div>
  );
}
