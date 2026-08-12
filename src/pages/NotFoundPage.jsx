import PageShell from './PageShell.jsx'

function NotFoundPage() {
  return (
    <PageShell
      actions={[{ label: 'Return home', to: '/' }]}
      description="The requested route could not be found. Use the home link to return to a known workspace entry point."
      eyebrow="404"
      title="Page not found"
    />
  )
}

export default NotFoundPage
