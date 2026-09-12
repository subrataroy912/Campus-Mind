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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx";
import { FaGithub, FaGoogle } from "react-icons/fa";

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
      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.add({
        title: "Sign-in failed",
        description:
          err?.data?.error ||
          err?.message ||
          "Please check your email and password and try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold tracking-tight text-text-heading">
        Welcome back
      </h1>
      <p className="mt-2 text-text-main">
        Sign in to see what is happening in your classes.
      </p>

      {/* 3rd-party cookie notice on page open */}
      {showCookieNotice && (
        <div
          className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-200"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1 text-xs leading-relaxed text-black">
            <span className="font-semibold text-black">Notice: </span>
            Please enable 3rd-party cookies in your browser settings; otherwise,
            your login session will not stay active.
          </div>
          <button
            type="button"
            onClick={() => setShowCookieNotice(false)}
            className="text-amber-300/70 hover:text-amber-100 p-0.5 transition-colors focus:outline-none"
            aria-label="Dismiss cookie notice"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {location.state?.registered && (
        <p
          className="mt-5 rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm font-medium text-text-main"
          role="status"
        >
          Account created. You can sign in now.
        </p>
      )}

      {/* Render precise backend or network errors */}
      {authStatus === "failed" && (
        <p
          className="mt-5 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-medium text-text-main"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
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
                    className="text-text-muted hover:text-text-main focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  />
                }
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
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
        <div className="flex flex-col gap-2 text-sm font-bold min-[400px]:flex-row min-[400px]:items-center min-[400px]:justify-between min-[400px]:gap-4">
          <label className="flex min-h-11 items-center gap-3 cursor-pointer select-none">
            <input
              className="h-5 w-5 accent-primary rounded cursor-pointer"
              name="rememberMe"
              onChange={updateField}
              type="checkbox"
              checked={formData.rememberMe}
              disabled={isLoading}
            />
            Remember me
          </label>
          <Link
            className="text-primary-hover hover:underline"
            to="/auth/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          className="w-full text-lg flex items-center justify-center gap-2"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"} <ArrowRight size={24} />
        </Button>
      </form>

      <p className="mt-7 text-center text-text-main">
        New here?{" "}
        <Link
          className="font-bold text-primary hover:underline"
          to="/auth/register"
        >
          Create an account
        </Link>
      </p>
      <div className="flex items-center justify-center gap-2 p-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                aria-label="Sign in with Google"
                onClick={() => startOAuth("google")}
                disabled={isLoading}
              />
            }
          >
            <FaGoogle size={25} />
          </TooltipTrigger>
          <TooltipContent>Continue with Google</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                aria-label="Sign in with GitHub"
                onClick={() => startOAuth("github")}
                disabled={isLoading}
              />
            }
          >
            <FaGithub size={25} />
          </TooltipTrigger>
          <TooltipContent>Continue with GitHub</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default LoginPage;
