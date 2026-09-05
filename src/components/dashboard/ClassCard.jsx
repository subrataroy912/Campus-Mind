import { Link } from 'react-router'
import { MessageCircle, Users } from 'lucide-react'

export default function ClassCard({ classroom }) {
  const teacher = classroom.instructor || classroom.teacher || { name: 'CampusMind teacher' }
  const unread = classroom.unreadCount ?? classroom.unreadMessages ?? 0
  return <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className={`h-2 ${classroom.theme || 'bg-primary'}`} />
    <div className="p-5">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-primary">{classroom.role === 'Created' ? 'Teaching' : 'Class'}</p><h2 className="mt-1 text-lg font-bold text-text-heading">{classroom.title}</h2><p className="text-sm text-text-muted">{classroom.subtitle}</p></div><span className="rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-text-main">{classroom.onlineCount || 0} online</span></div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm text-text-muted"><span>with {teacher.name}</span><span className="inline-flex items-center gap-1"><Users size={15} />{classroom.memberCount}</span></div>
    </div>
    <div className="flex items-center justify-between bg-canvas/60 px-5 py-3"><span className="inline-flex items-center gap-1 text-sm text-text-muted"><MessageCircle size={15} />{unread ? `${unread} new` : 'Up to date'}</span><Link className="text-sm font-bold text-primary hover:underline" to={`/dashboard/classes/${classroom.id}`}>Open class</Link></div>
  </article>
}
