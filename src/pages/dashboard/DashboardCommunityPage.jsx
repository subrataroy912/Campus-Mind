import EmptyState from '../../components/common/EmptyState.jsx'

export default function DashboardCommunityPage() {
  return <div className="mx-auto max-w-4xl p-3 sm:p-6"><header><p className="text-sm font-semibold text-primary">Community</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">Learn better together.</h1><p className="mt-2 text-text-muted">Classroom conversations will appear here as your teachers and classmates share updates.</p></header><div className="mt-8"><EmptyState title="No community updates yet" description="Start with a class to keep conversations focused and helpful." action={{ to: '/dashboard/class/join', label: 'Join a class' }} /></div></div>
}
