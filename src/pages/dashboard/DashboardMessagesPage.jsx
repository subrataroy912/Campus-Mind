import EmptyState from '../../components/common/EmptyState.jsx'

export default function DashboardMessagesPage() {
  return <div className="mx-auto max-w-4xl p-3 sm:p-6"><header><p className="text-sm font-semibold text-primary">Messages</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-text-heading">Your conversations.</h1><p className="mt-2 text-text-muted">Messages are kept with the classes they belong to, so it is easier to find the context later.</p></header><div className="mt-8"><EmptyState title="No messages to catch up on" description="Open a class to join its conversation." action={{ to: '/dashboard', label: 'View my classes' }} /></div></div>
}
