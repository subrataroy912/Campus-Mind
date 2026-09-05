import { cn } from '../../lib/utils.js'

function Input({ className, type, ...props }) {
  return <input type={type} className={cn('flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-heading shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:cursor-not-allowed disabled:opacity-50', className)} {...props} />
}

export { Input }
