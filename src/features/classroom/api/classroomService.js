import { mockClassrooms } from '../../../mock/mockClassrooms'
import { exploreClassrooms } from '../../../mock/exploreClassrooms'

const STORAGE_KEY = 'campus-mind.classrooms'
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 300))
const read = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || mockClassrooms
const write = (classrooms) => localStorage.setItem(STORAGE_KEY, JSON.stringify(classrooms))
const findAvailableClassroom = (code) => [...read(), ...exploreClassrooms].find((item) => item.code === code) || null

export const fetchClassrooms = async () => delay([...read()])
export const fetchExploreClassrooms = async () => delay([...exploreClassrooms])
export const findClassroomById = async (id) => delay(read().find((item) => item.id === id) || null)
export const findClassroomByCode = async (code) => delay(findAvailableClassroom(code))
export const createClassroom = async (details) => {
  const classroom = { ...details, id: `class-${Date.now()}`, title: details.className, subtitle: details.section || 'New section', code: `${details.className.slice(0, 4).toUpperCase().padEnd(4, 'X')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, instructor: { name: 'You', avatar: null, initials: 'YO' }, role: 'Created', memberCount: 1, onlineCount: 1, unreadCount: 0, deadline: null }
  write([...read(), classroom])
  return delay(classroom)
}
export const joinClassroom = async (code) => {
  const classrooms = read()
  const existing = classrooms.find((item) => item.code === code)
  if (existing) return delay(existing)
  const classroom = exploreClassrooms.find((item) => item.code === code)
  if (!classroom) return delay(null)
  const joinedClassroom = { ...classroom, role: 'Joined', unreadCount: 0, deadline: null }
  write([...classrooms, joinedClassroom])
  return delay(joinedClassroom)
}
