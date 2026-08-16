import apiClient from './apiClient.js'

export async function getNotifications(params) {
  const response = await apiClient.get('/notifications', { params })
  return response.data
}
