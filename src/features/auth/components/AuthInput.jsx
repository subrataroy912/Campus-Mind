import clsx from 'clsx'

function AuthInput({ icon: Icon, label, rightIcon, className, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-heading">{label}</span>
      <span className="mt-1 flex h-9 items-center gap-2 rounded-md border border-border/80 bg-canvas/40 px-2.5 text-text-muted shadow-2xs transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:bg-surface">
        {Icon && <Icon aria-hidden="true" size={15} className="shrink-0 text-text-muted" />}
        <input className={clsx('w-full bg-transparent text-xs text-text-heading outline-none placeholder:text-text-muted', className)} {...props} />
        {rightIcon}
      </span>
    </label>
  )
}

export default AuthInput
