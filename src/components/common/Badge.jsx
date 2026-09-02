import clsx from 'clsx'

const variants = { neutral: 'bg-canvas text-text-main', success: 'bg-success text-surface', primary: 'bg-primary text-surface' }
export default function Badge({ children, variant = 'neutral', className }) {
  return <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', variants[variant], className)}>{children}</span>
}
