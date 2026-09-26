import { Link } from "react-router";
import { ArrowLeft, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/routes/paths.js";
import { SpaceAvatar } from "@/features/spaces/components/SpaceAvatar.jsx";
import { MessageRoleBadge } from "./MessageRoleBadge.jsx";
import { MessagePresencePopover } from "./MessagePresencePopover.jsx";

export function MessageThreadHeader({
  room,
  userRole,
  isConnected,
  onlineMembers = [],
  offlineMembers = [],
  activeOnlineCount = 1,
  currentUserId,
  onBack,
}) {
  const roomSubtitle = room?.subtitle || room?.section || room?.subject || "";

  return (
    <div className="flex items-center justify-between gap-2.5 border-b border-border/70 px-3 py-2.5 bg-surface">
      <div className="flex items-center gap-2.5 min-w-0">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onBack}
          className="min-h-9 min-w-9 sm:min-h-8 sm:min-w-8 inline-flex items-center justify-center rounded-md p-1 text-text-main hover:bg-canvas lg:hidden cursor-pointer"
          aria-label="Back to space chats"
        >
          <ArrowLeft size={18} />
        </Button>

        <Link to={routes.spaces.detail(room.spaceId)} className="shrink-0">
          <div className="relative shrink-0">
            <SpaceAvatar
              avatar={room.logoUrl}
              name={room.title}
              size="h-8 w-8"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500" />
          </div>
        </Link>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-xs sm:text-sm font-semibold text-text-heading">
              {room.title}
            </p>
            <MessageRoleBadge role={userRole} />
          </div>

          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span className="inline-flex items-center gap-1">
              {isConnected ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <Wifi className="h-3 w-3 text-emerald-500" />
                  <span>Live chat</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <WifiOff className="h-3 w-3 text-amber-500" />
                  <span>Connecting…</span>
                </>
              )}
            </span>

            <span>•</span>

            <MessagePresencePopover
              onlineMembers={onlineMembers}
              offlineMembers={offlineMembers}
              activeOnlineCount={activeOnlineCount}
              currentUserId={currentUserId}
            />

            {roomSubtitle && (
              <>
                <span>•</span>
                <span className="truncate">{roomSubtitle}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
