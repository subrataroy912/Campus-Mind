import { motion } from 'framer-motion'
import { BookOpen, ClipboardCheck, Flame, Award, TrendingUp, Target } from 'lucide-react'
import clsx from 'clsx'
// eslint-disable-next-line no-unused-vars
const _motion = motion

const STAT_CONFIG = [
  { key: 'practiceSessions', label: 'Practice Sessions', icon: BookOpen, color: 'text-blue-600' },
  { key: 'assignmentsCompleted', label: 'Assignments', icon: ClipboardCheck, color: 'text-green-600' },
  { key: 'learningStreak', label: 'Learning Streak', icon: Flame, color: 'text-orange-500' },
  { key: 'averageScore', label: 'Avg Score', icon: TrendingUp, color: 'text-purple-600', suffix: '%' },
  { key: 'completedTasks', label: 'Completed Tasks', icon: Target, color: 'text-indigo-600' },
  { key: 'achievementsUnlocked', label: 'Achievements', icon: Award, color: 'text-amber-600' },
]

function StatCard({ label, value, Icon, color, suffix = '', delay = 0 }) {
  // eslint-disable-next-line no-unused-vars
  const _Icon = Icon
  if (value === undefined || value === null) {
    return null
  }

  return (
    <motion.article
      className={clsx(
        'bg-white border border-neutral-200 rounded-2xl p-6',
        'transition-all duration-300',
        'hover:border-neutral-300 hover:shadow-lg hover:shadow-black/5',
        'group'
      )}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={clsx('p-2.5 rounded-xl bg-neutral-50', color)}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>
      <div className="space-y-1">
        <motion.div
          className="font-serif text-3xl sm:text-4xl font-medium text-neutral-950 tabular-nums"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.1, duration: 0.4 }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
          <span className="font-sans text-lg sm:text-xl font-normal text-neutral-500">{suffix}</span>
        </motion.div>
        <p className="font-sans text-sm text-neutral-600 font-medium">{label}</p>
      </div>
    </motion.article>
  )
}

function AcademicOverview({ stats, isLoading = false }) {
  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8" aria-busy="true">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-lg mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 bg-neutral-200 animate-pulse rounded-2xl border border-neutral-200" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const availableStats = STAT_CONFIG.map((config) => ({
    ...config,
    value: stats?.[config.key],
  })).filter((s) => s.value !== undefined && s.value !== null)

  if (availableStats.length === 0) {
    return null
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="stats-heading">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            id="stats-heading"
            className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 tracking-tight"
          >
            Academic Overview
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {availableStats.map((stat, index) => (
            <StatCard
              key={stat.key}
              label={stat.label}
              value={stat.value}
              Icon={stat.icon}
              color={stat.color}
              suffix={stat.suffix || ''}
              delay={index * 0.08}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default AcademicOverview