import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  AlertTriangle,
  X,
} from "lucide-react";
import AuthInput from "../components/AuthInput";
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

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authError, authStatus, clearAuthError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showCookieNotice, setShowCookieNotice] = useState(true);

  const isLoading = authStatus === "loading";
  const errorMessage =
    authError?.data?.error || authError?.message || "Unable to sign in.";

  const startOAuth = (provider) => {
    clearAuthError();
    window.location.assign(getOAuthRedirectUrl(provider));
  };

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    try {
      await login(formData);

      toast.add({
        title: "Welcome back",
        description: "You are signed in and ready to continue.",
        type: "success",
      });
      navigate(routes.dashboard, { replace: true });
    } catch (err) {
      toast.add({
        title: "Sign-in failed",
        description: parseApiError(
          err,
          "Please check your email and password and try again."
        ).message,
        type: "error",
      });
    }
  };

  return (
    <div className="relative">
      <h1 className="text-lg font-semibold tracking-tight text-text-heading">
        Welcome back
      </h1>
      <p className="mt-1 text-xs text-text-muted">
        Sign in to see what is happening in your classes.
      </p>

      {/* 3rd-party cookie notice on page open */}
      {showCookieNotice && (
        <div
          className="mt-3.5 flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/10 p-2.5 text-xs text-amber-800 dark:text-amber-300"
          role="alert"
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <div className="flex-1 text-[11px] leading-relaxed">
            <span className="font-semibold">Notice: </span>
            Please enable 3rd-party cookies in your browser settings; otherwise,
            your login session will not stay active.
          </div>
          <button
            type="button"
            onClick={() => setShowCookieNotice(false)}
            className="text-amber-600/70 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 p-0.5 transition-colors focus:outline-none cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {location.state?.registered && (
        <p
          className="mt-3 rounded-lg border border-success/25 bg-success/10 px-3 py-2 text-xs font-medium text-text-main"
          role="status"
        >
          Account created. You can sign in now.
        </p>
      )}

      {/* Render precise backend or network errors */}
      {authStatus === "failed" && (
        <p
          className="mt-3 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <AuthInput
          icon={Mail}
          label="Email"
          name="email"
          onChange={updateField}
          placeholder="you@example.com"
          required
          type="email"
          value={formData.email}
          disabled={isLoading}
        />
        <AuthInput
          icon={Lock}
          label="Password"
          name="password"
          onChange={updateField}
          placeholder="Enter your password"
          required
          rightIcon={
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-text-main focus:outline-none cursor-pointer"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  />
                }
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </TooltipTrigger>
              <TooltipContent>
                {showPassword ? "Hide password" : "Show password"}
              </TooltipContent>
            </Tooltip>
          }
          type={showPassword ? "text" : "password"}
          value={formData.password}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-text-muted hover:text-text-main font-medium">
            <input
              className="h-3.5 w-3.5 accent-primary rounded cursor-pointer"
              name="rememberMe"
              onChange={updateField}
              type="checkbox"
              checked={formData.rememberMe}
              disabled={isLoading}
            />
            Remember me
          </label>
          <Link
            className="text-primary hover:underline font-medium text-[11px]"
            to={routes.auth.forgotPassword}
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          className="w-full h-9 text-xs font-semibold flex items-center justify-center gap-1.5"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"} <ArrowRight size={14} />
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-text-muted">
        New here?{" "}
        <Link
          className="font-semibold text-primary hover:underline"
          to={routes.auth.register}
        >
          Create an account
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
                aria-label="Sign in with Google"
                onClick={() => startOAuth("google")}
                disabled={isLoading}
              />
            }
          >
            <FaGoogle size={14} />
          </TooltipTrigger>
          <TooltipContent>Continue with Google</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Sign in with GitHub"
                onClick={() => startOAuth("github")}
                disabled={isLoading}
              />
            }
          >
            <FaGithub size={14} />
          </TooltipTrigger>
          <TooltipContent>Continue with GitHub</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default LoginPage;
