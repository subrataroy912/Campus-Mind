import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import AuthInput from '../../components/auth/AuthInput.jsx'
import BrandLogo from '../../components/common/BrandLogo.jsx'
import Button from '../../components/common/Button.jsx'
import Card from '../../components/common/Card.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false })
  const [errorMessage, setErrorMessage] = useState('') // Replaced boolean with string for dynamic messages
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility

  // 1. Redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const updateField = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // 2. Updated submit handler with fetch request to backend API
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'We could not sign you in. Check your email and password, then try again.')
      }

      // 3. Save token to local storage on success
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      
      // 4. Navigate to dashboard
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setErrorMessage(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Card className="mx-auto w-full max-w-xl p-8 shadow-2xl shadow-gray-200/80 sm:p-12">
        <div className="mb-8"><BrandLogo /></div>
        <h1 className="text-5xl font-black tracking-tight">Welcome Back!</h1>
        <p className="mt-4 text-xl text-gray-600">Login to continue to your account.</p>
        
        {/* Render precise backend or network errors */}
        {errorMessage && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 border border-red-100">
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
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            } 
            type={showPassword ? 'text' : 'password'} 
            value={formData.password} 
            disabled={isLoading}
          />
          <div className="flex items-center justify-between gap-4 text-sm font-bold">
            <label className="flex min-h-11 items-center gap-3 cursor-pointer select-none">
              <input 
                className="h-5 w-5 accent-purple-600 rounded cursor-pointer" 
                name="rememberMe" 
                onChange={updateField} 
                type="checkbox" 
                checked={formData.rememberMe}
                disabled={isLoading}
              />
              Remember me
            </label>
            <Link className="text-purple-700 hover:underline" to="/auth/forgot-password">Forgot Password?</Link>
          </div>

          <Button className="w-full text-lg flex items-center justify-center gap-2" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'} <ArrowRight size={24} />
          </Button>
        </form>
        
        <div className="my-7 flex items-center gap-4 text-gray-500">
          <span className="h-px flex-1 bg-gray-200" />
          or continue with
          <span className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Button variant="secondary" disabled={isLoading}>Google</Button>
          <Button variant="secondary" disabled={isLoading}>Microsoft</Button>
        </div>
        <p className="mt-8 text-center text-gray-600">
          Don&apos;t have an account? <Link className="font-bold text-purple-700 hover:underline" to="/auth/register">Sign up</Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginPage
