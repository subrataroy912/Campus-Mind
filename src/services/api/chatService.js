import apiClient from './apiClient.js'

export async function getConversations() {
  const response = await apiClient.get('/conversations')
  return response.data
}

export async function getMessages(params) {
  const response = await apiClient.get('/messages', { params })
  return response.data
}

export async function createMessage(payload) {
  const response = await apiClient.post('/messages', payload)
  return response.data
}
