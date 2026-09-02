import { Link } from 'react-router'

function PageShell({ title, eyebrow, description, actions = [], children }) {
  const hasActions = actions.length > 0

  return (
    <main className="min-h-screen bg-canvas px-6 py-10 text-text-heading sm:px-8 lg:px-10">
      <section className="mx-auto w-full max-w-6xl space-y-6">
        <article className="rounded-xl border border-border bg-surface p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-text-heading sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-text-main">{description}</p>

          {hasActions && (
            <div className="mt-8 flex flex-wrap gap-3">
              {actions.map((action) => (
                <Link
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-surface shadow-sm transition hover:bg-primary-hover"
                  key={action.to}
                  to={action.to}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </article>

        {children}
      </section>
    </main>
  )
}

export default PageShell
