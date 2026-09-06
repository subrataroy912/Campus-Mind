import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, ArrowRight, XCircle } from "lucide-react";
import AuthInput from "../../pages/auth/components/AuthInput";
import { Button } from "../../components/ui/button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { mockUsers } from "../../mock/mockUsers.js";
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
        <div className="flex items-center justify-between gap-4 text-sm font-bold">
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
      <div className="flex items-center justify-center">
        <Button
          onClick={() => {
            setOpenDummyEmailCard(true);
          }}
        >
          Take Dummy email to login
        </Button>
      </div>

      {openDummyEmailCard && (
        <div className="absolute inset-0 z-50 flex flex-col bg-surface rounded-lg shadow-lg border border-border overflow-hidden">
          {/* Header Section */}
          <div className="relative flex items-center justify-center p-4 bg-primary">
            <h2 className="text-white font-bold text-lg">
              Use These Given Gmail IDs to Login
            </h2>

            {/* Close Button */}
            <button
              onClick={() => setOpenDummyEmailCard(false)}
              className="absolute right-3 text-white/80 hover:text-white transition-transform hover:scale-110 focus:outline-none"
              aria-label="Close"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Scrollable List Section */}
          <div className="flex-1 p-4 overflow-y-auto bg-canvas space-y-3">
            {mockUsers.map((item, index) => (
              <div
                key={index}
                className="flex flex-col p-3 rounded-md bg-surface border border-border shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-text-heading text-sm uppercase tracking-wide">
                    Email:
                  </span>
                  <span className="text-text-main">{item.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-heading text-sm uppercase tracking-wide">
                    Password:
                  </span>
                  {/* Using a mono font and canvas background makes passwords easier to read */}
                  <span className="text-text-muted font-mono bg-canvas px-1.5 py-0.5 rounded text-sm">
                    {item.password}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
