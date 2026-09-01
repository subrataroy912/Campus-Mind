import apiClient from './apiClient.js'

export async function getProfile() {
  const response = await apiClient.get('/profile')
  return response.data
}

export async function updateProfile(payload) {
  const response = await apiClient.patch('/profile', payload)
  return response.data
}

export async function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  const response = await apiClient.post('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}

export async function getUserStats() {
  const response = await apiClient.get('/profile/stats')
  return response.data
}

export async function getUserActivity(params) {
  const response = await apiClient.get('/profile/activity', { params })
  return response.data
}

export async function getUserAchievements() {
  const response = await apiClient.get('/profile/achievements')
  return response.data
}