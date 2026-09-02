import { motion } from 'framer-motion'
import { MapPin, Calendar, Briefcase, GraduationCap } from 'lucide-react'
import ProfileAvatar from './ProfileAvatar'
import Button from '../../../components/common/Button'
import clsx from 'clsx'
const _motion = motion

function ProfileHero({
  user,
  onEditClick,
  onAvatarClick,
  isLoading = false,
}) {
  const { name, username, email, bio, department, institution, joinedAt, avatar } = user || {}

  const formatJoinDate = (dateString) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return null
    }
  }

  const joinDate = formatJoinDate(joinedAt)

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-[2rem] bg-border animate-pulse border-2 border-surface shadow-lg shadow-text-heading/10" />
        </div>
        <div className="h-10 w-48 bg-border animate-pulse rounded-lg mx-auto" />
        <div className="h-6 w-32 bg-border animate-pulse rounded mx-auto" />
        <div className="h-5 w-40 bg-border animate-pulse rounded mx-auto" />
        <div className="h-5 w-48 bg-border animate-pulse rounded mx-auto" />
        <div className="h-11 w-36 bg-border animate-pulse rounded-lg mx-auto mt-4" />
      </div>
    )
  }

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="profile-heading">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ProfileAvatar
            src={avatar}
            name={name}
            size={140}
            onEditClick={onAvatarClick}
            className="mx-auto"
          />

          <div className="space-y-2">
            <motion.h1
              id="profile-heading"
              className={clsx(
                'font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight',
                'text-text-heading'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {name || 'Unnamed User'}
            </motion.h1>

            {username && (
              <motion.p
                className={clsx(
                  'text-lg sm:text-xl font-medium text-text-muted',
                  'font-sans'
                )}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                @{username}
              </motion.p>
            )}

            {email && !username && (
              <motion.p
                className={clsx(
                  'text-lg sm:text-xl font-medium text-text-muted',
                  'font-sans'
                )}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {email}
              </motion.p>
            )}
          </div>

          {(department || institution) && (
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-text-main font-sans"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {department && (
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-text-muted" aria-hidden="true" />
                  <span className="font-medium">{department}</span>
                </div>
              )}
              {institution && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-text-muted" aria-hidden="true" />
                  <span className="font-medium">{institution}</span>
                </div>
              )}
              {joinDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-text-muted" aria-hidden="true" />
                  <span className="font-medium">Joined {joinDate}</span>
                </div>
              )}
            </motion.div>
          )}

          {bio && (
            <motion.p
              className={clsx(
                'max-w-2xl mx-auto text-base sm:text-lg text-text-main leading-relaxed',
                'font-sans'
              )}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {bio}
            </motion.p>
          )}

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Button
              onClick={onEditClick}
              variant="primary"
              className={clsx(
                'w-full sm:w-auto min-h-12 px-8',
                'font-sans text-sm font-semibold rounded-xl',
                'bg-text-heading text-surface',
                'hover:bg-text-heading',
                'focus:ring-2 focus:ring-focus focus:ring-offset-2',
                'transition-colors duration-200'
              )}
            >
              Edit Profile
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProfileHero