import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, Lock, Mail, ArrowRight } from 'lucide-react'
import AuthInput from '../../components/auth/AuthInput.jsx'
import AuthLayout from '../../components/auth/AuthLayout.jsx'
import BrandLogo from '../../components/common/BrandLogo.jsx'
import Button from '../../components/common/Button.jsx'
import Card from '../../components/common/Card.jsx'
import useAuth from '../../hooks/useAuth.js'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: true })
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updateField = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setHasError(false)
    try {
      await login({ email: formData.email, password: formData.password })
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch {
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="mx-auto w-full max-w-xl p-8 shadow-2xl shadow-gray-200/80 sm:p-12">
        <div className="mb-8"><BrandLogo /></div>
        <h1 className="text-5xl font-black tracking-tight">Welcome Back!</h1>
        <p className="mt-4 text-xl text-gray-600">Login to continue to your account.</p>
        {hasError && <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">We could not sign you in. Check your email and password, then try again.</p>}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <AuthInput icon={Mail} label="Email" name="email" onChange={updateField} placeholder="you@example.com" required type="email" value={formData.email} />
          <AuthInput icon={Lock} label="Password" name="password" onChange={updateField} placeholder="Enter your password" required rightIcon={<Eye aria-hidden="true" size={22} />} type="password" value={formData.password} />
          <div className="flex items-center justify-between gap-4 text-sm font-bold">
            <label className="flex min-h-11 items-center gap-3"><input checked={formData.rememberMe} className="h-5 w-5 accent-purple-600" name="rememberMe" onChange={updateField} type="checkbox" />Remember me</label>
            <Link className="text-purple-700" to="/forgot-password">Forgot Password?</Link>
          </div>
          <Button className="w-full text-lg" disabled={isLoading} type="submit">{isLoading ? 'Logging in...' : 'Login'} <ArrowRight size={24} /></Button>
        </form>
        <div className="my-7 flex items-center gap-4 text-gray-500"><span className="h-px flex-1 bg-gray-200" />or continue with<span className="h-px flex-1 bg-gray-200" /></div>
        <div className="grid gap-4 sm:grid-cols-2"><Button variant="secondary">Google</Button><Button variant="secondary">Microsoft</Button></div>
        <p className="mt-8 text-center text-gray-600">Don&apos;t have an account? <Link className="font-bold text-purple-700" to="/register">Sign up</Link></p>
      </Card>
    </AuthLayout>
  )
}

export default LoginPage
