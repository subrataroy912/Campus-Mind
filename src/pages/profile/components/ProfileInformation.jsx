import { motion } from 'framer-motion'
import { Mail, MapPin, GraduationCap, Briefcase, Calendar, Phone, User } from 'lucide-react'
import clsx from 'clsx'

const INFO_FIELDS = [
  { key: 'name', label: 'Full Name', icon: User, required: true },
  { key: 'email', label: 'Email', icon: Mail, required: true },
  { key: 'username', label: 'Username', icon: User },
  { key: 'department', label: 'Department', icon: GraduationCap },
  { key: 'institution', label: 'Institution', icon: Briefcase },
  { key: 'phone', label: 'Phone', icon: Phone },
  { key: 'joinedAt', label: 'Joined', icon: Calendar, format: 'date' },
]

function formatDate(dateString) {
  if (!dateString) return null
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return null
  }
}

function InfoRow({ label, value, Icon, isLast = false }) {
  if (!value && value !== 0) {
    return null
  }

  return (
    <motion.div
      className={clsx(
        'grid grid-cols-[auto_1fr] gap-x-6 gap-y-4 items-start',
        'border-t border-border pt-4',
        'first:border-0 first:pt-0',
        isLast ? 'pb-0' : 'pb-4'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <dt className={clsx(
        'text-sm font-medium text-text-muted font-sans',
        'w-32 shrink-0 pt-0.5'
      )}>
        <span className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-border" aria-hidden="true" />
          {label}
        </span>
      </dt>
      <dd className={clsx(
        'text-base font-normal text-text-heading font-sans',
        'leading-relaxed break-words'
      )}>
        {value}
      </dd>
    </motion.div>
  )
}

function ProfileInformation({ user, isLoading = false }) {
  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8" aria-busy="true">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 bg-border animate-pulse rounded-lg mb-6" />
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-border animate-pulse rounded-lg border-t border-border" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!user) {
    return null
  }

  const fields = INFO_FIELDS.map((field) => {
    let value = user[field.key]
    if (field.format === 'date') {
      value = formatDate(value)
    }
    return { ...field, value }
  }).filter((f) => f.value)

  if (fields.length === 0) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="info-heading">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="text-center py-12 border border-border rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-text-muted font-sans">No profile information available.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="info-heading">
      <div className="mx-auto max-w-4xl">
        <motion.h2
          id="info-heading"
          className="font-serif text-2xl sm:text-3xl font-medium text-text-heading mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Personal Information
        </motion.h2>

        <motion.dl
          className="bg-surface border border-border rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {fields.map((field, index) => (
            <InfoRow
              key={field.key}
              label={field.label}
              value={field.value}
              Icon={field.icon}
              isLast={index === fields.length - 1}
            />
          ))}
        </motion.dl>
      </div>
    </section>
  )
}

export default ProfileInformation