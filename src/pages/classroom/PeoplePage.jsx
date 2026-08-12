import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function PeoplePage() {
  return (
    <PageShell
      description="Student rosters and faculty arrays for the selected classroom."
      eyebrow="Classroom"
      title="People"
    >
      <PlaceholderStates
        emptyMessage="No roster members are available for this classroom yet."
        errorMessage="Classroom members could not be loaded. Keep teacher and student sections stable while retrying."
        resourceName="class members"
      />
    </PageShell>
  )
}

export default PeoplePage
