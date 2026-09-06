import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Check } from "lucide-react";
import AuthInput from "../components/AuthInput";
import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { mockUsers } from "@/mock/mockUsers.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errorMessage, setErrorMessage] = useState(""); // Replaced boolean with string for dynamic messages
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [openDummyEmailCard, setOpenDummyEmailCard] = useState(false);

  const selectDemoAccount = (account) => {
    setFormData((previous) => ({
      ...previous,
      email: account.email,
      password: account.password,
    }));
    setErrorMessage("");
    setOpenDummyEmailCard(false);
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
    setIsLoading(true);
    setErrorMessage("");
    try {
      await login(formData);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
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

      {location.state?.registered && (
        <p
          className="mt-5 rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm font-medium text-text-main"
          role="status"
        >
          Account created. You can sign in now.
        </p>
      )}

      {/* Render precise backend or network errors */}
      {errorMessage && (
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
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text-main focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
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
      <div className="mt-5 flex justify-center">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => setOpenDummyEmailCard(true)}
        >
          Use a demo account
        </Button>
      </div>

      <Dialog open={openDummyEmailCard} onOpenChange={setOpenDummyEmailCard}>
        <DialogContent
          className="grid max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden bg-surface p-0"
          showCloseButton
        >
          <DialogHeader className="border-b border-border px-4 py-4 sm:px-6">
            <DialogTitle className="text-lg font-bold text-text-heading">
              Choose a demo account
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 text-text-muted">
              Select an account to fill in its email and password automatically.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 space-y-2 overflow-y-auto bg-canvas p-3 sm:p-4">
            {mockUsers.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => selectDemoAccount(account)}
                className="group flex w-full flex-col gap-2 rounded-xl border border-border bg-surface p-3 text-left shadow-sm transition hover:border-primary/50 hover:bg-primary/5 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-focus sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-text-heading">
                    {account.name}
                  </span>
                  <span className="block break-all text-sm text-text-muted">
                    {account.email}
                  </span>
                  <span className="mt-1 inline-block rounded bg-canvas px-1.5 py-0.5 font-mono text-xs text-text-muted">
                    {account.password}
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary">
                  Use account <Check size={16} aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default LoginPage;
