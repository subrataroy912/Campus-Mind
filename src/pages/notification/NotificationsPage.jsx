import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function NotificationsPage() {
  return (
    <PageShell
      description="Transactional system audit list for classroom updates, submissions, grades, and messages."
      eyebrow="Alerts"
      title="Notifications"
    >
      <PlaceholderStates
        emptyMessage="No notifications are waiting. Classroom, submission, grade, and message alerts will appear here."
        errorMessage="Notifications could not be loaded. Keep the audit list shell visible and allow retry."
        resourceName="notifications"
      />
    </PageShell>
  )
}

export default NotificationsPage
