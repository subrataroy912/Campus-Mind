import { Link } from 'react-router-dom'
import clsx from 'clsx'

const variants = {
  primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-purple-700',
  secondary: 'border border-gray-200 bg-white text-gray-900 shadow-sm hover:border-purple-200 hover:text-purple-700',
  ghost: 'text-gray-700 hover:bg-gray-100',
}

function Button({ children, className, to, type = 'button', variant = 'primary', ...props }) {
  const classes = clsx(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    className,
  )

  if (to) {
    return <Link className={classes} to={to} {...props}>{children}</Link>
  }

  return <button className={classes} type={type} {...props}>{children}</button>
}

export default Button
