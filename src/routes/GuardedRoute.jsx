import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth.js'

function GuardedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate replace to="/dashboard" />
  }

  return children
}

export default GuardedRoute
