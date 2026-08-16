import clsx from 'clsx'

function AuthInput({ icon: Icon, label, rightIcon, className, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-gray-900">{label}</span>
      <span className="mt-2 flex min-h-14 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-gray-500 shadow-sm focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100">
        {Icon && <Icon aria-hidden="true" size={22} />}
        <input className={clsx('w-full bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400', className)} {...props} />
        {rightIcon}
      </span>
    </label>
  )
}

export default AuthInput
