import { motion } from 'framer-motion'
import { BookOpen, ClipboardCheck, Users, Award, Clock, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'

const ACTIVITY_ICONS = {
  practice: BookOpen,
  assignment: ClipboardCheck,
  class: Users,
  achievement: Award,
  default: Clock,
}

const ACTIVITY_COLORS = {
  practice: 'text-blue-600 bg-blue-50',
  assignment: 'text-green-600 bg-green-50',
  class: 'text-purple-600 bg-purple-50',
  achievement: 'text-amber-600 bg-amber-50',
  default: 'text-neutral-600 bg-neutral-100',
}

function formatRelativeTime(dateString) {
  if (!dateString) return 'Unknown time'
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return 'Unknown time'
  }
}

function ActivityItem({ activity, index }) {
  const { type, title, description, timestamp, metadata } = activity
  const Icon = ACTIVITY_ICONS[type] || ACTIVITY_ICONS.default
  const colorClass = ACTIVITY_COLORS[type] || ACTIVITY_COLORS.default

  return (
    <motion.li
      className="relative pl-8 pb-8 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="absolute left-0 top-1">
        <div className={clsx('w-3 h-3 rounded-full border-2 border-white', colorClass.split(' ')[1].replace('bg-', 'bg-'))} />
        {index !== 0 && (
          <div className="absolute left-1.5 top-4 bottom-0 w-0.5 bg-neutral-100" aria-hidden="true" />
        )}
      </div>

      <article className="bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 transition-colors duration-200">
        <div className="flex items-start gap-4">
          <div className={clsx('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center', colorClass)}>
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-lg font-medium text-neutral-950">{title}</h3>
              <time
                className="font-sans text-xs text-neutral-500 whitespace-nowrap"
                dateTime={timestamp}
              >
                {formatRelativeTime(timestamp)}
              </time>
            </div>

            {description && (
              <p className="mt-1.5 font-sans text-sm text-neutral-600 leading-relaxed">
                {description}
              </p>
            )}

            {metadata && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {metadata.className && (
                  <span className="font-sans text-xs px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-full">
                    {metadata.className}
                  </span>
                )}
                {metadata.score !== undefined && (
                  <span className="font-sans text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                    Score: {metadata.score}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    </motion.li>
  )
}

function RecentActivity({ activities, isLoading = false, onViewAll }) {
  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8" aria-busy="true">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-lg" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 animate-pulse rounded-2xl border border-neutral-200 pl-8" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="activity-heading">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h2
              id="activity-heading"
              className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 tracking-tight"
            >
              Recent Activity
            </h2>
          </motion.div>

          <motion.div
            className="text-center py-12 border border-neutral-200 rounded-2xl bg-neutral-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-neutral-500 font-sans mb-2">No recent activity</p>
            <p className="text-sm text-neutral-400 font-sans">Your activity will appear here as you use CampusMind</p>
          </motion.div>
        </div>
      </section>
    )
  }

  const displayActivities = activities.slice(0, 5)

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="activity-heading">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            id="activity-heading"
            className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 tracking-tight"
          >
            Recent Activity
          </h2>
          {onViewAll && activities.length > 5 && (
            <button
              onClick={onViewAll}
              className="font-sans text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-1"
            >
              View all
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </motion.div>

        <motion.ul
          className="space-y-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {displayActivities.map((activity, index) => (
            <ActivityItem key={activity.id || index} activity={activity} index={index} />
          ))}
        </motion.ul>

        {activities.length > 5 && (
          <motion.div
            className="text-center mt-6 pt-4 border-t border-neutral-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <p className="font-sans text-sm text-neutral-500">
              Showing 5 of {activities.length} activities
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function ChevronRight({ className, ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default RecentActivity