import { motion } from 'framer-motion'
import { User, Bell, Shield, Key, Moon, Globe, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
// eslint-disable-next-line no-unused-vars
const _motion = motion

const SETTINGS_ITEMS = [
  {
    id: 'account',
    icon: User,
    title: 'Account Settings',
    description: 'Manage your name, username, email, and profile picture',
    href: '/settings/account',
  },
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notification Preferences',
    description: 'Choose what notifications you receive and how',
    href: '/settings/notifications',
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'Privacy',
    description: 'Control your data visibility and privacy settings',
    href: '/settings/privacy',
  },
  {
    id: 'security',
    icon: Key,
    title: 'Security',
    description: 'Manage password, two-factor authentication, and sessions',
    href: '/settings/security',
  },
  {
    id: 'appearance',
    icon: Moon,
    title: 'Appearance',
    description: 'Customize theme, language, and display preferences',
    href: '/settings/appearance',
  },
  {
    id: 'language',
    icon: Globe,
    title: 'Language & Region',
    description: 'Set your preferred language and regional format',
    href: '/settings/language',
  },
]

function SettingsRow({ item, index, onClick }) {
  const Icon = item.icon

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ x: 4 }}
    >
      <button
        onClick={onClick}
        className={clsx(
          'w-full flex items-center gap-4 p-4 rounded-xl',
          'bg-surface border border-border',
          'hover:bg-canvas hover:border-border',
          'focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2',
          'transition-all duration-200',
          'text-left'
        )}
        aria-label={item.title}
      >
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-canvas flex items-center justify-center text-text-main transition-colors group-hover:text-text-heading">
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base font-medium text-text-heading">
            {item.title}
          </h3>
          <p className="mt-0.5 font-sans text-sm text-text-muted truncate">
            {item.description}
          </p>
        </div>

        <motion.div
          className="flex-shrink-0 w-8 h-8 rounded-xl bg-canvas flex items-center justify-center text-text-muted transition-colors group-hover:bg-border group-hover:text-text-main"
          whileHover={{ x: 3 }}
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </motion.div>
      </button>
    </motion.li>
  )
}

function AccountSettings({ onNavigate }) {
  const handleClick = (href) => {
    if (onNavigate && href) {
      onNavigate(href)
    }
  }

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="settings-heading">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            id="settings-heading"
            className="font-serif text-2xl sm:text-3xl font-medium text-text-heading tracking-tight"
          >
            Account Settings
          </h2>
          <p className="mt-1.5 font-sans text-sm text-text-muted">
            Manage your account preferences and settings
          </p>
        </motion.div>

        <motion.ul
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {SETTINGS_ITEMS.map((item, index) => (
            <SettingsRow
              key={item.id}
              item={item}
              index={index}
              onClick={() => handleClick(item.href)}
            />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}

export default AccountSettings