import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Lock, Mail, UserRound } from 'lucide-react'
import AuthInput from '../../components/auth/AuthInput.jsx'
import { Button } from '../../components/ui/button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const updateField = ({ target: { name, value } }) => setFormData((previous) => ({ ...previous, [name]: value }))
  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true); setError('')
    try { await register(formData); navigate('/auth/login', { replace: true, state: { registered: true } }) }
    catch (submissionError) { setError(submissionError.message) }
    finally { setLoading(false) }
  }
  return <div>
    <h1 className="text-3xl font-bold tracking-tight text-text-heading">Create your account</h1>
    <p className="mt-2 text-text-main">Start with a simple local account. You can set up your profile later.</p>
    {error && <p className="mt-5 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-medium" role="alert">{error}</p>}
    <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
      <AuthInput icon={UserRound} label="Your name" name="name" value={formData.name} onChange={updateField} placeholder="Alex Morgan" required disabled={loading} autoComplete="name" />
      <AuthInput icon={Mail} label="Email" name="email" type="email" value={formData.email} onChange={updateField} placeholder="you@example.com" required disabled={loading} autoComplete="email" />
      <AuthInput icon={Lock} label="Password" name="password" type="password" value={formData.password} onChange={updateField} placeholder="Choose a password" required minLength="8" disabled={loading} autoComplete="new-password" />
      <Button className="w-full" type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</Button>
    </form>
    <p className="mt-7 text-center text-text-main">Already have an account? <Link to="/auth/login" className="font-bold text-primary hover:underline">Sign in</Link></p>
  </div>
}
