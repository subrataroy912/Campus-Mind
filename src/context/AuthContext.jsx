import { useCallback, useMemo, useState } from 'react'
import { clearAuthTokens, getStoredAccessToken } from '../services/api/apiClient.js'
import { loginUser, logoutUser } from '../services/api/authService.js'
import AuthContext from './authContext.js'


function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken())
  const [user, setUser] = useState(null)
  const isAuthenticated = Boolean(accessToken)

  const login = useCallback(async (credentials) => {
    const session = await loginUser(credentials)
    setAccessToken(session?.accessToken ?? getStoredAccessToken())
    setUser(session?.user ?? null)
    return session
  }, [])

  const logout = useCallback(async () => {
    await logoutUser()
    setAccessToken(null)
    setUser(null)
  }, [])

  const resetSession = useCallback(() => {
    clearAuthTokens()
    setAccessToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ accessToken, isAuthenticated, login, logout, resetSession, user }),
    [accessToken, isAuthenticated, login, logout, resetSession, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
