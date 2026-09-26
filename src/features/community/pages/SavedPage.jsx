import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSavedItems } from "../hooks/useSavedItems.js";
import { SavedItemCard } from "../components/SavedItemCard.jsx";
import ErrorState from "@/components/common/ErrorState.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import SearchInput from "@/components/common/SearchInput.jsx";
import { useNavigate } from "react-router";

export default function SavedPage() {
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
  const [inputQuery, setInputQuery] = useState(query);
  const navigate = useNavigate();
  const executeSearch = (searchQuery) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    navigate(`/saved?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setQuery(inputQuery);
    executeSearch(inputQuery);
  };
  return (
    <div className="w-full bg-canvas py-3 px-3 sm:py-5 sm:px-6 lg:px-8 min-w-0">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Saved
          </p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-text-heading sm:text-3xl">
            Bookmarks & Collections
          </h1>
          <p className="mt-1 text-xs text-text-muted sm:text-sm">
            Posts, resources, and assignments you've bookmarked for later.
          </p>
        </div>

        {/* Quick search */}
        <form onSubmit={handleFormSubmit} className="mt-4">
          <SearchInput
            value={inputQuery}
            onImmediateChange={setInputQuery}
            onChange={setQuery}
            placeholder="Search your saved items…"
          />
        </form>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Collections sidebar */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-xl bg-surface p-3 shadow-sm ring-1 ring-border">
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                Collections
              </p>
              <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
                {collections.map((c) => (
                  <Button
                    key={c.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveCollection(c.id)}
                    className={`flex shrink-0 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition lg:w-full h-auto ${
                      activeCollection === c.id
                        ? "bg-canvas text-primary-hover"
                        : "text-text-main hover:bg-canvas"
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.count !== null && (
                      <span className="text-xs text-text-muted">{c.count}</span>
                    )}
                  </Button>
                ))}
              </nav>

              {showNewCollection ? (
                <form onSubmit={handleCreateCollection} className="mt-3 px-1">
                  <Input
                    autoFocus
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Collection name"
                    className="w-full h-8 rounded-lg border border-border px-3 py-1.5 text-sm"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button
                      type="submit"
                      size="xs"
                      className="flex-1 rounded-lg bg-primary px-2 py-1.5 text-xs font-medium text-surface hover:bg-primary-hover"
                    >
                      Create
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      onClick={() => setShowNewCollection(false)}
                      className="rounded-lg border border-border px-2 py-1.5 text-xs font-medium text-text-main hover:bg-canvas"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowNewCollection(true)}
                  className="mt-2 flex w-full items-center justify-start gap-1.5 rounded-lg px-3 py-2 h-auto text-sm font-medium text-primary hover:bg-canvas"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  New collection
                </Button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div>
            {/* Content filters */}
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.map((f) => (
                <Button
                  key={f.id}
                  type="button"
                  variant={activeFilter === f.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(f.id)}
                  className={`rounded-full px-3.5 py-1.5 h-auto text-xs font-medium transition sm:text-sm ${
                    activeFilter === f.id
                      ? "bg-text-heading text-surface"
                      : "bg-surface text-text-main ring-1 ring-border hover:bg-canvas"
                  }`}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            {/* Items list */}
            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="space-y-3">
                {filteredItems.map((item) => (
                  <SavedItemCard
                    key={item.id}
                    item={item}
                    typeMeta={typeMeta}
                    onUnsave={handleUnsave}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
