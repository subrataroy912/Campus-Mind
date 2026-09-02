import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import Button from '../../../components/common/Button'
import clsx from 'clsx'

function LogoutAction({ onLogout, isLoading = false }) {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="logout-heading">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="bg-surface border border-border rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-canvas flex items-center justify-center text-secondary">
                <LogOut className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-text-heading">
                  Sign Out
                </h3>
                <p className="mt-0.5 font-sans text-sm text-text-muted">
                  End your current session and sign out of CampusMind
                </p>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onLogout}
                disabled={isLoading}
                variant="secondary"
                className={clsx(
                  'w-full sm:w-auto min-h-11 px-6',
                  'font-sans text-sm font-semibold rounded-xl',
                  'border-border text-secondary hover:bg-canvas',
                  'focus:ring-2 focus:ring-focus focus:ring-offset-2',
                  'flex items-center justify-center gap-2',
                  'transition-colors duration-200'
                )}
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default LogoutAction