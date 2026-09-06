import { useState } from 'react'
import { Link } from 'react-router'
import { Mail, ArrowLeft, MailCheck } from 'lucide-react'
import AuthInput from '../components/AuthInput.jsx'
import { Button } from '@/components/ui/button.jsx'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Enter your email to continue.')
      return
    }
    setIsLoading(true)
    try {
      // Mock request — in a real app this hits an auth API endpoint.
      await new Promise((resolve) => setTimeout(resolve, 600))
      setSent(true)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success">
          <MailCheck size={28} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-text-heading">
          Check your inbox
        </h1>
        <p className="mt-2 text-text-main">
          If an account exists for <span className="font-semibold text-text-heading">{email}</span>, a reset link is on its way.
        </p>
        <p className="mt-6 text-sm text-text-muted">
          Didn't get anything? Check your spam folder, or{' '}
          <button
            type="button"
            onClick={() => setSent(false)}
            className="font-bold text-primary hover:underline"
          >
            try a different email
          </button>
          .
        </p>
        <Link
          to="/auth/login"
          className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link
        to="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-text-main"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to sign in
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-heading">
        Forgot your password?
      </h1>
      <p className="mt-2 text-text-main">
        Enter the email tied to your account and we'll send you a link to reset it.
      </p>

      {error && (
        <p
          className="mt-5 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-medium text-text-main"
          role="alert"
        >
          {error}
        </p>
      )}

      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <AuthInput
          icon={Mail}
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          disabled={isLoading}
          autoComplete="email"
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Sending link…' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-7 text-center text-text-main">
        Remembered it after all?{' '}
        <Link className="font-bold text-primary hover:underline" to="/auth/login">
          Sign in
        </Link>
      </p>
    </div>
  )
}
