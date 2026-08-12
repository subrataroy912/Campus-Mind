import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function ClassesPage() {
  return (
    <PageShell
      actions={[{ label: 'Create class', to: '/classes/create' }, { label: 'Join class', to: '/classes/join' }]}
      description="Browse active classrooms and quickly access their streams, people, materials, and classwork."
      eyebrow="Classrooms"
      title="Classes"
    >
      <PlaceholderStates
        emptyMessage="No classrooms are available yet. Create a class as a teacher or join with a class code as a student."
        errorMessage="Classrooms could not be loaded. Keep the existing page frame visible and offer a retry action."
        resourceName="classrooms"
      />
    </PageShell>
  )
}

export default ClassesPage
