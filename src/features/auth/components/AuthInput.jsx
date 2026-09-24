import { cn } from '@/lib/utils'

/**
 * Reusable auth form input with optional leading icon and trailing action.
 * Touch-target height is min 44 px (min-h-11) to satisfy the 44×44 touch rule.
 * Focus ring is surfaced on the wrapper via focus-within so all keyboard users
 * get a clear indicator regardless of which child receives focus.
 */
function AuthInput({ icon: Icon, label, rightIcon, className, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-text-heading">{label}</span>
      <span className="mt-1 flex min-h-11 items-center gap-2 rounded-md border border-border/80 bg-canvas/40 px-2.5 text-text-muted shadow-2xs transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:bg-surface">
        {Icon && <Icon aria-hidden="true" size={15} className="shrink-0 text-text-muted" />}
        <input
          className={cn(
            'w-full min-w-0 bg-transparent text-base leading-none text-text-heading outline-none placeholder:text-text-muted sm:text-xs',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <span className="flex shrink-0 items-center">{rightIcon}</span>
        )}
      </span>
    </label>
  )
}

export default AuthInput
