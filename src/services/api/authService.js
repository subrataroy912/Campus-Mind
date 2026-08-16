import apiClient, { clearAuthTokens, getStoredRefreshToken, storeAuthTokens } from './apiClient.js'

export async function registerUser(payload) {
  const response = await apiClient.post('/auth/register', payload)
  return response.data
}

export async function loginUser(credentials) {
  const response = await apiClient.post('/auth/login', credentials)
  storeAuthTokens(response.data ?? {})
  return response.data
}

export async function refreshSession() {
  const response = await apiClient.post('/auth/refresh', { refreshToken: getStoredRefreshToken() })
  storeAuthTokens(response.data ?? {})
  return response.data
}

export async function logoutUser() {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    clearAuthTokens()
  }
}

export async function requestPasswordReset(payload) {
  const response = await apiClient.post('/auth/forgot-password', payload)
  return response.data
}

export async function resetPassword(payload) {
  const response = await apiClient.post('/auth/reset-password', payload)
  return response.data
}
