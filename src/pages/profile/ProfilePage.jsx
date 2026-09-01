import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../../services/api/authService'
import ProfileHero from './components/ProfileHero'
import ProfileInformation from './components/ProfileInformation'
import AcademicOverview from './components/AcademicOverview'
import RecentActivity from './components/RecentActivity'
import Achievements from './components/Achievements'
import AccountSettings from './components/AccountSettings'
import LogoutAction from './components/LogoutAction'
import EditProfileModal from './components/EditProfileModal'

function getMockUser() {
  return {
    name: 'Nabojeet Biswas',
    username: 'nabojeet',
    email: 'nabojeet@example.com',
    department: 'Computer Engineering',
    institution: 'CampusMind University',
    bio: 'Passionate computer engineering student exploring the intersection of technology and education.',
    phone: '+1 (555) 123-4567',
    joinedAt: '2024-09-01',
    avatar: null,
  }
}

function getMockStats() {
  return {
    practiceSessions: 42,
    assignmentsCompleted: 18,
    learningStreak: 12,
    averageScore: 87,
    completedTasks: 156,
    achievementsUnlocked: 8,
  }
}

function getMockActivities() {
  return [
    { id: '1', type: 'practice', title: 'Completed Mathematics Practice', description: 'Calculus - Derivatives and Integrals', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), metadata: { score: 95 } },
    { id: '2', type: 'assignment', title: 'Submitted Database Assignment', description: 'SQL Queries and Normalization', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), metadata: { className: 'CS301 - Database Systems' } },
    { id: '3', type: 'class', title: 'Joined Computer Engineering Class', description: 'CS301 - Database Systems', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '4', type: 'achievement', title: 'Unlocked "Practice Master"', description: 'Completed 50 practice sessions', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), metadata: { tier: 'gold' } },
    { id: '5', type: 'practice', title: 'Completed Physics Practice', description: 'Mechanics - Newton Laws', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), metadata: { score: 88 } },
  ]
}

function getMockAchievements() {
  return [
    { id: '1', name: 'Practice Master', description: 'Complete 50 practice sessions', icon: 'trophy', tier: 'gold', unlockedAt: '2024-10-15', progress: 50, maxProgress: 50 },
    { id: '2', name: '7 Day Streak', description: 'Practice for 7 consecutive days', icon: 'zap', tier: 'silver', unlockedAt: '2024-10-10', progress: 7, maxProgress: 7 },
    { id: '3', name: 'Assignment Finisher', description: 'Complete 10 assignments', icon: 'target', tier: 'bronze', unlockedAt: '2024-09-28', progress: 10, maxProgress: 10 },
    { id: '4', name: 'Perfect Score', description: 'Get 100% on any practice', icon: 'star', tier: 'gold', unlockedAt: '2024-10-20', progress: 1, maxProgress: 1 },
    { id: '5', name: 'Early Bird', description: 'Complete a practice before 8 AM', icon: 'medal', tier: 'silver', unlockedAt: null, progress: 3, maxProgress: 5 },
    { id: '6', name: 'Night Owl', description: 'Complete a practice after 10 PM', icon: 'crown', tier: 'bronze', unlockedAt: null, progress: 1, maxProgress: 3 },
  ]
}

function ProfilePage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [activities, setActivities] = useState([])
  const [achievements, setAchievements] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {
    // Load mock data immediately - no API calls that can fail
    setUser(getMockUser())
    setStats(getMockStats())
    setActivities(getMockActivities())
    setAchievements(getMockAchievements())
    setIsLoading(false)
  }, [])

  const handleEditClick = () => {
    setEditModalOpen(true)
  }

  const handleAvatarClick = () => {
    setEditModalOpen(true)
  }

  const handleSaveProfile = async (payload) => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setUser(prev => ({ ...prev, ...payload }))
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logoutUser()
      localStorage.removeItem('token')
      navigate('/auth/login', { replace: true })
    } catch (error) {
      console.error('Logout failed:', error)
      localStorage.removeItem('token')
      navigate('/auth/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleNavigate = (href) => {
    navigate(href)
  }

  const handleViewAllActivity = () => {
    navigate('/dashboard/activity')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50" aria-busy="true">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="text-center py-12">
              <div className="w-32 h-32 rounded-[2rem] bg-neutral-200 animate-pulse border-2 border-white shadow-lg shadow-black/10 mx-auto mb-6" />
              <div className="h-10 w-48 bg-neutral-200 animate-pulse rounded-lg mx-auto mb-3" />
              <div className="h-6 w-32 bg-neutral-200 animate-pulse rounded mx-auto mb-3" />
              <div className="h-5 w-40 bg-neutral-200 animate-pulse rounded mx-auto mb-6" />
              <div className="h-11 w-36 bg-neutral-200 animate-pulse rounded-lg mx-auto" />
            </div>
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-lg mx-auto max-w-4xl mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto max-w-4xl mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-36 bg-neutral-200 animate-pulse rounded-2xl border border-neutral-200" />
              ))}
            </div>
            <div className="h-24 bg-neutral-200 animate-pulse rounded-2xl border border-neutral-200 mx-auto max-w-4xl mb-8 pl-8" />
            <div className="h-40 bg-neutral-200 animate-pulse rounded-2xl border border-neutral-200 mx-auto max-w-4xl mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-4xl mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-neutral-200 animate-pulse rounded-2xl border border-neutral-200" />
              ))}
            </div>
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-lg mx-auto max-w-4xl mb-6" />
            <div className="space-y-3 mx-auto max-w-4xl">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-neutral-200 animate-pulse rounded-xl border border-neutral-200" />
              ))}
            </div>
            <div className="h-32 bg-neutral-200 animate-pulse rounded-2xl border border-neutral-200 mx-auto max-w-4xl" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="min-h-screen bg-neutral-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
        isLoading={isSaving}
      />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ProfileHero
            user={user}
            onEditClick={handleEditClick}
            onAvatarClick={handleAvatarClick}
            isLoading={false}
          />

          <ProfileInformation user={user} isLoading={false} />

          <AcademicOverview stats={stats} isLoading={false} />

          <RecentActivity
            activities={activities}
            isLoading={false}
            onViewAll={handleViewAllActivity}
          />

          {achievements && achievements.length > 0 && (
            <Achievements achievements={achievements} isLoading={false} />
          )}

          <AccountSettings onNavigate={handleNavigate} />

          <LogoutAction onLogout={handleLogout} isLoading={isLoggingOut} />
        </motion.div>
      </main>
    </motion.div>
  )
}

export default ProfilePage