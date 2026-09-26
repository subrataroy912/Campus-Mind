import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MessageRoleBadge({ role }) {
  const normalized = (role || "").toUpperCase();
  if (normalized === "OWNER") {
    return (
      <Badge
        variant="secondary"
        className="inline-flex items-center gap-0.5 rounded bg-amber-500/15 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 border-0"
      >
        <Shield className="h-2.5 w-2.5" />
        Owner
      </Badge>
    );
  }
  if (normalized === "ADMIN") {
    return (
      <Badge
        variant="secondary"
        className="inline-flex items-center gap-0.5 rounded bg-primary/15 px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wide text-primary border-0"
      >
        <Shield className="h-2.5 w-2.5" />
        Admin
      </Badge>
    );
  }
  return null;
}
