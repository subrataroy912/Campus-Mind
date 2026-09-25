import { memo } from "react";
import { initials } from "@/utils/initials.js";
import { profileApi } from "@/features/profile/api/profileApi.js";
import { store } from "@/app/store.js";
import { routes } from "@/routes/paths.js";
import { Link } from "react-router";

function ExplorePersonCard({ person }) {
  const mutualPeersCount = person?.mutualPeersCount ?? 0;
  const sharedCoursesCount = person?.sharedCoursesCount ?? 0;
  const connectionSubtitle =
    mutualPeersCount > 0
      ? `${mutualPeersCount} mutual friend${mutualPeersCount === 1 ? "" : "s"}`
      : sharedCoursesCount > 0
        ? `${sharedCoursesCount} shared space${sharedCoursesCount === 1 ? "" : "s"}`
        : "";

  const handlePrefetch = () => {
    if (person?.id) {
      store.dispatch(
        profileApi.util.prefetch("getPublicProfile", person.id, {
          force: false,
        }),
      );
    }
  };

  return (
    <Link to={routes.user(person.id)}>
      <article
        onMouseEnter={handlePrefetch}
        onFocus={handlePrefetch}
        className="group flex flex-col justify-center rounded-lg border border-border/70 bg-surface/90 px-3 py-2.5 shadow-2xs transition-all hover:border-border hover:bg-surface hover:shadow-xs min-h-[56px]"
      >
        <div className="flex items-center gap-2.5">
          {person.avatar ? (
            <img
              src={person.avatar}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-8 w-8 rounded-full border border-border/80 object-cover shrink-0"
            />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary shrink-0">
              {initials(person.name || "CampusMind member")}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[13px] sm:text-sm font-semibold text-text-heading leading-tight group-hover:text-primary transition-colors">
              {person.name || "CampusMind member"}
            </h3>
            {connectionSubtitle && (
              <p className="text-[10px] sm:text-[11px] text-text-muted leading-tight mt-0.5">
                {connectionSubtitle}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default memo(ExplorePersonCard);
