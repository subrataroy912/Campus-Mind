import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await register(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', password: '' });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-canvas px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-surface p-8 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-text-heading">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-main">
            Or{' '}
            <a href="/auth/login" className="font-medium text-primary hover:text-primary">
              sign in to your existing account
            </a>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Status Messages */}
          {error && (
            <div className="rounded-md bg-canvas p-3 text-sm text-secondary-hover border border-border">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md bg-canvas p-3 text-sm text-success border border-border">
              Registration successful! You can now log in.
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-main">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-focus sm:text-sm"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-focus sm:text-sm"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-main">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-text-heading placeholder:text-muted focus:border-primary focus:outline-none focus:ring-focus sm:text-sm"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-surface hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 disabled:bg-primary disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
