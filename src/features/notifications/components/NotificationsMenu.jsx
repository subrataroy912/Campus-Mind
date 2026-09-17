import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { useNotificationsPolling } from "../hooks/useNotificationsPolling.js";
import { useMarkNotificationReadMutation } from "../api/notificationsApi.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { useNavigate } from "react-router";

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: response, isLoading } = useNotificationsPolling({
    interval: 30000,
  });
  const [markRead] = useMarkNotificationReadMutation();

  const apiData = Array.isArray(response)
    ? response
    : response?.content || response?.data;
  const notifications =
    apiData && apiData.length > 0 ? apiData : DUMMY_NOTIFICATIONS;
  const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-canvas hover:text-text-main cursor-pointer"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell size={18} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0 sm:w-112.5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-3">
          <span className="font-bold text-sm text-text-heading">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {unreadCount} new
            </span>
          )}
        </div>

        {/* Body list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-muted">
              No new notifications
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id || n._id}
                notification={n}
                size="md"
                onMarkRead={(id) => markRead(id)}
                onClick={(item) => {
                  if (item.link) {
                    setOpen(false);
                    navigate(item.link); /*TODO :: have to change it.*/
                  }
                }}
              />
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
  onClick,
  size = "md",
  className = "",
}) {
  const {
    id,
    type,
    title = "Notification",
    message = "",
    resourceType,
    resourceId,
    read,
    createdAt,
  } = notification || {};

  const isUnread = !read;

  const sizeStyles = {
    sm: {
      container: "px-3 py-2.5",
      gap: "gap-2.5",
      title: "text-xs",
      message: "text-[11px] leading-4 mt-0.5",
      meta: "text-[10px] mt-1.5",
      badge: "text-[9px] px-1.5 py-0.5",
      icon: 13,
      button: "h-6 w-6",
    },
    md: {
      container: "px-4 py-3",
      gap: "gap-3",
      title: "text-sm",
      message: "text-xs leading-5 mt-0.5",
      meta: "text-[11px] mt-1.5",
      badge: "text-[9px] px-1.5 py-0.5",
      icon: 14,
      button: "h-7 w-7",
    },
    lg: {
      container: "px-5 py-4",
      gap: "gap-4",
      title: "text-sm",
      message: "text-sm leading-5 mt-1",
      meta: "text-xs mt-2",
      badge: "text-[10px] px-2 py-0.5",
      icon: 16,
      button: "h-8 w-8",
    },
  }[size] || {
    container: "px-4 py-3",
    gap: "gap-3",
    title: "text-sm",
    message: "text-xs leading-5 mt-0.5",
    meta: "text-[11px] mt-1.5",
    badge: "text-[9px] px-1.5 py-0.5",
    icon: 14,
    button: "h-7 w-7",
  };

  const handleCardClick = () => {
    onClick?.(notification);
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();

    if (onMarkRead && id) {
      onMarkRead(id);
    }
  };

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={[
        "group relative flex items-start gap-3",
        "border-b border-border/50 last:border-b-0",
        "transition-all duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        sizeStyles.container,
        onClick && "cursor-pointer",
        isUnread
          ? ["bg-primary/[0.035]", "hover:bg-primary/[0.07]"]
          : ["bg-transparent", "hover:bg-muted/30"],
        className,
      ]
        .flat()
        .filter(Boolean)
        .join(" ")}
    >
      {/* Unread indicator */}
      <div
        className={[
          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
          "transition-all duration-200",
          isUnread
            ? "bg-primary shadow-[0_0_0_3px] shadow-primary/10"
            : "bg-transparent",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        {/* Title + Type */}
        <div className="flex min-w-0 items-center gap-2">
          <p
            className={[
              "min-w-0 flex-1 truncate text-text-heading",
              sizeStyles.title,
              isUnread ? "font-semibold" : "font-medium",
            ].join(" ")}
          >
            {title}
          </p>

          {type && (
            <span
              className={[
                "shrink-0 rounded-md",
                "bg-muted/40 text-text-muted",
                "border border-border/40",
                "font-mono font-medium uppercase tracking-wide",
                sizeStyles.badge,
              ].join(" ")}
            >
              {type.replace(/_/g, " ")}
            </span>
          )}
        </div>

        {/* Message */}
        {message && (
          <p
            className={[
              "line-clamp-2 text-text-muted",
              sizeStyles.message,
            ].join(" ")}
          >
            {message}
          </p>
        )}

        {/* Metadata */}
        {(createdAt || (resourceType && resourceId)) && (
          <div
            className={[
              "flex min-w-0 items-center gap-1.5",
              "text-text-muted/70",
              sizeStyles.meta,
            ].join(" ")}
          >
            {createdAt && (
              <time dateTime={createdAt}>{formatRelativeTime(createdAt)}</time>
            )}

            {createdAt && resourceType && resourceId && (
              <span aria-hidden="true">·</span>
            )}

            {resourceType && resourceId && (
              <span className="min-w-0 truncate">
                {resourceType}:{" "}
                <span className="font-mono text-text-muted/80">
                  {resourceId}
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Mark as read */}
      {isUnread && onMarkRead && (
        <button
          type="button"
          onClick={handleMarkRead}
          title="Mark as read"
          aria-label={`Mark "${title}" as read`}
          className={[
            "shrink-0 rounded-md",
            "flex items-center justify-center",
            "text-text-muted/60",
            "opacity-0 group-hover:opacity-100",
            "focus:opacity-100",
            "hover:bg-primary/10 hover:text-primary",
            "active:scale-95",
            "transition-all duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            sizeStyles.button,
          ].join(" ")}
        >
          <Check size={sizeStyles.icon} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function formatRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

const DUMMY_NOTIFICATIONS = [
  {
    id: "notif-reaction-1",
    type: "REACTION_RECEIVED",
    title: "New Reaction on Your Poll",
    message:
      "Maya Lin and 3 others reacted with 🔥 Fire to your Capstone tech stack poll.",
    resourceType: "POLL",
    resourceId: "poll-capstone-1",
    read: false,
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    link: "/community?tab=trending",
  },
  {
    id: "notif-streak-1",
    type: "STREAK_REMINDER",
    title: "🔥 5-Day Streak Active!",
    message:
      "You're on a roll! Check today's campus buzz or react to a discussion to keep your streak going.",
    resourceType: "STREAK",
    resourceId: "streak-daily",
    read: false,
    readAt: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    link: "/community?tab=for-you",
  },
  {
    id: "notif-poll-1",
    type: "CAMPUS_PULSE",
    title: "Trending Campus Poll",
    message:
      "Over 120 students have voted in 'Best stack for Capstone'. See what's winning!",
    resourceType: "CAMPUS_PULSE",
    resourceId: "pulse-capstone",
    read: true,
    readAt: "2026-09-17T06:00:00Z",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    link: "/community?filter=poll",
  },
  {
    id: "notif-98f2b1a4-6c3e-4d5f-9e7a-1234567890ab",
    type: "ASSIGNMENT_GRADED",
    title: "Assignment Graded: Distributed Systems Lab 3",
    message:
      "Prof. Sarah Jenkins returned your submission with feedback: 'Excellent concurrency model! (96/100)'",
    resourceType: "SUBMISSION",
    resourceId: "sub-2026-8812",
    read: true,
    readAt: "2026-09-13T10:15:30Z",
    createdAt: "2026-09-13T08:00:00Z",
  },
  {
    id: "notif-55a1e8c9-7d2b-4b10-8a90-fedcba098765",
    type: "CLASS_MENTION",
    title: "Mentioned in CS401 Study Group",
    message:
      "Alex Chen tagged you in a discussion: '@you check out the lecture notes on Raft consensus before tomorrow.'",
    resourceType: "POST_COMMENT",
    resourceId: "post-77419",
    read: true,
    readAt: null,
    createdAt: "2026-09-13T12:30:00Z",
  },
];
