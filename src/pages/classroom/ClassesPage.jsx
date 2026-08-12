import PageShell from '../PageShell.jsx'

function ClassesPage() {
  return (
    <PageShell
      actions={[{ label: 'Create class', to: '/classes/create' }, { label: 'Join class', to: '/classes/join' }]}
      description="Browse active classrooms and quickly access their streams, people, materials, and classwork."
      eyebrow="Classrooms"
      title="Classes"
    />
  )
}

export default ClassesPage
