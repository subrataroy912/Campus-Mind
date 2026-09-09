import EmptyState from "@/components/common/EmptyState.jsx";

export default function ClassQuickLinks() {
  return (
    <section className="mt-4">
      <div className="rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-border sm:p-6">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary">CLASS RESOURCES</p>
            <h2 className="text-2xl font-bold tracking-tight text-text-heading">
              Quick links
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              Find the resources your class uses most often.
            </p>
          </div>
        </header>
        <div className="mt-5">
          <EmptyState
            title="No quick links yet"
            description="Resources shared by your class will appear here."
          />
        </div>
      </div>
    </section>
  );
}
