import { memo, useContext } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { getSharedClassCount } from "@/utils/sharedClasses.js";
import { initials } from "@/utils/initials.js";
import { profileApi } from "@/features/profile/api/profileApi.js";
import { store } from "@/app/store.js";
import { routes } from "@/routes/paths.js";
import { Link } from "react-router";
import { AuthContext } from "@/context/AuthContext.jsx";

function ExplorePersonCard({ person, currentUser: propCurrentUser }) {
  const auth = useContext(AuthContext);
  const currentUser = propCurrentUser !== undefined ? propCurrentUser : auth?.user;
  const sharedClassCount =
    person?.sharedCoursesCount ?? getSharedClassCount(currentUser, person);
  const mutualPeersCount = person?.mutualPeersCount ?? 0;
  const isSameDepartment =
    person?.sameDepartment ??
    Boolean(
      currentUser?.department &&
        person?.department &&
        currentUser.department.trim().toLowerCase() ===
          person.department.trim().toLowerCase()
    );
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
        className="group flex h-full flex-col justify-between rounded-lg border border-border/70 bg-surface/90 p-2.5 shadow-2xs transition-all hover:border-border hover:bg-surface hover:shadow-xs"
      >
        <div className="flex items-center gap-2">
          {person.avatar ? (
            <img
              src={person.avatar}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-7 w-7 rounded-full border border-border/80 object-cover shrink-0"
            />
          ) : (
            <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary shrink-0">
              {initials(person.name || "CampusMind member")}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-semibold text-text-heading leading-tight group-hover:text-primary transition-colors">
              {person.name || "CampusMind member"}
            </h3>
            <p className="truncate text-[10px] text-text-muted leading-tight">
              @
              {person.handle ||
                person.name?.replaceAll(" ", "").toLowerCase() ||
                "member"}
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <Badge
            variant="secondary"
            className="bg-canvas text-text-main border-border/60 text-[9.5px] px-1.5 py-0.5 inline-flex items-center gap-1 font-medium max-w-[140px]"
          >
            <span className="truncate">{person.department || "CampusMind learner"}</span>
            {person.canCreateCourses && (
              <Sparkles
                size={10}
                className="fill-amber-500 text-amber-500 shrink-0"
                aria-label="Course Creator"
              />
            )}
          </Badge>
          {sharedClassCount > 0 ? (
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[9.5px] font-medium text-primary border border-primary/20 whitespace-nowrap">
              {`Shares ${sharedClassCount} ${sharedClassCount === 1 ? "Space" : "Spaces"} with you`}
            </span>
          ) : mutualPeersCount > 0 ? (
            <span className="rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 text-[9.5px] font-medium border border-indigo-500/20 whitespace-nowrap">
              {mutualPeersCount === 1
                ? "1 mutual space peer"
                : `${mutualPeersCount} mutual space peers`}
            </span>
          ) : null}
          {isSameDepartment && (
            <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 text-[9.5px] font-medium border border-emerald-500/20 whitespace-nowrap">
              Same Department
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

export default memo(ExplorePersonCard);
