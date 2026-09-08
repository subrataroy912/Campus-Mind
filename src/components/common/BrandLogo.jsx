import { Link, useLocation } from 'react-router'

function BrandLogo({ compact = false, className = '' }) {
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleClick = (e) => {
    if (isHome) {
      e.preventDefault()
    }
  }

  return (
    <Link
      to="/"
      onClick={handleClick}
      className={`relative inline-flex max-w-full px-2 py-1 transition-opacity hover:opacity-80 sm:px-3 ${className}`}
    >
      <div className="flex items-center justify-center gap-1 md:gap-2 flex-nowrap">
        <img
          src="/logo-square.png"
          alt="CampusMind"
          className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
        />

        {!compact && (
          <span className="whitespace-nowrap text-lg font-bold tracking-tight text-text-heading sm:text-xl">
            Campus
            <span className="text-primary">Mind</span>
          </span>
        )}
      </div>

      <span className="absolute -right-3 -top-1 rounded bg-primary px-1 py-0.5 text-[9px] font-extrabold uppercase leading-none text-primary-foreground shadow-sm">
        beta
      </span>
    </Link>
  )
}

export default BrandLogo