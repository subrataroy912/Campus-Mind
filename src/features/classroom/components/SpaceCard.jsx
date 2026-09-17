import { memo } from "react";
import { Link } from "react-router";
import { Globe, KeyRound, Lock, MessageCircle, Users } from "lucide-react";
import { formatDisplayText } from "@/utils/textFormat.js";
import { getClassTheme } from "../utils/classTheme.js";
import { classroomApi } from "../api/classroomApi.js";
import { store } from "@/app/store.js";
import { routes } from "@/routes/paths";

const SPACE_LABELS = {
  ACADEMIC_CLASS: "Class",
  STUDY_GROUP: "Study Group",
  CLUB_SOCIETY: "Club",
  PROJECT_TEAM: "Project",
  DEPARTMENT_COHORT: "Cohort",
  COMMUNITY_HUB: "Community",
};

export function SpaceCard({ classroom, space = classroom, priority = false }) {
  const currentSpace = space || classroom;
  const classTheme = getClassTheme(currentSpace);

  const handlePrefetch = () => {
    if (currentSpace?.id) {
      store.dispatch(
        classroomApi.util.prefetch("findClassroomById", currentSpace.id, {
          force: false,
        })
      );
    }
  };

  const teacherObj =
    currentSpace.instructor ||
    currentSpace.teacher ||
    (currentSpace.teacherName || currentSpace.ownerName
      ? { name: currentSpace.teacherName || currentSpace.ownerName }
      : null);
  const teacherId =
    (typeof teacherObj === "object" ? teacherObj?.id : null) ||
    currentSpace.teacherId ||
    currentSpace.ownerId ||
    null;
  const teacher = teacherObj;
  const unread = currentSpace.unreadCount ?? currentSpace.unreadMessages ?? 0;
  const spaceLabel = SPACE_LABELS[currentSpace.spaceType] || "Space";
  const category = currentSpace.subject
    ? formatDisplayText(currentSpace.subject)
    : currentSpace.role === "Created"
    ? "Lead"
    : "";
  const accessType = (
    currentSpace.accessType ||
    (currentSpace.visibility === "PUBLIC" ? "open" : "code")
  ).toLowerCase();

  return (
    <article
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      className="w-full h-full flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-surface shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      {/* Compact Banner & Floating Logo */}
      <div
        className={`relative h-20 w-full shrink-0 ${classTheme.gradientClass}`}
      >
        <div className="absolute inset-0 overflow-hidden">
          {(currentSpace.coverUrl || currentSpace.cover) && (
            <img
              src={currentSpace.coverUrl || currentSpace.cover}
              alt={`${currentSpace.title} cover`}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/15" />
        </div>

        {/* Floating Avatar */}
        <div className="absolute -bottom-5 right-3.5 z-10 h-12 w-12 overflow-hidden rounded-xl border-2 border-surface bg-canvas shadow-xs">
          {currentSpace.logo || currentSpace.logoUrl ? (
            <img
              src={currentSpace.logo || currentSpace.logoUrl}
              alt={`${currentSpace.title} avatar`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-primary/10 text-xs font-bold text-primary">
              {currentSpace.title?.slice(0, 2)?.toUpperCase() || "SP"}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between p-3.5 pt-3 min-w-0">
        <div className="pr-14 min-w-0">
          <div className="flex items-center gap-1.5 min-h-4">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
              {spaceLabel}
            </span>
            {category && (
              <span className="text-[11px] font-medium text-text-muted truncate">
                • {category}
              </span>
            )}
          </div>
          <h2
            className="mt-1 text-sm sm:text-base font-bold text-text-heading line-clamp-1"
            title={currentSpace.title}
          >
            {currentSpace.title}
          </h2>
          <p className="mt-0.5 text-xs text-text-muted line-clamp-1 min-h-4">
            {currentSpace.subtitle || currentSpace.section || "\u00A0"}
          </p>
        </div>

        {/* Stats & Teacher */}
        <div className="mt-3 flex items-center justify-between gap-1.5 border-t border-border pt-2 text-xs text-text-muted">
          {teacher?.name ? (
            teacherId ? (
              <Link
                to={routes.user(teacherId)}
                className="font-medium text-text-main hover:text-primary hover:underline transition-colors truncate max-w-30 text-xs"
                title={`with ${teacher.name}`}
              >
                with {teacher.name}
              </Link>
            ) : (
              <span
                className="font-medium text-text-main truncate max-w-30 text-xs"
                title={`with ${teacher.name}`}
              >
                with {teacher.name}
              </span>
            )
          ) : (
            <span className="text-[11px] text-text-muted italic">
              Self-paced
            </span>
          )}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            {accessType === "invite" ? (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-text-muted border border-border">
                <Lock size={10} className="text-text-muted" />
                Invite
              </span>
            ) : accessType === "open" ? (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                <Globe size={10} className="text-primary" />
                Public
              </span>
            ) : currentSpace.code ? (
              <span className="inline-flex items-center gap-0.5 rounded-md bg-canvas px-1.5 py-0.5 font-mono text-[10px] font-semibold text-text-muted border border-border">
                <KeyRound size={10} className="text-primary" />
                {currentSpace.code}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 font-medium text-xs">
              <Users size={12} />
              {currentSpace.memberCount || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Compact Footer */}
      <div className="shrink-0 flex items-center justify-between bg-canvas/50 px-3.5 py-2 border-t border-border/50 text-xs">
        <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
          <MessageCircle size={13} />
          {unread ? (
            <span className="font-semibold text-text-heading">
              {unread} new
            </span>
          ) : (
            "Up to date"
          )}
        </span>
        <Link
          className="text-xs font-bold text-primary transition-colors hover:text-primary-hover hover:underline"
          to={routes.spaces.detail(currentSpace.id)}
        >
          Open space
        </Link>
      </div>
    </article>
  );
}

export const ClassCard = memo(SpaceCard);
export default memo(SpaceCard);
