import PageShell from '../PageShell.jsx'

const summaryCards = [
  { label: 'Active classes', value: '0', note: 'Classes will populate from /api/classes.' },
  { label: 'Due soon', value: '0', note: 'Assignments will surface deadline priorities.' },
  { label: 'Unread messages', value: '0', note: 'Chat counts will sync from conversations.' },
]

function DashboardPage() {
  return (
    <PageShell
      actions={[{ label: 'View classes', to: '/classes' }, { label: 'Open chat', to: '/chat' }]}
      description="An aggregated workspace for course updates, assignment priorities, and text-first collaboration."
      eyebrow="Workspace"
      title="Dashboard"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" key={card.label}>
            <p className="text-sm font-medium text-gray-700">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="mt-3 text-sm leading-6 text-gray-700">{card.note}</p>
          </section>
        ))}
      </div>
    </PageShell>
  )
}

export default DashboardPage
