import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext.jsx";
import { normalizeAuthResponse } from "../api/authService.js";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeOAuth, authError, authStatus } = useAuth();

  useEffect(() => {
    if (authStatus !== "idle") return;

    const accessToken = searchParams.get("accessToken") || searchParams.get("access_token") || searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken") || searchParams.get("refresh_token");
    const errorMessage = searchParams.get("error");
    const encodedUser = searchParams.get("user");

    if (errorMessage) {
      try {
        completeOAuth({ token: null, user: null, errorMessage });
      } catch {
        // AuthContext owns the failure state shown below.
      }
      return;
    }

    const finishOAuth = async () => {
      try {
        const user = encodedUser ? JSON.parse(decodeURIComponent(encodedUser)) : null;
        const response = normalizeAuthResponse({
          accessToken,
          refreshToken,
          user,
          userId: searchParams.get("userId"),
          email: searchParams.get("email"),
          displayName: searchParams.get("displayName"),
          avatarUrl: searchParams.get("avatarUrl"),
        });
        await completeOAuth(response);
        navigate("/dashboard", { replace: true });
      } catch {
        // AuthContext owns the failure state shown below.
      }
    };

    finishOAuth();
  }, [authStatus, completeOAuth, navigate, searchParams]);

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