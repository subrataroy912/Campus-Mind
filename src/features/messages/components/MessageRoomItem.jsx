import { Badge } from "@/components/ui/badge";
import { SpaceAvatar } from "@/features/spaces/components/SpaceAvatar.jsx";
import { formatChatTime } from "@/utils/dateFormat.js";

export function MessageRoomItem({ room, active = false, onSelect }) {
  const lastMsg = room.lastMessage;
  const senderPrefix =
    room.lastMessageSender || lastMsg?.sender?.username
      ? `${room.lastMessageSender || lastMsg?.sender?.username}: `
      : "";
  const bodyPreview =
    room.lastMessageText ||
    lastMsg?.content ||
    (lastMsg?.attachments?.length ? "Shared an attachment" : "");
  const previewText = bodyPreview
    ? `${senderPrefix}${bodyPreview}`
    : "No messages yet — say hello!";
  const lastTime = room.lastMessageAt || lastMsg?.timestamp;
  const roomSubtitle = room.subtitle || room.section || room.subject || "";
  const onlineCount = Math.max(
    1,
    Number(room.onlineCount) ||
      (Array.isArray(room.onlineUserIds) ? room.onlineUserIds.length : 1),
  );

  return (
    <button
      type="button"
      onClick={() => onSelect?.(room.spaceId)}
      className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition cursor-pointer ${
        active
          ? "bg-primary/10 text-primary ring-1 ring-primary/20"
          : "hover:bg-canvas/70 text-text-main"
      }`}
    >
      <div className="relative shrink-0">
        <SpaceAvatar avatar={room.logoUrl} name={room.title} size="h-9 w-9" />
        <span
          title={`${onlineCount} online`}
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500"
        />
      </div>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-1.5">
          <span
            className={`truncate text-xs font-semibold ${
              active ? "text-primary" : "text-text-heading"
            }`}
          >
            {room.title}
          </span>
          {lastTime && (
            <span className="shrink-0 text-[10px] text-text-muted">
              {formatChatTime(lastTime)}
            </span>
          )}
        </span>

        <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {onlineCount} online
          </span>
          {roomSubtitle && (
            <>
              <span>•</span>
              <span className="truncate">{roomSubtitle}</span>
            </>
          )}
        </span>

        <span className="mt-0.5 flex items-center justify-between gap-1.5">
          <span className="truncate text-xs text-text-muted">
            {previewText}
          </span>
          {room.unreadCount > 0 && !active && (
            <Badge
              variant="default"
              className="h-4 min-w-4 rounded-full px-1 text-[10px] font-semibold leading-none"
            >
              {room.unreadCount > 99 ? "99+" : room.unreadCount}
            </Badge>
          )}
        </span>
      </span>
    </button>
  );
}
