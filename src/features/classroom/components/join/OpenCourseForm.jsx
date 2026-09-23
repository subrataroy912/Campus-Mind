import { Button } from "@/components/ui/button.jsx";

export function OpenCourseForm({ course, onSubmit, isLoading = false }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="rounded-xl border border-border/70 bg-canvas p-4 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          {course?.subject || "Open Space"}
        </div>
        <div className="mt-1 text-base font-medium text-text-heading">
          {course?.title || "Classroom"}
        </div>
        {(course?.instructorName || course?.owner?.name || course?.ownerName) && (
          <div className="mt-0.5 text-xs text-text-muted">
            Created by:{" "}
            {course.instructorName ||
              course.owner?.name ||
              course.ownerName}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-5 w-full h-10 text-xs font-semibold"
      >
        {isLoading ? "Joining class…" : "Join and Open Class"}
      </Button>
    </form>
  );
}
