import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Plus, Ticket } from 'lucide-react'
import { fetchClassrooms } from '../../features/classroom/api/classroomService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import ClassCard from '../../components/dashboard/ClassCard.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

export default function DashboardHomePage() {
  const { user } = useAuth()
  const [classrooms, setClassrooms] = useState([])
  const [status, setStatus] = useState('loading')
  useEffect(() => { fetchClassrooms().then((data) => { setClassrooms(data); setStatus('ready') }).catch(() => setStatus('error')) }, [])
  return <div className="mx-auto max-w-7xl p-3 sm:p-6">
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-primary">Your learning space</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h1><p className="mt-2 text-text-muted">Pick up where you left off or bring a new class together.</p></div><div className="flex flex-wrap gap-3"><Link to="/dashboard/class/join" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-surface px-4 text-sm font-bold text-text-main hover:bg-canvas"><Ticket size={17} />Join with code</Link><Link to="/dashboard/class/create" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-surface hover:bg-primary-hover"><Plus size={17} />Create class</Link></div></header>
    <section className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-text-heading">My classes</h2><span className="text-sm text-text-muted">{status === 'ready' ? `${classrooms.length} classes` : 'Loading classes…'}</span></div>{status === 'ready' && classrooms.length > 0 && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{classrooms.map((classroom) => <ClassCard classroom={classroom} key={classroom.id} />)}</div>}{status === 'ready' && !classrooms.length && <EmptyState title="Your class list is ready for you" description="Create a class for your group or join one with a code." action={{ to: '/dashboard/class/join', label: 'Join a class' }} />}{status === 'error' && <EmptyState title="We could not load your classes" description="Please refresh the page and try again." />}</section>
  </div>
}
