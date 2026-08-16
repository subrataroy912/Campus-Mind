import { GraduationCap } from 'lucide-react'

function BrandLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20">
        <GraduationCap aria-hidden="true" size={30} />
      </span>
      {!compact && <span className="text-3xl font-black tracking-tight text-gray-950">Edu<span className="text-purple-600">Space</span></span>}
    </div>
  )
}

export default BrandLogo
