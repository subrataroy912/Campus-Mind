import clsx from 'clsx'

function AuthInput({ icon: Icon, label, rightIcon, className, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-text-heading">{label}</span>
      <span className="mt-2 flex min-h-14 items-center gap-3 rounded-xl border border-border bg-surface px-4 text-text-muted shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-focus">
        {Icon && <Icon aria-hidden="true" size={22} />}
        <input className={clsx('w-full bg-transparent text-base text-text-heading outline-none placeholder:text-text-muted', className)} {...props} />
        {rightIcon}
      </span>
    </label>
  )
}

export default AuthInput
