import PageShell from '../PageShell.jsx'

function ClassStreamPage() {
  return (
    <PageShell
      actions={[{ label: 'Classwork', to: 'classwork' }, { label: 'People', to: 'people' }, { label: 'Class chat', to: 'chat' }]}
      description="Unified stream for announcements, coursework highlights, and classroom updates."
      eyebrow="Classroom"
      title="Class stream"
    />
  )
}

export default ClassStreamPage
