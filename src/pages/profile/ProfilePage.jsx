import { useEffect, useMemo, useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchClassrooms } from '../../features/classroom/api/classroomService.js'
import Button from '../../components/common/Button.jsx'
import Card from '../../components/common/Card.jsx'
import ClassCard from '../../components/dashboard/ClassCard.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import EditProfileForm from './components/EditProfileForm.jsx'
import ProfileDetails from './components/ProfileDetails.jsx'
import ProfileHeader from './components/ProfileHeader.jsx'
import ProfileSection from './components/ProfileSection.jsx'

const DEFAULT_STUDENT_PROFILE = {
  headline: 'Learning with the CampusMind community.',
  bio: 'I enjoy sharing notes, asking thoughtful questions, and making steady progress with my classmates.',
  program: 'Campus learner',
}

const DEFAULT_TEACHER_PROFILE = {
  headline: 'Creating a welcoming space for learning together.',
  bio: 'I use CampusMind to share resources, support questions, and help every learner feel included.',
  program: 'Campus educator',
}

function getProfile(user) {
  const defaults = user?.role === 'teacher' ? DEFAULT_TEACHER_PROFILE : DEFAULT_STUDENT_PROFILE
  return { name: user?.name || 'CampusMind member', role: user?.role || 'student', avatar: user?.avatar, ...defaults, ...user }
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [classrooms, setClassrooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const profile = useMemo(() => getProfile(user), [user])

  useEffect(() => {
    let isCurrent = true
    fetchClassrooms()
      .then((items) => { if (isCurrent) setClassrooms(items) })
      .catch(() => { if (isCurrent) setLoadError(true) })
      .finally(() => { if (isCurrent) setIsLoading(false) })
    return () => { isCurrent = false }
  }, [])

  const unreadClassCount = classrooms.filter((classroom) => (classroom.unreadCount ?? classroom.unreadMessages ?? 0) > 0).length
  const memberSince = user?.created_at ? new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(user.created_at)) : 'recently'
  const details = [
    { label: profile.role === 'teacher' ? 'Teaching area' : 'Program', value: profile.program, icon: 'program' },
    { label: 'Community focus', value: profile.headline, icon: 'focus' },
    { label: 'Member since', value: memberSince, icon: 'member' },
  ]

  const saveProfile = (nextProfile) => {
    updateProfile({ name: nextProfile.name.trim(), headline: nextProfile.headline.trim(), bio: nextProfile.bio.trim(), program: nextProfile.program.trim() })
    setIsEditing(false)
  }

  return <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
    <div className="space-y-6">
      <ProfileHeader profile={profile} onEdit={() => setIsEditing(true)} />
      {isEditing && <EditProfileForm profile={profile} onCancel={() => setIsEditing(false)} onSave={saveProfile} />}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <Card className="p-5 sm:p-7">
          <ProfileSection title="About" description="A few details that help the learning community get to know you.">
            <ProfileDetails details={details} />
          </ProfileSection>
          <ProfileSection title="Learning spaces" description="Classes where you can learn, share resources, and stay connected.">
            {isLoading && <p className="text-sm text-text-muted" role="status">Loading your classes…</p>}
            {loadError && <EmptyState title="Classes could not load" description="Please refresh the page and try again." />}
            {!isLoading && !loadError && classrooms.length === 0 && <EmptyState title="No classes yet" description="Join a class or create one to start learning with your community." action={{ to: '/dashboard/class/join', label: 'Join a class' }} />}
            {!isLoading && !loadError && classrooms.length > 0 && <div className="grid gap-4 md:grid-cols-2">{classrooms.map((classroom) => <ClassCard key={classroom.id} classroom={classroom} />)}</div>}
          </ProfileSection>
        </Card>

        <aside className="space-y-4" aria-label="Profile community summary">
          <Card className="p-5">
            <p className="text-sm font-semibold text-text-heading">Community at a glance</p>
            <dl className="mt-4 divide-y divide-border">
              <div className="flex items-center justify-between py-3 first:pt-0"><dt className="text-sm text-text-muted">Active classes</dt><dd className="text-lg font-bold text-text-heading">{isLoading ? '—' : classrooms.length}</dd></div>
              <div className="flex items-center justify-between py-3 last:pb-0"><dt className="text-sm text-text-muted">Classes with updates</dt><dd className="text-lg font-bold text-text-heading">{isLoading ? '—' : unreadClassCount}</dd></div>
            </dl>
          </Card>
          <Card className="p-5"><Users className="text-primary" size={20} aria-hidden="true" /><h2 className="mt-3 font-bold text-text-heading">Learn together</h2><p className="mt-1 text-sm leading-6 text-text-muted">Your profile helps classmates and teachers recognize the person behind each contribution.</p><Button to="/dashboard/class/join" variant="outline" className="mt-4 w-full"><Plus size={16} aria-hidden="true" />Join a class</Button></Card>
        </aside>
      </div>
    </div>
  </div>
}
