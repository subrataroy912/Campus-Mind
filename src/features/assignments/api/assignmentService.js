import { mockAssignments } from '../../../mock/mockAssignments'
export const fetchAssignments = async () => new Promise((resolve) => setTimeout(() => resolve([...mockAssignments]), 300))
