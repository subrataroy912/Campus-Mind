import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import AuthInput from "../components/AuthInput.jsx";
import { Button } from "@/components/ui/button.jsx";
import { routes } from "@/routes/paths.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter your email to continue.");
      return;
    }
    setError(
      "Password recovery is not available until the backend exposes a recovery endpoint."
    );
  };

  if (sent) {
    return (
      <div className="text-center py-2">
        <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
          <MailCheck size={20} aria-hidden="true" />
        </div>
        <h1 className="mt-3 text-base font-semibold tracking-tight text-text-heading">
          Check your inbox
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          If an account exists for{" "}
          <span className="font-semibold text-text-heading">{email}</span>, a
          reset link is on its way.
        </p>
        <p className="mt-4 text-xs text-text-muted">
          Didn't get anything? Check your spam folder, or{" "}
          <button
            type="button"
            onClick={() => setSent(false)}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            try a different email
          </button>
          .
        </p>
        <Link
          to={routes.auth.login}
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to={routes.auth.login}
        className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text-main transition-colors"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to sign in
      </Link>

      <h1 className="mt-3 text-lg font-semibold tracking-tight text-text-heading">
        Forgot your password?
      </h1>
      <p className="mt-1 text-xs text-text-muted">
        Enter the email tied to your account and we'll send you a link to reset
        it.
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
          icon={Mail}
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <Button className="w-full min-h-11 text-xs font-semibold" type="submit">
          Send reset link
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-text-muted flex items-center justify-center gap-1">
        Remembered it after all?{" "}
        <Link
          className="font-semibold text-primary hover:underline min-h-11 inline-flex items-center"
          to={routes.auth.login}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
