function PlaceholderStates({ resourceName, emptyMessage, errorMessage }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" aria-label={`${resourceName} loading state`}>
        <p className="text-sm font-semibold text-gray-900">Loading</p>
        <div className="mt-4 space-y-3" aria-hidden="true">
          <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
        </div>
        <p className="mt-4 text-sm text-gray-700">Fetching {resourceName} without blocking the page shell.</p>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" aria-label={`${resourceName} empty state`}>
        <p className="text-sm font-semibold text-gray-900">Empty</p>
        <p className="mt-4 text-sm leading-6 text-gray-700">{emptyMessage}</p>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm" aria-label={`${resourceName} error state`}>
        <p className="text-sm font-semibold text-gray-900">Error</p>
        <p className="mt-4 text-sm leading-6 text-gray-700">{errorMessage}</p>
        <button className="mt-5 min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700" type="button">
          Retry
        </button>
      </section>
    </div>
  )
}

export default PlaceholderStates
