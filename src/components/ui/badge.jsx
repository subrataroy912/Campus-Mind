import { cn } from '../../lib/utils.js'
const variants = { default: 'border-transparent bg-primary text-surface', secondary: 'border-transparent bg-canvas text-text-main', success: 'border-transparent bg-success text-surface', outline: 'border-border text-text-main' }
const badgeVariants = ({ variant = 'default' } = {}) => cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors', variants[variant])
function Badge({ className, variant, ...props }) { return <span className={cn(badgeVariants({ variant }), className)} {...props} /> }
export { Badge }
