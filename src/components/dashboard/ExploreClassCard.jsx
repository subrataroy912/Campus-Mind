import { Link } from "react-router";
import { Flame, Users } from "lucide-react";
import { Badge } from "../ui/badge.jsx";
import { Button } from "../ui/button.jsx";

export default function ExploreClassCard({ classroom }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`h-1.5 ${classroom.theme}`} />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="secondary">{classroom.subject}</Badge>
            <h3 className="mt-3 text-base font-semibold text-text-heading">
              {classroom.title}
            </h3>
            <p className="mt-1 text-sm text-text-muted">
              {classroom.subtitle} · {classroom.instructor.name}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
            <Flame size={14} aria-hidden="true" />
            {classroom.popularity}
          </span>
        </div>
        <p className="mt-4 text-sm leading-6 text-text-muted">
          {classroom.description}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="inline-flex items-center gap-1 text-sm text-text-muted">
            <Users size={15} aria-hidden="true" />
            {classroom.memberCount} learners
          </span>
          <Button to={`/dashboard/class/join?code=${classroom.code}`} size="sm">
            Join class
          </Button>
        </div>
      </div>
    </article>
  );
}
