import { Button } from "@/components/ui/button.jsx";

export default function ExplorePagination({
  page,
  totalPages,
  first,
  last,
  isFetching,
  onPrevious,
  onNext,
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      className="mt-8 flex items-center justify-center gap-3"
      aria-label="Course pagination"
    >
      <Button
        variant="outline"
        disabled={first || isFetching}
        onClick={onPrevious}
      >
        Previous
      </Button>
      <span className="text-sm text-text-muted">
        Page {page + 1} of {totalPages}
      </span>
      <Button variant="outline" disabled={last || isFetching} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}
