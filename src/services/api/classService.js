import apiClient from './apiClient.js'

export async function getClasses() {
  const response = await apiClient.get('/classes')
  return response.data
}

export async function createClass(payload) {
  const response = await apiClient.post('/classes', payload)
  return response.data
}

export async function joinClass(payload) {
  const response = await apiClient.post('/classes/join', payload)
  return response.data
}

export async function getClassMembers(classId) {
  const response = await apiClient.get(`/classes/${classId}/members`)
  return response.data
}

export async function getClassAnnouncements(classId) {
  const response = await apiClient.get(`/classes/${classId}/announcements`)
  return response.data
}
