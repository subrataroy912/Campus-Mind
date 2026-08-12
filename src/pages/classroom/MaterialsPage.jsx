import PlaceholderStates from '../../components/common/PlaceholderStates.jsx'
import PageShell from '../PageShell.jsx'

function MaterialsPage() {
  return (
    <PageShell
      description="Resource download panels for class materials and teacher-provided assets."
      eyebrow="Classroom"
      title="Materials"
    >
      <PlaceholderStates
        emptyMessage="No class materials have been uploaded yet."
        errorMessage="Materials could not be loaded. Preserve download panels and retry the request."
        resourceName="materials"
      />
    </PageShell>
  )
}

export default MaterialsPage
