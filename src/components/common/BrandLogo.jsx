import { Link } from 'react-router'

function BrandLogo({ compact = false, className = '' }) {
  return (
    <Link to="/" className={`max-w-fit px-3 py-1 transition-opacity hover:opacity-80 ${className}`}>
      <div className="flex items-center justify-center gap-1 md:gap-2 flex-nowrap">

        <img
          src="/logo-square.png"
          alt="CampusMind"
          className="h-10 w-10 shrink-0 object-contain"
        />

        {!compact && (
          <span className="whitespace-nowrap text-xl font-bold tracking-tight text-text-heading">
            Campus
            <span className="text-primary">Mind</span>
          </span>
        )}
      </div>
    </Link>
  )
}

export default BrandLogo
