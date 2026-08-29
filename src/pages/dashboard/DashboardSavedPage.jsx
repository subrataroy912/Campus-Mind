import { useState, useMemo } from "react";

// ---- Mock data -------------------------------------------------------

const COLLECTIONS = [
  { id: "all", name: "All saved", count: null },
  { id: "midterm", name: "Midterm prep", count: 4 },
  { id: "group-project", name: "Group project ideas", count: 2 },
  { id: "unsorted", name: "Unsorted", count: 3 },
];

const SAVED_ITEMS = [
  {
    id: 1,
    type: "post",
    title: "Clarification on Thursday's lab report format",
    meta: "Community feed · Ms. Patel · 2 days ago",
    snippet:
      "Quick answer on whether we need a hypothesis section — yes, and here's the rubric breakdown...",
    collection: "midterm",
  },
  {
    id: 2,
    type: "post",
    title: "Best study strategies for the unit 3 exam",
    meta: "Community feed · 14 replies · 5 days ago",
    snippet:
      "Thread with tips from classmates on flashcards, practice sets, and study group times.",
    collection: "midterm",
  },
  {
    id: 3,
    type: "resource",
    title: "Chapter 7 – Chemical Reactions (PDF)",
    meta: "Resource library · 2.4 MB · PDF",
    snippet: "Full chapter reading with annotated diagrams and practice problems.",
    collection: "midterm",
  },
  {
    id: 4,
    type: "resource",
    title: "Khan Academy: Balancing equations",
    meta: "Resource library · External link",
    snippet: "Video walkthrough referenced during Tuesday's lecture.",
    collection: "unsorted",
  },
  {
    id: 5,
    type: "resource",
    title: "Group project rubric and timeline",
    meta: "Resource library · DOCX",
    snippet: "Grading criteria and milestone dates for the semester project.",
    collection: "group-project",
  },
  {
    id: 6,
    type: "assignment",
    title: "Quiz: Periodic table trends",
    meta: "Due tomorrow · 10 questions",
    snippet: "Covers atomic radius, ionization energy, and electronegativity.",
    collection: "midterm",
  },
  {
    id: 7,
    type: "assignment",
    title: "Lab module: Titration simulation",
    meta: "Learning module · Not started",
    snippet: "Interactive simulation with a short reflection write-up at the end.",
    collection: "unsorted",
  },
  {
    id: 8,
    type: "assignment",
    title: "Group project proposal draft",
    meta: "Due in 6 days · Group task",
    snippet: "Outline your topic, roles, and a rough timeline for the final presentation.",
    collection: "group-project",
  },
];

const TYPE_META = {
  post: { label: "Post", color: "bg-sky-100 text-sky-700" },
  resource: { label: "Resource", color: "bg-emerald-100 text-emerald-700" },
  assignment: { label: "Assignment", color: "bg-amber-100 text-amber-700" },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "post", label: "Posts" },
  { id: "resource", label: "Resources" },
  { id: "assignment", label: "Assignments" },
];

// ---- Component ---------------------------------------------------------

export default function DashboardSavedPage() {
  const [activeCollection, setActiveCollection] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(SAVED_ITEMS);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState(COLLECTIONS);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCollection =
        activeCollection === "all" || item.collection === activeCollection;
      const matchesFilter = activeFilter === "all" || item.type === activeFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q);
      return matchesCollection && matchesFilter && matchesQuery;
    });
  }, [items, activeCollection, activeFilter, query]);

  const handleUnsave = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateCollection = (e) => {
    e.preventDefault();
    const name = newCollectionName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/\s+/g, "-");
    setCollections((prev) => [...prev, { id, name, count: 0 }]);
    setNewCollectionName("");
    setShowNewCollection(false);
    setActiveCollection(id);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-2 px-2 sm:py-4 sm:px-3 lg:px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Saved
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Posts, resources, and assignments you've bookmarked for later.
          </p>
        </div>

        {/* Quick search */}
        <div className="mb-5">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 focus:ring-indigo-500"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                Collections
              </p>
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {collections.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCollection(c.id)}
                    className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition lg:w-full ${
                      activeCollection === c.id
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.count !== null && (
                      <span className="text-xs text-slate-400">{c.count}</span>
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-lg bg-indigo-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewCollection(false)}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setShowNewCollection(true)}
                  className="mt-2 flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
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
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition sm:text-sm ${
                    activeFilter === f.id
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Items list */}
            {filteredItems.length === 0 ? (
              <div className="rounded-xl bg-white py-16 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-sm font-medium text-slate-700">
                  No saved items match your search.
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Try a different keyword or filter.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredItems.map((item) => (
                  <li
                    key={item.id}
                    className="group rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${TYPE_META[item.type].color}`}
                          >
                            {TYPE_META[item.type].label}
                          </span>
                          <span className="truncate text-xs text-slate-400">
                            {item.meta}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-slate-900 sm:text-base">
                          {item.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {item.snippet}
                        </p>
                      </div>

                      <button
                        onClick={() => handleUnsave(item.id)}
                        aria-label="Remove from saved"
                        className="shrink-0 rounded-lg p-1.5 text-indigo-500 transition hover:bg-indigo-50"
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
