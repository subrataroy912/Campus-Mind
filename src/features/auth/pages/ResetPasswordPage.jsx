import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Lock, Eye, EyeOff, ShieldCheck, Check, X } from "lucide-react";
import AuthInput from "../components/AuthInput.jsx";
import { Button } from "@/components/ui/button.jsx";
import { routes } from "@/routes/paths.js";

const RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (value) => value.length >= 8,
  },
  {
    id: "number",
    label: "Contains a number",
    test: (value) => /\d/.test(value),
  },
];

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const updateField = ({ target: { name, value } }) =>
    setFormData((previous) => ({ ...previous, [name]: value }));

  const failedRule = RULES.find((rule) => !rule.test(formData.password));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (failedRule) {
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Those passwords do not match.");
      return;
    }

    setError(
      "Password recovery is not available until the backend exposes a reset endpoint."
    );
  };

  if (!token) {
    return (
      <div className="text-center py-2">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck size={20} aria-hidden="true" />
        </div>
        <h1 className="mt-3 text-base font-semibold tracking-tight text-text-heading">
          This link isn't valid
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          It may have expired, or already been used. Request a fresh link to
          continue.
        </p>
        <Link to={routes.auth.forgotPassword} className="mt-4 block">
          <Button className="w-full h-9 text-xs font-semibold">Request a new link</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-lg font-semibold tracking-tight text-text-heading">
        Set a new password
      </h1>
      <p className="mt-1 text-xs text-text-muted">
        Choose something you haven't used before on CampusMind.
      </p>

      {error && (
        <p
          className="mt-3 rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
        <AuthInput
          icon={Lock}
          label="New password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={updateField}
          placeholder="Enter a new password"
          required
          autoComplete="new-password"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="text-text-muted hover:text-text-main focus:outline-none cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        <AuthInput
          icon={Lock}
          label="Confirm password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={updateField}
          placeholder="Re-enter the password"
          required
          autoComplete="new-password"
        />

        <ul className="space-y-1 rounded-md border border-border/70 bg-canvas/30 px-3 py-2">
          {RULES.map((rule) => {
            const met = rule.test(formData.password);
            return (
              <li key={rule.id} className="flex items-center gap-1.5 text-xs">
                {met ? (
                  <Check
                    size={14}
                    className="text-emerald-600 dark:text-emerald-400"
                    aria-hidden="true"
                  />
                ) : (
                  <X size={14} className="text-text-muted" aria-hidden="true" />
                )}
                <span className={met ? "text-text-heading font-medium" : "text-text-muted"}>
                  {rule.label}
                </span>
              </li>
            );
          })}
        </ul>

        <Button className="w-full min-h-11 text-xs font-semibold" type="submit">
          Update password
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-text-muted flex items-center justify-center">
        <Link
          className="font-semibold text-primary hover:underline min-h-11 inline-flex items-center"
          to={routes.auth.login}
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
