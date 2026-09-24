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
        className="flex h-full flex-col rounded-lg border border-border/80 bg-surface p-3 shadow-xs transition hover:border-border hover:shadow-sm"
      >
        <div className="flex items-start gap-2.5">
          {person.avatar ? (
            <img
              src={person.avatar}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-8 w-8 rounded-full border border-border/80 object-cover shrink-0"
            />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
              {initials(person.name || "CampusMind member")}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-semibold text-text-heading">
              {person.name || "CampusMind member"}
            </h3>
            <p className="truncate text-[11px] text-text-muted">
              @
              {person.handle ||
                person.name?.replaceAll(" ", "").toLowerCase() ||
                "member"}
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <Badge
            variant="secondary"
            className="bg-canvas text-text-main border-border/60 text-[10px] px-2 py-0.5 inline-flex items-center gap-1 font-medium"
          >
            <span>{person.department || "CampusMind learner"}</span>
            {person.canCreateCourses && (
              <Sparkles
                size={11}
                className="fill-amber-500 text-amber-500 shrink-0"
                aria-label="Course Creator"
              />
            )}
          </Badge>
          {sharedClassCount > 0 ? (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary border border-primary/20">
              {`Shares ${sharedClassCount} ${sharedClassCount === 1 ? "Space" : "Spaces"} with you`}
            </span>
          ) : mutualPeersCount > 0 ? (
            <span className="rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 text-[10px] font-medium border border-indigo-500/20">
              {mutualPeersCount === 1
                ? "1 mutual space peer"
                : `${mutualPeersCount} mutual space peers`}
            </span>
          ) : null}
          {isSameDepartment && (
            <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px] font-medium border border-emerald-500/20">
              Same Department
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}

export default memo(ExplorePersonCard);
