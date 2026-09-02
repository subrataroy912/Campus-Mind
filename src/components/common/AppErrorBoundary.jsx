import { Component } from 'react'
import Button from './Button.jsx'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Application render failed:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-canvas px-6 text-text-heading">
          <section className="max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-primary">Campus Mind</p>
            <h1 className="mt-3 text-3xl font-black">We could not load this screen.</h1>
            <p className="mt-4 text-text-main">Refresh the page, or return to the landing page to continue.</p>
            <Button className="mt-6" onClick={() => window.location.assign('/')}>Return home</Button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
