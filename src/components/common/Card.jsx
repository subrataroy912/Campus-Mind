import clsx from 'clsx'

function Card({ children, className }) {
  return <section className={clsx('rounded-3xl border border-border bg-surface shadow-sm', className)}>{children}</section>
}

export default Card
