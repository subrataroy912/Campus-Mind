import { Link } from "react-router";
import { Flame, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";

export default function ExploreClassCard({ classroom }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/40">
      {/* Top accent line */}
      <div className={`h-2 w-full ${classroom.theme || "bg-secondary"}`} />

      <div className="flex flex-1 flex-col p-5">
        {/* Header: Subject, Title, and Logo */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Badge
              variant="secondary"
              className="mb-3 bg-canvas text-text-main border-border"
            >
              {classroom.subject}
            </Badge>
            <h3 className="text-lg font-bold text-text-heading line-clamp-1">
              {classroom.title}
            </h3>
            <p className="mt-0.5 text-sm text-text-muted line-clamp-1">
              {classroom.subtitle}
            </p>
          </div>

          {/* Class Logo */}
          <div className="shrink-0">
            <div className="h-14 w-14 overflow-hidden rounded-4xl border border-border bg-canvas shadow-sm">
              <img
                src={
                  classroom.logo ||
                  "https://testingbot.com/free-online-tools/random-avatar/100"
                }
                alt={`${classroom.title} logo`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Instructor & Popularity */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-text-main">
            By {classroom.instructor?.name || "CampusMind Teacher"}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-focus/10 px-2.5 py-1 text-xs font-bold text-focus">
            <Flame size={14} aria-hidden="true" />
            {classroom.popularity}
          </span>
        </div>

        {/* Description (flex-1 pushes the footer to the bottom evenly) */}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted line-clamp-2">
          {classroom.description}
        </p>

        {/* Footer: Stats & Action */}
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted">
            <Users size={16} aria-hidden="true" />
            {classroom.memberCount || 0} learners
          </span>

          {/* Note: If your Button component doesn't support the 'to' prop out of the box, 
              wrap it in a <Link to="..."> instead. */}
          <Button
            to={`/dashboard/class/join?code=${classroom.code}`}
            size="sm"
            className="bg-primary text-white hover:bg-primary-hover transition-colors"
          >
            Join class
          </Button>
        </div>
      </div>
    </article>
  );
}
