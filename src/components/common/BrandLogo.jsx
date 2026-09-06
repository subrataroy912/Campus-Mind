import { Link } from 'react-router'

function BrandLogo({ compact = false, className = '' }) {
  return (
    <Link to="/" className={`inline-flex max-w-full px-2 py-1 transition-opacity hover:opacity-80 sm:px-3 ${className}`}>
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
    </Link>
  )
}

export default BrandLogo
