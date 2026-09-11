import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
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
  const [cookieWarning, setCookieWarning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [devicePlatform, setDevicePlatform] = useState("ios"); // 'ios' | 'android' | 'other'

  const isLoading = authStatus === "loading";
  const errorMessage =
    authError?.data?.error || authError?.message || "Unable to sign in.";

  // Reliable cross-platform cookie verification test
  const verifyCookieSupport = () => {
    try {
      if (typeof navigator !== "undefined" && !navigator.cookieEnabled) {
        return false;
      }
      const testKey = "__cookie_test__";
      document.cookie = `${testKey}=1; SameSite=Lax; path=/`;
      const isSet = document.cookie.includes(`${testKey}=1`);
      document.cookie = `${testKey}=; Max-Age=0; path=/`;
      return isSet;
    } catch {
      return false;
    }
  };

  // Inspect client device and verify cookie readiness on mount
  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDevicePlatform("ios");
    } else if (/android/i.test(userAgent)) {
      setDevicePlatform("android");
    } else {
      setDevicePlatform("other");
    }

    async function checkCookieAndStorageStatus() {
      // 1. Direct cookie read/write check
      const cookiesWork = verifyCookieSupport();
      if (!cookiesWork) {
        setCookieWarning(true);
        return;
      }

      // 2. Storage Access API check (if loaded in an iframe or cross-origin context)
      if ("hasStorageAccess" in document) {
        try {
          const hasAccess = await document.hasStorageAccess();
          if (!hasAccess) {
            setCookieWarning(true);
            return;
          }
        } catch {
          // Ignored if API is unsupported or blocked by browser policy
        }
      }

      setCookieWarning(false);
    }

    checkCookieAndStorageStatus();
  }, []);

  const startOAuth = (provider) => {
    clearAuthError();
    window.location.assign(getOAuthRedirectUrl(provider, "login"));
  };

  const updateField = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const requestAccess = async () => {
    if ("requestStorageAccess" in document) {
      try {
        await document.requestStorageAccess();
        setCookieWarning(false);
      } catch (err) {
        console.warn("Storage access request failed or dismissed:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearAuthError();

    // Verify cookies before submitting credentials
    if (!verifyCookieSupport()) {
      setCookieWarning(true);
      toast.add({
        title: "Cookies Disabled",
        description: "Please enable cookies in your browser settings to sign in.",
        type: "error",
      });
      return;
    }

    // Attempt Storage Access API prompt if available and ungranted
    if ("requestStorageAccess" in document && "hasStorageAccess" in document) {
      try {
        const hasAccess = await document.hasStorageAccess();
        if (!hasAccess) {
          await document.requestStorageAccess();
          setCookieWarning(false);
        }
      } catch {
        // Fall through to standard authentication flow
      }
    }

    try {
      await login(formData);

      toast.add({
        title: "Welcome back",
        description: "You are signed in and ready to continue.",
        type: "success",
      });
      navigate("/dashboard", { replace: true });
    } catch {
      toast.add({
        title: "Sign-in failed",
        description: "Please check your email and password and try again.",
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

      {/* Mobile-Friendly Cookie Warning Banner */}
      {cookieWarning && (
        <div
          className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200"
          role="alert"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-300">
                Cookies or Storage Blocked
              </p>
              <p className="mt-1 text-xs leading-relaxed text-amber-200/90">
                Your mobile browser is blocking cookies. Signing in requires cookies to keep your session active.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {"requestStorageAccess" in document && (
                  <button
                    type="button"
                    onClick={requestAccess}
                    className="rounded-md border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-100 hover:bg-amber-500/30 focus:outline-none"
                  >
                    Grant Access
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowInstructions((prev) => !prev)}
                  className="flex items-center gap-1 text-xs font-medium text-amber-300 underline hover:text-amber-100"
                >
                  {showInstructions ? "Hide instructions" : "How to enable"}
                  {showInstructions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Accordion Instructions tailored for iOS vs Android */}
          {showInstructions && (
            <div className="mt-3 border-t border-amber-500/20 pt-3 text-xs leading-relaxed text-amber-100/90">
              {devicePlatform === "ios" ? (
                <div>
                  <p className="font-semibold text-amber-200 mb-1">On iOS (Safari):</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open <strong>Settings</strong> &gt; <strong>Safari</strong>.</li>
                    <li>Scroll to <strong>Privacy &amp; Security</strong>.</li>
                    <li>Turn off <strong>Block All Cookies</strong>.</li>
                    <li>Turn off <strong>Prevent Cross-Site Tracking</strong> (if signing in across domains).</li>
                  </ol>
                </div>
              ) : devicePlatform === "android" ? (
                <div>
                  <p className="font-semibold text-amber-200 mb-1">On Android (Chrome):</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Open Chrome &gt; Tap the <strong>three dots</strong> (top-right).</li>
                    <li>Go to <strong>Settings</strong> &gt; <strong>Site settings</strong> &gt; <strong>Cookies</strong>.</li>
                    <li>Select <strong>Allow cookies</strong> or <strong>Block third-party cookies in Incognito</strong>.</li>
                  </ol>
                </div>
              ) : (
                <div>
                  <p className="font-semibold text-amber-200 mb-1">In your browser settings:</p>
                  <p>Check your browser privacy settings and make sure cookies and site data are permitted.</p>
                </div>
              )}
            </div>
          )}
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
