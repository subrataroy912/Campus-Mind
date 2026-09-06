import { Link } from "react-router";
import { MessageCircle, Users } from "lucide-react";

export default function ClassCard({ classroom }) {
  const teacher =
    classroom.instructor || classroom.teacher || { name: "CampusMind teacher" };
  const unread = classroom.unreadCount ?? classroom.unreadMessages ?? 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      
      {/* Banner & Floating Logo */}
      <div className={`relative h-24 w-full ${classroom.theme || "bg-primary"}`}>
        {/* Floating Avatar */}
        <div className="absolute -bottom-8 right-5 z-10 h-16 w-16 overflow-hidden rounded-full border-4 border-surface bg-canvas shadow-sm">
          <img
            src={classroom.logo || ""}
            alt={`${classroom.title} avatar`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 pt-4">
        {/* pr-16 prevents long titles from overlapping the floating avatar */}
        <div className="pr-16">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {classroom.role === "Created" ? "Teaching" : "Class"}
          </p>
          <h2 className="mt-1 text-lg font-bold text-text-heading line-clamp-1">
            {classroom.title}
          </h2>
          <p className="mt-0.5 text-sm text-text-muted line-clamp-1">
            {classroom.subtitle}
          </p>
        </div>

        {/* Stats & Teacher */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-sm text-text-muted">
          <span className="font-medium text-text-main">
            with {teacher.name}
          </span>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-canvas px-2.5 py-0.5 text-xs font-semibold text-text-main">
              {classroom.onlineCount || 0} online
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <Users size={15} />
              {classroom.memberCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between bg-canvas/60 px-5 py-3 border-t border-border/50">
        <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
          <MessageCircle size={15} />
          {unread ? (
            <span className="font-semibold text-text-heading">{unread} new</span>
          ) : (
            "Up to date"
          )}
        </span>
        <Link
          className="text-sm font-bold text-primary transition-colors hover:text-primary-hover hover:underline"
          to={`/dashboard/classes/${classroom.id}`}
        >
          Open class
        </Link>
      </div>
    </article>
  );
}