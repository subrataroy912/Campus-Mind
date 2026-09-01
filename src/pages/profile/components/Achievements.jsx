import { motion } from 'framer-motion'
import { Trophy, Zap, Target, Star, Medal, Crown } from 'lucide-react'
import clsx from 'clsx'

const ACHIEVEMENT_ICONS = {
  trophy: Trophy,
  zap: Zap,
  target: Target,
  star: Star,
  medal: Medal,
  crown: Crown,
}

const ACHIEVEMENT_COLORS = {
  gold: 'text-amber-500 bg-amber-50 border-amber-100',
  silver: 'text-neutral-400 bg-neutral-100 border-neutral-200',
  bronze: 'text-amber-700 bg-amber-50 border-amber-100',
  default: 'text-blue-600 bg-blue-50 border-blue-100',
}

function AchievementCard({ achievement, index }) {
  const { name, description, icon: iconKey, tier, unlockedAt, progress, maxProgress } = achievement
  const Icon = ACHIEVEMENT_ICONS[iconKey] || ACHIEVEMENT_ICONS.trophy
  const colorClass = ACHIEVEMENT_COLORS[tier] || ACHIEVEMENT_COLORS.default
  const isLocked = !unlockedAt
  const progressPercent = maxProgress ? Math.min(100, Math.round((progress / maxProgress) * 100)) : (unlockedAt ? 100 : 0)

  return (
    <motion.article
      className={clsx(
        'group relative bg-white border rounded-2xl p-5 transition-all duration-300',
        'hover:shadow-lg hover:shadow-black/5 hover:border-neutral-300',
        isLocked ? 'opacity-60' : '',
        colorClass.replace('bg-', 'border-').replace('text-', 'border-')
      )}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className={clsx(
            'flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center',
            colorClass,
            isLocked && 'grayscale'
          )}
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Icon className="w-7 h-7" aria-hidden="true" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className={clsx(
              'font-serif text-lg font-medium',
              isLocked ? 'text-neutral-500' : 'text-neutral-950'
            )}>
              {name}
            </h3>
            {tier && !isLocked && (
              <span className={clsx(
                'font-sans text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider',
                tier === 'gold' && 'bg-amber-100 text-amber-700',
                tier === 'silver' && 'bg-neutral-100 text-neutral-700',
                tier === 'bronze' && 'bg-amber-50 text-amber-700',
              )}>
                {tier}
              </span>
            )}
          </div>

          <p className={clsx(
            'mt-1.5 font-sans text-sm leading-relaxed',
            isLocked ? 'text-neutral-400' : 'text-neutral-600'
          )}>
            {description}
          </p>

          {isLocked && maxProgress && (
            <div className="mt-3" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} progress`}>
              <div className="flex items-center justify-between text-xs font-sans mb-1">
                <span className="text-neutral-500">Progress</span>
                <span className="font-medium text-neutral-700">{progressPercent}%</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className={clsx('h-full rounded-full transition-all duration-500', colorClass.replace('bg-', 'bg-').replace('text-', 'bg-'))}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ delay: index * 0.08 + 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>
            </div>
          )}

          {unlockedAt && !isLocked && (
            <p className="mt-3 font-sans text-xs text-neutral-500">
              Unlocked {new Date(unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>

        {isLocked && (
          <motion.div
            className="absolute top-4 right-4 w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.08 + 0.3, type: 'spring', stiffness: 300, damping: 20 }}
          >
            <svg className="w-3.5 h-3.5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.article>
  )
}

function Achievements({ achievements, isLoading = false }) {
  if (isLoading) {
    return (
      <section className="py-8 px-4 sm:px-6 lg:px-8" aria-busy="true">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded-lg mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-neutral-200 animate-pulse rounded-2xl border border-neutral-200" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!achievements || achievements.length === 0) {
    return null
  }

  const unlocked = achievements.filter((a) => a.unlockedAt).sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
  const locked = achievements.filter((a) => !a.unlockedAt)

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="achievements-heading">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            id="achievements-heading"
            className="font-serif text-2xl sm:text-3xl font-medium text-neutral-950 tracking-tight"
          >
            Achievements
          </h2>
          <div className="font-sans text-sm text-neutral-500">
            {unlocked.length} / {achievements.length} unlocked
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {unlocked.map((achievement, index) => (
            <AchievementCard key={achievement.id || index} achievement={achievement} index={index} />
          ))}
          {locked.map((achievement, index) => (
            <AchievementCard key={achievement.id || `locked-${index}`} achievement={achievement} index={unlocked.length + index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Achievements