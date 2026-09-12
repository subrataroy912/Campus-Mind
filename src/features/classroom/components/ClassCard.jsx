import { Link } from "react-router";
import { Globe, KeyRound, Lock, MessageCircle, Users } from "lucide-react";
import { formatDisplayText } from "@/utils/textFormat.js";
import { getClassTheme } from "../utils/classTheme.js";

export default function ClassCard({ classroom }) {
  const classTheme = getClassTheme(classroom);
  const teacher =
    classroom.instructor ||
    classroom.teacher ||
    (classroom.teacherName || classroom.ownerName
      ? { name: classroom.teacherName || classroom.ownerName }
      : null);
  const unread = classroom.unreadCount ?? classroom.unreadMessages ?? 0;
  const category = classroom.subject
    ? formatDisplayText(classroom.subject)
    : classroom.role === "Created"
    ? "Teaching"
    : "";
  const accessType = (
    classroom.accessType ||
    (classroom.visibility === "PUBLIC" ? "open" : "code")
  ).toLowerCase();

  return (
    <article className="w-full h-full flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      
      {/* Banner & Floating Logo */}
      <div className={`relative h-24 w-full shrink-0 ${classTheme.gradientClass}`}>
        <div className="absolute inset-0 overflow-hidden">
          {(classroom.coverUrl || classroom.cover) && (
            <img
              src={classroom.coverUrl || classroom.cover}
              alt={`${classroom.title} cover`}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/15" />
        </div>
        {/* Floating Avatar */}
        <div className="absolute -bottom-8 right-5 z-10 h-16 w-16 overflow-hidden rounded-full border-4 border-surface bg-canvas shadow-sm">
          {classroom.logo || classroom.logoUrl ? (
            <img
              src={classroom.logo || classroom.logoUrl}
              alt={`${classroom.title} avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-primary/10 text-sm font-bold text-primary">
              {classroom.title?.slice(0, 2)?.toUpperCase() || "CL"}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between p-5 pt-4 min-w-0">
        {/* pr-16 prevents long titles from overlapping the floating avatar */}
        <div className="pr-16 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary truncate min-h-[1rem]">
            {category || "\u00A0"}
          </p>
          <h2
            className="mt-1 text-lg font-bold text-text-heading line-clamp-1"
            title={classroom.title}
          >
            {classroom.title}
          </h2>
          <p className="mt-0.5 text-sm text-text-muted line-clamp-1 min-h-[1.25rem]">
            {classroom.subtitle || classroom.section || "\u00A0"}
          </p>
        </div>

        {/* Stats & Teacher */}
        <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4 text-sm text-text-muted">
          {teacher?.name ? (
            <span
              className="font-medium text-text-main truncate max-w-[130px] sm:max-w-[150px] text-xs sm:text-sm"
              title={`with ${teacher.name}`}
            >
              with {teacher.name}
            </span>
          ) : (
            <span className="text-xs text-text-muted italic">Self-paced</span>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {accessType === "invite" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-0.5 text-xs font-medium text-text-muted">
                <Lock size={11} className="text-text-muted" />
                Invite only
              </span>
            ) : accessType === "open" ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <Globe size={11} className="text-primary" />
                Public
              </span>
            ) : classroom.code ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-0.5 font-mono text-xs font-semibold text-text-muted">
                <KeyRound size={11} className="text-primary" />
                {classroom.code}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 font-medium text-xs sm:text-sm">
              <Users size={14} />
              {classroom.memberCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="shrink-0 flex items-center justify-between bg-canvas/60 px-5 py-3 border-t border-border/50">
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