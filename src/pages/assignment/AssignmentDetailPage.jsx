import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function AssignmentDetailPage() {
  return (
    <PageShell
      description="Granular assignment workspace for submissions, instructions, due dates, and grading context."
      eyebrow="Assignments"
      title="Assignment details"
    >
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-heading">Instructions</h2>
          <p className="mt-3 text-sm leading-6 text-text-main">Assignment instructions, attachments, submission status, and teacher feedback will render here once `/api/assignments/:assignmentId` responds.</p>
        </section>
        <section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-text-heading">Submission summary</h2>
          <button className="mt-5 min-h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-surface shadow-sm hover:bg-primary-hover" type="button">
            Upload work
          </button>
        </section>
      </div>
      <PlaceholderStates
        emptyMessage="No submissions or grading notes have been attached to this assignment yet."
        errorMessage="Assignment details could not be loaded. Preserve the submission card and retry safely."
        resourceName="assignment details"
      />
    </PageShell>
  )
}

export default AssignmentDetailPage
