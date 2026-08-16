import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const ACCESS_TOKEN_KEY = 'campusMindAccessToken'
const REFRESH_TOKEN_KEY = 'campusMindRefreshToken'

export function getStoredAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getStoredRefreshToken() {
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function storeAuthTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  }

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearAuthTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getStoredAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthTokens()
    }

    return Promise.reject(error)
  },
)

export default apiClient
