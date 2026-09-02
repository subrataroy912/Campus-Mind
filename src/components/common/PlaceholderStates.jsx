function PlaceholderStates({ resourceName, emptyMessage, errorMessage }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm" aria-label={`${resourceName} loading state`}>
        <p className="text-sm font-semibold text-text-heading">Loading</p>
        <div className="mt-4 space-y-3" aria-hidden="true">
          <div className="h-3 w-3/4 animate-pulse rounded bg-canvas" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-canvas" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-canvas" />
        </div>
        <p className="mt-4 text-sm text-text-main">Fetching {resourceName} without blocking the page shell.</p>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm" aria-label={`${resourceName} empty state`}>
        <p className="text-sm font-semibold text-text-heading">Empty</p>
        <p className="mt-4 text-sm leading-6 text-text-main">{emptyMessage}</p>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6 shadow-sm" aria-label={`${resourceName} error state`}>
        <p className="text-sm font-semibold text-text-heading">Error</p>
        <p className="mt-4 text-sm leading-6 text-text-main">{errorMessage}</p>
        <button className="mt-5 min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-surface shadow-sm hover:bg-primary-hover" type="button">
          Retry
        </button>
      </section>
    </div>
  )
}

export default PlaceholderStates
