import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function ChatPage() {
  return (
    <PageShell
      description="Standalone direct messaging and general channel hub for text-first communication."
      eyebrow="Messages"
      title="Chat"
    >
      <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <p className="mt-3 text-sm text-gray-700">Direct messages and classroom channels will appear here.</p>
        </aside>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Message thread</h2>
          <p className="mt-3 text-sm text-gray-700">Select a conversation to load text messages and shared assets.</p>
        </div>
      </section>
      <PlaceholderStates
        emptyMessage="No messages found. Start a direct message or open a class channel."
        errorMessage="Messages could not be loaded. Keep the composer disabled until the thread is available."
        resourceName="messages"
      />
    </PageShell>
  )
}

export default ChatPage
