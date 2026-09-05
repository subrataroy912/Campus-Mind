import { Link } from 'react-router'
import clsx from 'clsx'

const variants = {
  primary: 'border border-primary bg-primary text-surface shadow-sm hover:border-primary-hover hover:bg-primary-hover active:bg-primary-hover',
  secondary: 'border border-secondary bg-secondary text-surface shadow-sm hover:border-secondary-hover hover:bg-secondary-hover active:bg-secondary-hover',
  outline: 'border border-primary bg-surface text-primary hover:bg-primary hover:text-surface',
  ghost: 'text-text-main hover:bg-canvas hover:text-primary',
}

function Button({ children, className, to, type = 'button', variant = 'primary', ...props }) {
  const classes = clsx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-focus/25 disabled:cursor-not-allowed disabled:border-border disabled:bg-canvas disabled:text-border disabled:opacity-100',
    variants[variant],
    className,
  )

  if (to) {
    return <Link className={classes} to={to} {...props}>{children}</Link>
  }

  return <button className={classes} type={type} {...props}>{children}</button>
}

export default Button
