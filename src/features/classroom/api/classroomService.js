import { mockClassrooms } from '../../../mock/mockClassrooms'
const STORAGE_KEY = 'campus-mind.classrooms'
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), 300))
const read = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || mockClassrooms
const write = (classrooms) => localStorage.setItem(STORAGE_KEY, JSON.stringify(classrooms))
export const fetchClassrooms = async () => delay([...read()])
export const findClassroomById = async (id) => delay(read().find((item) => item.id === id) || null)
export const findClassroomByCode = async (code) => delay(read().find((item) => item.code === code) || null)
export const createClassroom = async (details) => { const classroom = { ...details, id: `class-${Date.now()}`, title: details.className, subtitle: details.section || 'New section', code: `${details.className.slice(0, 4).toUpperCase().padEnd(4, 'X')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, instructor: { name: 'You', avatar: null, initials: 'YO' }, role: 'Created', memberCount: 1, onlineCount: 1, unreadCount: 0, deadline: null }; const classrooms = [...read(), classroom]; write(classrooms); return delay(classroom) }
export const joinClassroom = async (code) => delay(read().find((item) => item.code === code) || null)
