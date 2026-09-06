import { useSavedItems } from "../hooks/useSavedItems.js";

export default function DashboardSavedPage() {
  const {
    activeCollection,
    activeFilter,
    collections,
    filteredItems,
    filters,
    newCollectionName,
    query,
    showNewCollection,
    typeMeta,
    handleCreateCollection,
    handleUnsave,
    setActiveCollection,
    setActiveFilter,
    setNewCollectionName,
    setQuery,
    setShowNewCollection,
  } = useSavedItems();

  return (
    <div className="min-h-screen bg-canvas py-2 px-2 sm:py-4 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-sm font-semibold text-primary">
            Saved
          </h1>
          <p className="mt-1 text-sm text-text-muted sm:text-base">
            Posts, resources, and assignments you've bookmarked for later.
          </p>
        </div>

        {/* Quick search */}
        <div className="mb-5">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 114 10.5a6.5 6.5 0 0113 0z"
              />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your saved items…"
              className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text-heading outline-none transition focus:ring-2 focus:ring-focus"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Collections sidebar */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl bg-surface p-3 shadow-sm ring-1 ring-border">
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Collections
              </p>
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {collections.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCollection(c.id)}
                    className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition lg:w-full ${
                      activeCollection === c.id
                        ? "bg-canvas text-primary-hover"
                        : "text-text-main hover:bg-canvas"
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.count !== null && (
                      <span className="text-xs text-text-muted">{c.count}</span>
                    )}
                  </button>
                ))}
              </nav>

              {showNewCollection ? (
                <form onSubmit={handleCreateCollection} className="mt-3 px-1">
                  <input
                    autoFocus
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Collection name"
                    className="w-full rounded-lg border border-border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-focus"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-primary px-2 py-1.5 text-xs font-medium text-surface hover:bg-primary-hover"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCollection(false)}
                      className="rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-text-main hover:bg-canvas"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowNewCollection(true)}
                  className="mt-2 flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-canvas"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  New collection
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div>
            {/* Content filters */}
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                    activeFilter === f.id
                      ? "bg-text-heading text-surface"
                      : "bg-surface text-text-main ring-1 ring-border hover:bg-canvas"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Items list */}
            {filteredItems.length === 0 ? (
              <div className="rounded-xl bg-surface py-16 text-center shadow-sm ring-1 ring-border">
                <p className="text-sm font-medium text-text-main">
                  No saved items match your search.
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  Try a different keyword or filter.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredItems.map((item) => (
                  <li
                    key={item.id}
                    className="group rounded-xl bg-surface p-4 shadow-sm ring-1 ring-border transition hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${typeMeta[item.type].color}`}
                          >
                            {typeMeta[item.type].label}
                          </span>
                          <span className="truncate text-xs text-text-muted">
                            {item.meta}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-text-heading sm:text-base">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-text-muted">
                          {item.snippet}
                        </p>
                      </div>

                      <button
                        onClick={() => handleUnsave(item.id)}
                        aria-label="Remove from saved"
                        className="shrink-0 rounded-lg p-1.5 text-primary transition hover:bg-canvas"
                        title="Remove from saved"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 3a1 1 0 00-1 1v17l7-4 7 4V4a1 1 0 00-1-1H6z" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
