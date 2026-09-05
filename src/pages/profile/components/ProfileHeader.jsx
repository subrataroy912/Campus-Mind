import { Pencil } from 'lucide-react'
import { Button } from '../../../components/ui/button.jsx'

function initials(name) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

export default function ProfileHeader({ profile, onEdit }) {
  return (
    <header className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="h-20 bg-accent/25 sm:h-24" aria-hidden="true" />
      <div className="px-5 pb-6 sm:px-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="-mt-10 flex items-end gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-surface bg-primary text-xl font-bold text-surface shadow-sm">
              {profile.avatar ? <img className="h-full w-full object-cover" src={profile.avatar} alt="" /> : initials(profile.name)}
            </div>
            <div className="pb-1">
              <p className="text-sm font-semibold text-primary">{profile.role === 'teacher' ? 'Teacher' : 'Student'}</p>
              <h1 className="text-2xl font-bold tracking-tight text-text-heading">{profile.name}</h1>
            </div>
          </div>
          <Button variant="outline" onClick={onEdit} className="sm:mb-1"><Pencil size={16} aria-hidden="true" />Edit profile</Button>
        </div>
        <div className="mt-5 max-w-2xl space-y-2">
          <p className="text-sm font-medium text-text-main">{profile.headline}</p>
          <p className="text-sm leading-6 text-text-muted">{profile.bio}</p>
        </div>
      </div>
    </header>
  )
}
