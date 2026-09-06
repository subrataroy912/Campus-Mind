import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { Lock, Eye, EyeOff, ShieldCheck, Check, X } from 'lucide-react'
import AuthInput from '../components/AuthInput.jsx'
import { Button } from '@/components/ui/button.jsx'

const RULES = [
  { id: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { id: 'number', label: 'Contains a number', test: (value) => /\d/.test(value) },
]

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const updateField = ({ target: { name, value } }) =>
    setFormData((previous) => ({ ...previous, [name]: value }))

  const failedRule = RULES.find((rule) => !rule.test(formData.password))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (failedRule) {
      setError('Choose a password that meets every requirement below.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Those passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      // Mock request — a real app would exchange the token for a new password here.
      await new Promise((resolve) => setTimeout(resolve, 600))
      navigate('/auth/login', { replace: true, state: { passwordReset: true } })
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck size={28} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-text-heading">
          This link isn't valid
        </h1>
        <p className="mt-2 text-text-main">
          It may have expired, or already been used. Request a fresh link to continue.
        </p>
        <Link to="/auth/forgot-password">
          <Button className="mt-7 w-full">Request a new link</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-text-heading">
        Set a new password
      </h1>
      <p className="mt-2 text-text-main">
        Choose something you haven't used before on CampusMind.
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
          icon={Lock}
          label="New password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={updateField}
          placeholder="Enter a new password"
          required
          disabled={isLoading}
          autoComplete="new-password"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="text-text-muted hover:text-text-main focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          }
        />
        <AuthInput
          icon={Lock}
          label="Confirm password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={updateField}
          placeholder="Re-enter the password"
          required
          disabled={isLoading}
          autoComplete="new-password"
        />

        <ul className="space-y-1.5 rounded-xl border border-border bg-canvas px-4 py-3">
          {RULES.map((rule) => {
            const met = rule.test(formData.password)
            return (
              <li key={rule.id} className="flex items-center gap-2 text-sm">
                {met ? (
                  <Check size={16} className="text-success" aria-hidden="true" />
                ) : (
                  <X size={16} className="text-text-muted" aria-hidden="true" />
                )}
                <span className={met ? 'text-text-main' : 'text-text-muted'}>{rule.label}</span>
              </li>
            )
          })}
        </ul>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? 'Updating password…' : 'Update password'}
        </Button>
      </form>

      <p className="mt-7 text-center text-text-main">
        <Link className="font-bold text-primary hover:underline" to="/auth/login">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
