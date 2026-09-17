import { GraduationCap, Zap, Flame, Vote, Award } from "lucide-react";
import { REPUTATION_BADGES } from "./reputationConstants.js";
import { cn } from "@/lib/utils.js";

const ICON_MAP = {
  GraduationCap,
  Zap,
  Flame,
  Vote,
};

export function ReputationBadge({
  badgeId = "SCHOLAR",
  size = "sm",
  className = "",
}) {
  const meta = REPUTATION_BADGES[badgeId];
  if (!meta) return null;

  const Icon = ICON_MAP[meta.iconName] || Award;

  return (
    <span
      data-slot="reputation-badge"
      title={`${meta.title}: ${meta.description}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold select-none transition-transform hover:scale-105",
        meta.badgeClass,
        size === "sm" && "px-2 py-0.5 text-[11px]",
        size === "md" && "px-2.5 py-1 text-xs",
        size === "lg" && "px-3 py-1.5 text-sm",
        className
      )}
    >
      <Icon
        className={cn(
          "shrink-0",
          size === "sm" && "h-3 w-3",
          size === "md" && "h-3.5 w-3.5",
          size === "lg" && "h-4 w-4"
        )}
        aria-hidden="true"
      />
      <span>{meta.title}</span>
    </span>
  );
}

export default ReputationBadge;
