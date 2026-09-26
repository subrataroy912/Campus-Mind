import { Users } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessagePresenceMemberItem } from "./MessagePresenceMemberItem.jsx";

export function MessagePresencePopover({
  onlineMembers = [],
  offlineMembers = [],
  activeOnlineCount = 1,
  currentUserId,
}) {
  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex truncate items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition cursor-pointer"
        title="View online space members"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <Users className="h-2.5 w-2.5" />
        <span>{activeOnlineCount} online</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2.5 space-y-2.5">
        <div className="flex items-center justify-between border-b border-border/70 pb-1.5">
          <span className="text-[11px] font-semibold text-text-heading">
            Space Presence
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {activeOnlineCount} online
          </span>
        </div>

        <div className="max-h-56 space-y-1.5 overflow-y-auto pr-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Online Now ({onlineMembers.length || activeOnlineCount})
          </p>
          {onlineMembers.length === 0 ? (
            <p className="py-1 text-[11px] text-text-muted">
              You are currently active in this space.
            </p>
          ) : (
            onlineMembers.map((member) => (
              <MessagePresenceMemberItem
                key={member.userId}
                member={member}
                isCurrentUser={
                  String(member.userId) === String(currentUserId)
                }
                isOnline={true}
              />
            ))
          )}

          {offlineMembers.length > 0 && (
            <>
              <p className="pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Offline ({offlineMembers.length})
              </p>
              {offlineMembers.map((member) => (
                <MessagePresenceMemberItem
                  key={member.userId}
                  member={member}
                  isCurrentUser={
                    String(member.userId) === String(currentUserId)
                  }
                  isOnline={false}
                />
              ))}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
