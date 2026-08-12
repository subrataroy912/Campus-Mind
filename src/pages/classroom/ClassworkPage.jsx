import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function ClassworkPage() {
  return (
    <PageShell
      description="Assignments and materials workspace with graceful empty, loading, and error-ready structure."
      eyebrow="Classroom"
      title="Classwork"
    >
      <PlaceholderStates
        emptyMessage="No assignments or materials have been posted for this class."
        errorMessage="Classwork could not be loaded. Students should still see the classroom navigation and retry affordance."
        resourceName="classwork"
      />
    </PageShell>
  )
}

export default ClassworkPage
