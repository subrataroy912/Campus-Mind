import { memo } from "react";
import { Link } from "react-router";
import { ChevronRight, Globe, Lock, MessageCircle, Users } from "lucide-react";
import { formatDisplayText } from "@/utils/textFormat.js";
import { getClassTheme } from "../utils/classTheme.js";
import { classroomApi } from "../api/classroomApi.js";
import { store } from "@/app/store.js";
import { routes } from "@/routes/paths.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { cn } from "@/lib/utils.js";

function CompactSpaceRow({ classroom, className = "" }) {
  const classTheme = getClassTheme(classroom);
  const { user: currentUser } = useAuth();

  const role = String(classroom?.role || "").toUpperCase();
  const isOwner =
    role === "OWNER" ||
    role === "CREATED" ||
    (currentUser?.id && classroom?.ownerId === currentUser.id);
  const isAdmin = !isOwner && role === "ADMIN";

  const handlePrefetch = () => {
    if (classroom?.id) {
      store.dispatch(
        classroomApi.util.prefetch("findClassroomById", classroom.id, {
          force: false,
        }),
      );
    }
  };

  const unread = classroom?.unreadCount ?? classroom?.unreadMessages ?? 0;
  const accessType = String(classroom?.accessType || "PUBLIC").toUpperCase();
  const isPublic = accessType === "PUBLIC" || accessType === "OPEN";
  const isInvite =
    accessType === "INVITE" ||
    accessType === "LINK_ONLY" ||
    accessType === "PRIVATE";

  const subject = classroom?.subject
    ? formatDisplayText(classroom.subject)
    : "";

  const titleInitials =
    classroom?.title
      ?.split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SP";

  return (
    <Link
      to={routes.spaces.detail(classroom.id)}
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      aria-label={`Open ${classroom.title}`}
      className={cn(
        "group block w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-xl transition-all",
        className,
      )}
    >
      <article className="flex h-14 w-full items-center justify-between gap-3 px-3 rounded-xl border border-border/70 bg-card hover:bg-muted/30 hover:border-border transition-colors">
        {/* Left: Avatar + Title & Meta */}
        <div className="flex min-w-0 items-center gap-2.5">
          {/* 36px Avatar / Icon */}
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted shadow-2xs">
            {classroom.logo || classroom.logoUrl ? (
              <img
                src={classroom.logo || classroom.logoUrl}
                alt={`${classroom.title} logo`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className={`grid h-full w-full place-items-center text-[10px] font-bold text-white ${classTheme.gradientClass}`}
              >
                {titleInitials}
              </div>
            )}
          </div>

          {/* Text stack */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className="text-xs sm:text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors"
                title={classroom.title}
              >
                {classroom.title}
              </span>

              {/* Role badge */}
              {isOwner ? (
                <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.2 text-[10px] font-semibold text-primary">
                  Owner
                </span>
              ) : isAdmin ? (
                <span className="shrink-0 rounded-md bg-secondary/15 px-1.5 py-0.2 text-[10px] font-semibold text-secondary">
                  Admin
                </span>
              ) : (
                <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                  Member
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
              {subject ? (
                <span className="truncate">{subject}</span>
              ) : (
                <span className="truncate">
                  {classroom.subtitle || classroom.section || "Space"}
                </span>
              )}

              {isInvite && (
                <>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <Lock size={9} aria-hidden="true" />
                    <span>Invite</span>
                  </span>
                </>
              )}
              {isPublic && (
                <>
                  <span className="text-muted-foreground/60">•</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                    <Globe size={9} aria-hidden="true" />
                    <span>Public</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Stats & Chevron */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Member count */}
          <div
            className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium"
            title={`${classroom.memberCount || 0} members`}
          >
            <Users size={12} aria-hidden="true" />
            <span>{classroom.memberCount || 0}</span>
          </div>

          {/* Unread badge */}
          {unread > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              <MessageCircle size={10} aria-hidden="true" />
              <span>{unread} new</span>
            </span>
          )}

          {/* Trailing arrow */}
          <ChevronRight
            size={14}
            className="text-muted-foreground/70 group-hover:text-foreground group-hover:translate-x-0.5 transition-all"
            aria-hidden="true"
          />
        </div>
      </article>
    </Link>
  );
}

export default memo(CompactSpaceRow);
