import { memo } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { getSharedClassCount } from "@/utils/sharedClasses.js";
import { initials } from "@/utils/initials.js";
import { profileApi } from "@/features/profile/api/profileApi.js";
import { store } from "@/app/store.js";
import { routes } from "@/routes/paths.js";

function ExplorePersonCard({ person, currentUser }) {
  const sharedClassCount = getSharedClassCount(currentUser, person);

  const handlePrefetch = () => {
    if (person?.id) {
      store.dispatch(
        profileApi.util.prefetch("getPublicProfile", person.id, {
          force: false,
        })
      );
    }
  };

  return (
    <article
      onMouseEnter={handlePrefetch}
      onFocus={handlePrefetch}
      className="flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-xs transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {person.avatar ? (
          <img
            src={person.avatar}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-10 w-10 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
            {initials(person.name || "CampusMind member")}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-text-heading">
            {person.name || "CampusMind member"}
          </h3>
          <p className="truncate text-sm text-text-muted">
            @{person.handle || person.name?.replaceAll(" ", "").toLowerCase() || "member"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-canvas text-text-main border-border inline-flex items-center gap-1">
          <span>{person.department || "CampusMind learner"}</span>
          {person.canCreateCourses && (
            <Sparkles size={12} className="fill-amber-500 text-amber-500 shrink-0" aria-label="Course Creator" />
          )}
        </Badge>
        {sharedClassCount > 0 && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Shares {sharedClassCount} {sharedClassCount === 1 ? "class" : "classes"} with you</span>}
      </div>
      <div className="mt-4 flex gap-2 border-t border-border pt-3">
        <Button to={routes.user(person.id)} variant="outline" size="sm">View profile</Button>
        <Button to={`${routes.messages}?member=${person.id}`} size="sm" className="gap-1.5"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /><span>Message</span></Button>
      </div>
    </article>
  );
}

export default memo(ExplorePersonCard);
