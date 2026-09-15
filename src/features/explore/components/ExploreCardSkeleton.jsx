export default function ExploreCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs animate-pulse">
      <div className="h-14 w-full bg-border/40" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-border/40" />
        <div className="h-3 w-1/2 rounded bg-border/30" />
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40">
          <div className="h-3 w-16 rounded bg-border/30" />
          <div className="h-5 w-12 rounded bg-border/40" />
        </div>
      </div>
    </div>
  );
}
