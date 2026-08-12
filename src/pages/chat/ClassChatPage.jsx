import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function ClassChatPage() {
  return (
    <PageShell
      description="Contextual classroom group chat focused on messages, files, and academic collaboration."
      eyebrow="Classroom chat"
      title="Class chat"
    >
      <PlaceholderStates
        emptyMessage="No class messages have been sent yet. Be the first to share a text update or resource."
        errorMessage="Class chat could not be loaded. Unsubscribe from stale topics and retry the text channel."
        resourceName="class messages"
      />
    </PageShell>
  )
}

export default ClassChatPage
