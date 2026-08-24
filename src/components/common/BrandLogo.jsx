import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

function BrandLogo({ compact = false }) {
  return (
    <Link to={"/"}>
      <div className="flex items-center justify-center">
        {!compact && <span className="text-2xl font-black tracking-tight text-white-950">
          Campus
          <span className="text-purple-600">Mind</span>
        </span>
        }
      </div>
    </Link>
  )
}

export default BrandLogo
