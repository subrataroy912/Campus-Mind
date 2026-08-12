import PageShell from '../PageShell.jsx'

function DashboardPage() {
  return (
    <PageShell
      actions={[{ label: 'View classes', to: '/classes' }, { label: 'Open chat', to: '/chat' }]}
      description="An aggregated workspace for course updates, assignment priorities, and text-first collaboration."
      eyebrow="Workspace"
      title="Dashboard"
    />
  )
}

export default DashboardPage
