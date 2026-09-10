import { Link } from "react-router";
import { Clock3, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";

export default function ExploreClassCard({ classroom }) {
  const activity = classroom.lastActivityAt
    ? new Date(classroom.lastActivityAt).toLocaleDateString()
    : "No recent activity";

  return (
    <Link
      to={`/dashboard/classes/${encodeURIComponent(classroom.courseId)}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <div className="h-2 w-full bg-primary" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Badge
              variant="secondary"
              className="mb-3 bg-canvas text-text-main border-border"
            >
              {classroom.subject || "General"}
            </Badge>
            <h3 className="text-lg font-bold text-text-heading line-clamp-1">
              {classroom.title}
            </h3>
          </div>
        </div>
        <div className="mt-4 flex min-h-12 flex-wrap gap-2">
          {classroom.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm text-text-muted">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted">
            <Users size={16} aria-hidden="true" />
            {classroom.enrollmentCount} learners
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={16} aria-hidden="true" />
            {activity}
          </span>
        </div>
      </div>
    </Link>
  );
}
