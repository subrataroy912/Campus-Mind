import { memo } from "react";
import { Link } from "react-router";
import { Globe, Lock, MessageCircle, Users } from "lucide-react";
import { formatDisplayText } from "@/utils/textFormat.js";
import { getClassTheme } from "../utils/classTheme.js";
import { isSpaceOwner } from "../utils/roles.js";
import { classroomApi } from "../api/classroomApi.js";
import { courseworkApi } from "../api/courseworkApi.js";
import { store } from "@/app/store.js";
import { routes } from "@/routes/paths";
import { useAuth } from "@/context/AuthContext.jsx";

function SpaceCard({ classroom, priority = false }) {
  const classTheme = getClassTheme(classroom);

  const { user: currentUser } = useAuth();

  const isOwner = isSpaceOwner(classroom, currentUser?.id);

  const handlePrefetch = () => {
    if (classroom?.id) {
      store.dispatch(
        classroomApi.util.prefetch("findClassroomById", classroom.id, {
          force: false,
        }),
      );
      store.dispatch(
        courseworkApi.util.prefetch(
          "getCourseworkList",
          { courseId: classroom.id, page: 0, size: 20 },
          { force: false },
        ),
      );
    }
  };

  const ownerObj =
    classroom.owner ||
    (classroom.ownerName ? { name: classroom.ownerName } : null);
  const owner = ownerObj;

  const unread = classroom.unreadCount ?? classroom.unreadMessages ?? 0;

  const category = classroom.subject
    ? formatDisplayText(classroom.subject)
    : classroom.role === "Created"
      ? "Lead"
      : "";

  const accessType = (classroom.accessType || "PUBLIC").toUpperCase();
  const isPrivate = accessType === "PRIVATE";
  const isInvite =
    accessType === "INVITE" ||
    accessType === "LINK_ONLY" ||
    accessType === "CODE";
  const isPublic = accessType === "PUBLIC" || accessType === "OPEN";

  return (
    <Link
      to={routes.spaces.detail(classroom.id)}
      prefetch="intent"
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      aria-label={`Open ${classroom.title}`}
      className="group block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
    >
      <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xs transition-all duration-200 hover:border-border hover:shadow-xs">
        {/* 70% Banner Section */}
        <div
          className={`relative h-40 sm:h-44 w-full shrink-0 overflow-hidden ${classTheme.gradientClass}`}
        >
          {(classroom.coverUrl || classroom.cover) && (
            <img
              src={classroom.coverUrl || classroom.cover}
              alt={`${classroom.title} cover`}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Top Row inside Banner: Badges */}
          <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
            <span className="inline-flex items-center rounded-md bg-black/40 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white border border-white/20">
              {"Space"}
            </span>
            {isPrivate ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-black/50 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white border border-white/20">
                <Lock size={10} />
                Private
              </span>
            ) : isInvite ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-black/50 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white border border-white/20">
                <Lock size={10} />
                Invite
              </span>
            ) : isPublic ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow-2xs">
                <Globe size={10} />
                Public
              </span>
            ) : null}
          </div>

          {/* Bottom Bar inside Banner: Avatar and unread indicator */}
          <div className="absolute bottom-2.5 inset-x-2.5 flex items-end justify-between z-10">
            <div className="h-9 w-9 overflow-hidden rounded-xl border-2 border-card bg-background shadow-xs">
              {classroom.logo || classroom.logoUrl ? (
                <img
                  src={classroom.logo || classroom.logoUrl}
                  alt={`${classroom.title} avatar`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-primary/10 text-[10px] font-bold text-primary">
                  {classroom.title?.slice(0, 2)?.toUpperCase() || "SP"}
                </div>
              )}
            </div>

            <span className="inline-flex items-center gap-1 rounded-md bg-black/50 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium text-white border border-white/20">
              <MessageCircle size={11} />
              {unread ? (
                <span className="font-semibold text-amber-300">
                  {unread} new
                </span>
              ) : (
                "Up to date"
              )}
            </span>
          </div>
        </div>

        {/* 30% Text & Metadata Content */}
        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 min-w-0 bg-card">
          <div className="min-w-0">
            {category && (
              <div className="text-[10px] font-semibold uppercase tracking-wider text-primary truncate">
                {category}
              </div>
            )}
            <h2
              className="mt-0.5 text-xs sm:text-sm font-semibold text-foreground line-clamp-1 leading-snug group-hover:text-primary transition-colors"
              title={classroom.title}
            >
              {classroom.title}
            </h2>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {classroom.subtitle || classroom.section || "\u00A0"}
            </p>
          </div>

          {/* Bottom Row: Owner & Member Count */}
          <div className="mt-2 flex items-center justify-between gap-1.5 border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
            {/* UPDATED LOGIC HERE */}
            {isOwner ? (
              <span
                className="font-medium text-foreground truncate max-w-36 text-[11px]"
                title="Created by You"
              >
                By You
              </span>
            ) : owner?.name ? (
              <span
                className="font-medium text-foreground truncate max-w-36 text-[11px]"
                title={`by ${owner.name}`}
              >
                by {owner.name}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground italic">
                Self-paced
              </span>
            )}
            {/* END UPDATED LOGIC */}

            <span className="inline-flex shrink-0 items-center gap-1 font-medium text-[11px]">
              <Users size={11} />
              {classroom.memberCount || 0}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default memo(SpaceCard);
