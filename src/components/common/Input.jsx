import clsx from 'clsx'

export default function Input({ className, ...props }) {
  return <input className={clsx('w-full rounded-lg border border-border bg-surface px-3 py-2 text-text-heading placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-focus/25', className)} {...props} />
}
