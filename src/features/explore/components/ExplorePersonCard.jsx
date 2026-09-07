import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { getSharedClassCount } from "@/utils/sharedClasses.js";
import { initials } from "@/utils/initials.js";

export default function ExplorePersonCard({ person, currentUser }) {
  const sharedClassCount = getSharedClassCount(currentUser, person);
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start gap-3">
        {person.avatar ? <img src={person.avatar} alt="" className="h-12 w-12 rounded-full border border-border object-cover" /> : <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 font-semibold text-primary">{initials(person.name || "CampusMind member")}</div>}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-text-heading">{person.name || "CampusMind member"}</h3>
          <p className="truncate text-sm text-text-muted">@{person.handle || person.name?.replaceAll(" ", "").toLowerCase() || "member"}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-canvas text-text-main border-border">{person.department || "CampusMind learner"}</Badge>
        {sharedClassCount > 0 && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Shares {sharedClassCount} {sharedClassCount === 1 ? "class" : "classes"} with you</span>}
      </div>
      <div className="mt-6 flex gap-2 border-t border-border pt-4">
        <Button to={`/dashboard/profile/${person.id}`} variant="outline" size="sm">View profile</Button>
        {sharedClassCount > 0 && <Button to="/dashboard/messages" size="sm"><MessageCircle aria-hidden="true" />Message</Button>}
      </div>
    </article>
  );
}
