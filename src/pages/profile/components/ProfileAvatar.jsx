import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import clsx from 'clsx'

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function ProfileAvatar({
  src,
  name,
  size = 120,
  onEditClick,
  isEditing = false,
  className,
}) {
  const initials = getInitials(name)
  const hasImage = src && src !== '/avatar.png'

  return (
    <motion.div
      className={clsx('relative inline-flex shrink-0', className)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative">
        {hasImage ? (
          <img
            src={src}
            alt={`${name}'s profile`}
            className={clsx(
              'rounded-[2rem] object-cover border-2 border-surface shadow-lg',
              'shadow-text-heading/10',
              `w-${size / 4} h-${size / 4}`
            )}
          />
        ) : (
          <div
            className={clsx(
              'rounded-[2rem] flex items-center justify-center border-2 border-surface shadow-lg',
              'shadow-text-heading/10 bg-border text-text-main',
              'font-serif text-2xl font-medium select-none',
              `w-${size / 4} h-${size / 4}`
            )}
            aria-label={name ? `${name}'s profile` : 'User profile'}
          >
            {initials}
          </div>
        )}

        {onEditClick && (
          <motion.button
            onClick={onEditClick}
            disabled={isEditing}
            className={clsx(
              'absolute bottom-0 right-0 rounded-full bg-surface border-2 border-border',
              'p-1.5 text-text-main transition-all duration-200',
              'hover:bg-canvas hover:border-border hover:text-text-heading',
              'focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              size >= 120 ? 'w-10 h-10' : 'w-8 h-8'
            )}
            aria-label="Change profile picture"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        )}
      </div>

      <motion.div
        className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-success border-3 border-surface"
        aria-hidden="true"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
      />
    </motion.div>
  )
}

export default ProfileAvatar