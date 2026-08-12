import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function ClassStreamPage() {
  return (
    <PageShell
      actions={[{ label: 'Classwork', to: 'classwork' }, { label: 'People', to: 'people' }, { label: 'Class chat', to: 'chat' }]}
      description="Unified stream for announcements, coursework highlights, and classroom updates."
      eyebrow="Classroom"
      title="Class stream"
    >
      <PlaceholderStates
        emptyMessage="No announcements or coursework updates have been posted to this stream."
        errorMessage="The class stream could not be loaded. Keep class navigation available and retry."
        resourceName="class stream"
      />
    </PageShell>
  )
}

export default ClassStreamPage
