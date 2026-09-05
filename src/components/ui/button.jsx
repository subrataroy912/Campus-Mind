import { Link } from 'react-router'
import { cn } from '../../lib/utils.js'

const variants = { primary: 'bg-primary text-surface shadow-sm hover:bg-primary-hover', default: 'bg-primary text-surface shadow-sm hover:bg-primary-hover', secondary: 'bg-secondary text-surface shadow-sm hover:bg-secondary-hover', outline: 'border border-border bg-surface text-text-heading hover:bg-canvas hover:text-primary', ghost: 'text-text-main hover:bg-canvas hover:text-primary', destructive: 'bg-secondary text-surface hover:bg-secondary-hover' }
const sizes = { default: 'h-10', sm: 'h-9 px-3 text-xs', lg: 'h-11 px-6' }
const buttonVariants = ({ variant = 'primary', size = 'default' } = {}) => cn('inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', variants[variant], sizes[size])

function Button({ className, variant, size, to, type = 'button', ...props }) {
  const classes = cn(buttonVariants({ variant, size }), className)
  if (to) return <Link to={to} className={classes} {...props} />
  return <button type={type} className={classes} {...props} />
}

export { Button }
