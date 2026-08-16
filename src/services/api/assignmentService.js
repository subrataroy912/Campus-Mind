import apiClient from './apiClient.js'

export async function getClassAssignments(classId) {
  const response = await apiClient.get(`/classes/${classId}/assignments`)
  return response.data
}

export async function getAssignment(assignmentId) {
  const response = await apiClient.get(`/assignments/${assignmentId}`)
  return response.data
}

export async function getClassMaterials(classId) {
  const response = await apiClient.get(`/classes/${classId}/materials`)
  return response.data
}
