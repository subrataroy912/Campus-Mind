import { Clock, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";

function formatExpiryHours(expiresAt) {
  if (!expiresAt) return "Expires in 48 hours";
  try {
    const target = new Date(expiresAt).getTime();
    const diffMs = target - Date.now();
    if (diffMs <= 0) return "Expired";
    const hours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (hours < 24) return `Expires in ${hours} hour${hours === 1 ? "" : "s"}`;
    const days = Math.ceil(hours / 24);
    return `Expires in ${days} day${days === 1 ? "" : "s"}`;
  } catch {
    return "Expires in 48 hours";
  }
}

export function InvitePreviewCard({ inviteData, onJoin, isLoading = false }) {
  return (
    <div className="space-y-4">
      {inviteData?.coverUrl && (
        <div className="h-28 w-full overflow-hidden rounded-xl bg-muted/40">
          <img
            src={inviteData.coverUrl}
            alt={inviteData.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="flex items-start gap-3">
        {inviteData?.logoUrl ? (
          <img
            src={inviteData.logoUrl}
            alt={inviteData.title}
            className="h-12 w-12 rounded-xl object-cover border border-border shrink-0"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary shrink-0">
            {inviteData?.title?.slice(0, 2)?.toUpperCase() || "SP"}
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-0.5">
          <h2 className="text-base font-bold text-text-heading truncate">
            {inviteData?.title}
          </h2>
          <p className="text-xs text-text-muted truncate">
            {inviteData?.subject ? `${inviteData.subject} • ` : ""}
            by {inviteData?.ownerName || "Space Owner"}
          </p>
        </div>
      </div>

      {inviteData?.description && (
        <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
          {inviteData.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-xs text-text-muted border border-border/60">
          <Users className="h-3 w-3 text-primary" />
          <span>{inviteData?.memberCount ?? 0} members</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-300 border border-amber-500/20">
          <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
          <span>{formatExpiryHours(inviteData?.expiresAt)}</span>
        </span>
      </div>

      <Button
        onClick={onJoin}
        disabled={isLoading}
        className="w-full h-10 text-xs font-semibold gap-1.5"
      >
        <UserPlus className="h-3.5 w-3.5" />
        <span>{isLoading ? "Joining space…" : "Join Space"}</span>
      </Button>
    </div>
  );
}
