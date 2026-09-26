import { Link } from "react-router";
import { routes } from "@/routes/paths.js";
import { SpaceAvatar } from "@/features/spaces/components/SpaceAvatar.jsx";
import { MessageRoleBadge } from "./MessageRoleBadge.jsx";
import { formatLastActive } from "@/utils/formatLastActive.js";

export function MessagePresenceMemberItem({
  member,
  isCurrentUser = false,
  isOnline = false,
}) {
  const mName = member.name || member.displayName || "Space Member";

  return (
    <Link
      to={routes.user(member.userId)}
      className={`flex items-center justify-between gap-2 rounded-md px-1.5 py-1 transition ${
        isOnline
          ? "hover:bg-canvas"
          : "opacity-75 hover:opacity-100 hover:bg-canvas"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div className="relative shrink-0">
          <SpaceAvatar
            avatar={member.avatarUrl || member.avatar}
            name={mName}
            userId={member.userId}
            size="h-6 w-6"
          />
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-surface ${
              isOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
            }`}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-text-heading">
            {mName}
            {isCurrentUser && (
              <span className="ml-1 text-[10px] text-text-muted">(You)</span>
            )}
          </p>
          {isOnline ? (
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
              Online now
            </p>
          ) : (
            <p className="text-[10px] text-text-muted">
              {formatLastActive(member.lastActiveAt, false)}
            </p>
          )}
        </div>
      </div>
      <MessageRoleBadge role={member.role} />
    </Link>
  );
}
