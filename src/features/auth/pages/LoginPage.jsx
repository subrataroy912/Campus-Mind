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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
          "Please check your email and password and try again.",
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex min-h-11 min-w-11 items-center justify-center text-text-muted hover:text-text-main hover:bg-transparent cursor-pointer"
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
          <Label className="flex items-center gap-1.5 cursor-pointer select-none text-text-muted hover:text-text-main font-medium">
            <Input
              className="h-3.5 w-3.5 accent-primary rounded cursor-pointer p-0 border-0 shadow-none"
              name="rememberMe"
              onChange={updateField}
              type="checkbox"
              checked={formData.rememberMe}
              disabled={isLoading}
            />
            Remember me
          </Label>
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
