import EmptyState from '../../components/common/EmptyState.jsx'

export default function DashboardAssignmentPage() {
  return <div className="mx-auto max-w-4xl p-3 sm:p-6"><header><p className="text-sm font-semibold text-primary">Assignments</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">A clearer view of your work.</h1><p className="mt-2 text-text-muted">Assignments will show here when they are shared in one of your classes.</p></header><div className="mt-8"><EmptyState title="No assignments due right now" description="Enjoy the breathing room, or check a class for its latest resources." action={{ to: '/dashboard', label: 'View my classes' }} /></div></div>
}
