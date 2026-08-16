import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'
const ACCESS_TOKEN_KEY = 'campusMindAccessToken'
const REFRESH_TOKEN_KEY = 'campusMindRefreshToken'

function readStorageItem(key) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorageItem(key, value) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage can be unavailable in some mobile/private browser contexts.
  }
}

function removeStorageItem(key) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(key)
  } catch {
    // Storage can be unavailable in some mobile/private browser contexts.
  }
}

export function getStoredAccessToken() {
  return readStorageItem(ACCESS_TOKEN_KEY)
}

export function getStoredRefreshToken() {
  return readStorageItem(REFRESH_TOKEN_KEY)
}

export function storeAuthTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    writeStorageItem(ACCESS_TOKEN_KEY, accessToken)
  }

  if (refreshToken) {
    writeStorageItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearAuthTokens() {
  removeStorageItem(ACCESS_TOKEN_KEY)
  removeStorageItem(REFRESH_TOKEN_KEY)
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
