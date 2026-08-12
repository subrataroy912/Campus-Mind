import { Link } from 'react-router-dom'

function PageShell({ title, eyebrow, description, actions = [] }) {
  const hasActions = actions.length > 0

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10 text-gray-900 sm:px-8 lg:px-10">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <article className="w-full rounded-xl border border-gray-100 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-700">{description}</p>

          {hasActions && (
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  key={action.to}
                  to={action.to}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

export default PageShell
