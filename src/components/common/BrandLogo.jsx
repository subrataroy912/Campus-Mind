import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

function BrandLogo({ compact = false }) {
  return (
    <Link to={"/"}>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20">
          <GraduationCap aria-hidden="true" size={30} />
        </span>
        {!compact && <span className="text-3xl font-black tracking-tight text-white-950">Campus<span className="text-purple-600">Mind</span></span>}
      </div>
    </Link>
  )
}

export default BrandLogo
