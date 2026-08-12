import './App.css'

const featureCards = [
  {
    title: 'Classroom management',
    description: 'Organize class streams, people, materials, and assignment workflows from a calm workspace.',
  },
  {
    title: 'Assignment tracking',
    description: 'Surface deadlines, submissions, grading queues, and empty states without disrupting the layout.',
  },
  {
    title: 'Text-first chat',
    description: 'Keep classroom and direct conversations focused on messages, files, and academic context.',
  },
]

function App() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Campus Mind</p>
            <h1 className="text-xl font-bold text-gray-900">Classroom Chat Platform</h1>
          </div>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            href="/dashboard"
          >
            Open dashboard
          </a>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              Vite + React initialized
            </p>
            <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              A modern frontend foundation for classes, assignments, and text messaging.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-gray-700">
              This starter follows the repository structure for a light-mode, Google Classroom-inspired experience and is ready for routing, API services, and WebSocket chat integrations.
            </p>
          </div>

          <div className="grid gap-4">
            {featureCards.map((feature) => (
              <article key={feature.title} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
