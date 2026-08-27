import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

function BrandLogo({ compact = false }) {
  return (
    <Link to="/" className="max-w-fit px-3 sm:px-4 md:px-5 transition-all">
      <div className="flex items-center justify-center gap-1 md:gap-2 flex-nowrap">

        <img
          src={"/logo-square.png"}
          alt="CampusMind Logo"
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain shrink-0"
        />

        {!compact && (
          <span className="text-xl  md:text-xl font-black tracking-tight text-gray-900 transition-all whitespace-nowrap">
            Campus
            <span className="text-purple-600">Mind</span>
          </span>
        )}
      </div>
    </Link>
  )
}

export default BrandLogo