import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, Mail, UserRound } from "lucide-react";
import AuthInput from "../components/AuthInput.jsx";
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
        description: "Your account is ready. Sign in to continue.",
        type: "success",
      });
      navigate("/auth/login", { replace: true, state: { registered: true } });
    } catch (err) {
      toast.add({
        title: "Registration failed",
        description:
          err?.data?.error ||
          err?.message ||
          "Please review the form and try again.",
        type: "error",
      });
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-text-heading">
        Create your account
      </h1>
      <p className="mt-2 text-text-main">
        Start with a simple local account. You can set up your profile later.
      </p>
      {authStatus === "failed" && (
        <p
          className="mt-5 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-medium"
          role="alert"
        >
          {error}
        </p>
      )}
      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
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
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-7 text-center text-text-main">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-bold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
      <div className="flex items-center justify-center gap-2 p-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                aria-label="Sign up with Google"
                onClick={() => startOAuth("google")}
                disabled={loading}
              />
            }
          >
            <FaGoogle size={25} />
          </TooltipTrigger>
          <TooltipContent>Sign up with Google</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                aria-label="Sign up with GitHub"
                onClick={() => startOAuth("github")}
                disabled={loading}
              />
            }
          >
            <FaGithub size={25} />
          </TooltipTrigger>
          <TooltipContent>Sign up with GitHub</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
