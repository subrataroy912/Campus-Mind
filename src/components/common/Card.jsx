import clsx from 'clsx'

function Card({ children, className }) {
  return <section className={clsx('rounded-3xl border border-gray-100 bg-white shadow-sm', className)}>{children}</section>
}

export default Card
