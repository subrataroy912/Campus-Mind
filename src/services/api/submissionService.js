import apiClient from './apiClient.js'

export async function submitAssignment(payload) {
  const response = await apiClient.post('/submissions', payload)
  return response.data
}

export async function getGrades(params) {
  const response = await apiClient.get('/grades', { params })
  return response.data
}
