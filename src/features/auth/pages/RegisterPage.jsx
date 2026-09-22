import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Mail, UserRound } from "lucide-react";
import AuthInput from "../components/AuthInput.jsx";
import { getOAuthRedirectUrl } from "../api/authService.js";
import { Button } from "@/components/ui/button.jsx";
import { toast } from "@/components/ui/toast.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { parseApiError } from "@/lib/errorUtils.js";

export default function RegisterPage() {
  const { register, authError, authStatus, clearAuthError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const loading = authStatus === "loading";
  const error =
    authError?.data?.error ||
    authError?.message ||
    "Unable to create your account.";

  const startOAuth = (provider) => {
    clearAuthError();
    window.location.assign(getOAuthRedirectUrl(provider));
  };

  const updateField = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearAuthError();
    try {
      await register(formData);
      toast.add({
        title: "Account created",
        description: "Your account is ready. Complete your profile to get started.",
        type: "success",
      });
      navigate(routes.profile.new, { replace: true });
    } catch (err) {
      toast.add({
        title: "Registration failed",
        description: parseApiError(
          err,
          "Please review the form and try again."
        ).message,
        type: "error",
      });
    }
  };
  return (
    <div>
      <h1 className="text-lg font-semibold tracking-tight text-text-heading">
        Create your account
      </h1>
      <p className="mt-1 text-xs text-text-muted">
        Start with a simple local account. You can set up your profile later.
      </p>
      {authStatus === "failed" && (
        <p
          className="mt-3 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2">
          <AuthInput
            icon={UserRound}
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={updateField}
            placeholder="Subrata"
            required
            disabled={loading}
            autoComplete="name"
          />
          <AuthInput
            icon={UserRound}
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={updateField}
            placeholder="Roy"
            required
            disabled={loading}
            autoComplete="name"
          />
        </div>
        <AuthInput
          icon={Mail}
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={updateField}
          placeholder="you@example.com"
          required
          disabled={loading}
          autoComplete="email"
        />
        <AuthInput
          icon={Lock}
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={updateField}
          placeholder="Choose a password"
          required
          minLength="8"
          disabled={loading}
          autoComplete="new-password"
        />
        <Button className="w-full h-9 text-xs font-semibold" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-text-muted">
        Already have an account?{" "}
        <Link
          to={routes.auth.login}
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
      <div className="flex items-center justify-center gap-2 pt-3 border-t border-border/60 mt-3">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Sign up with Google"
                onClick={() => startOAuth("google")}
                disabled={loading}
              />
            }
          >
            <FaGoogle size={14} />
          </TooltipTrigger>
          <TooltipContent>Sign up with Google</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Sign up with GitHub"
                onClick={() => startOAuth("github")}
                disabled={loading}
              />
            }
          >
            <FaGithub size={14} />
          </TooltipTrigger>
          <TooltipContent>Sign up with GitHub</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
