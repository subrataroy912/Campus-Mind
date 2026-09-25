import { Globe, KeyRound, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const ACCESS_TYPES = Object.freeze({
  PUBLIC: "PUBLIC",
  OPEN: "OPEN",
  PRIVATE: "PRIVATE",
  LINK_ONLY: "LINK_ONLY",
  CODE: "CODE",
  INVITE: "INVITE",
});

export function AccessBadge({ accessType = ACCESS_TYPES.PUBLIC, className = "" }) {
  const normalized = (accessType || ACCESS_TYPES.PUBLIC).toUpperCase();

  if (normalized === ACCESS_TYPES.PRIVATE) {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "inline-flex h-auto items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/80 text-zinc-100 backdrop-blur-xs border border-white/10 shadow-xs",
          className
        )}
      >
        <Lock size={10} aria-hidden="true" />
        <span>Private</span>
      </Badge>
    );
  }

  if (normalized === ACCESS_TYPES.INVITE || normalized === ACCESS_TYPES.LINK_ONLY) {
    return (
      <Badge
        variant="secondary"
        className={cn(
          "inline-flex h-auto items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/80 text-zinc-100 backdrop-blur-xs border border-white/10 shadow-xs",
          className
        )}
      >
        <Lock size={10} aria-hidden="true" />
        <span>Invite only</span>
      </Badge>
    );
  }

  if (normalized === ACCESS_TYPES.CODE) {
    return (
      <Badge
        variant="default"
        className={cn(
          "inline-flex h-auto items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-amber-600/90 text-white backdrop-blur-xs shadow-xs",
          className
        )}
      >
        <KeyRound size={10} aria-hidden="true" />
        <span>Code</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="default"
      className={cn(
        "inline-flex h-auto items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs",
        className
      )}
    >
      <Globe size={10} aria-hidden="true" />
      <span>Public</span>
    </Badge>
  );
}

export default AccessBadge;