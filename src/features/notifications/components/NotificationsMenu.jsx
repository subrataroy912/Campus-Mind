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

      <DropdownMenuContent align="end" className="w-96 p-0 sm:w-[450px]">
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
                    setOpen(false); // Closes menu when navigating
                    navigate(item.link);
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
/**
 * Reusable notification item row/card
 *
 * @param {Object} props
 * @param {Object} props.notification - Notification data object
 * @param {(id: string) => void} [props.onMarkRead] - Callback when "Mark as read" is clicked
 * @param {(notification: Object) => void} [props.onClick] - Callback when the card itself is clicked (e.g. navigation)
 * @param {"sm" | "md" | "lg"} [props.size="md"] - Size preset
 * @param {string} [props.className] - Additional wrapper classes
 */
function NotificationItem({
  notification,
  onMarkRead,
  onClick,
  size = "md",
  className = "",
}) {
  const id = notification?.id || notification?._id;
  const isUnread = !notification?.read && !notification?.isRead;
  const title = notification?.title || notification?.subject || "Notification";
  const message =
    notification?.message || notification?.content || notification?.body || "";

  // Size styling presets
  const sizeStyles =
    {
      sm: {
        padding: "p-2.5 gap-2.5",
        title: "text-xs",
        message: "text-[11px] mt-0.5",
        iconSize: 13,
        buttonPadding: "p-0.5",
      },
      md: {
        padding: "p-3 gap-3",
        title: "text-xs font-semibold",
        message: "text-xs mt-0.5",
        iconSize: 14,
        buttonPadding: "p-1",
      },
      lg: {
        padding: "p-4 gap-4",
        title: "text-sm font-semibold",
        message: "text-sm mt-1",
        iconSize: 16,
        buttonPadding: "p-1.5",
      },
    }[size] || sizeStyles.md;

  const handleCardClick = () => {
    if (onClick) onClick(notification);
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (onMarkRead && id) onMarkRead(id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex items-start justify-between transition-colors ${
        sizeStyles.padding
      } ${
        isUnread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-canvas/50"
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="min-w-0 flex-1">
        <p className={`text-text-heading line-clamp-1 ${sizeStyles.title}`}>
          {title}
        </p>
        {message && (
          <p className={`text-text-muted line-clamp-2 ${sizeStyles.message}`}>
            {message}
          </p>
        )}
      </div>

      {isUnread && onMarkRead && (
        <button
          type="button"
          onClick={handleMarkRead}
          title="Mark as read"
          aria-label="Mark as read"
          className={`shrink-0 rounded text-text-muted hover:text-primary transition-colors cursor-pointer ${sizeStyles.buttonPadding}`}
        >
          <Check size={sizeStyles.iconSize} />
        </button>
      )}
    </div>
  );
}
const DUMMY_NOTIFICATIONS = [
  {
    id: "notif-001",
    title: "New Assignment Published",
    message:
      "Week 3: Advanced React Architecture has been posted to your classes.",
    read: false,
    createdAt: "2026-09-13T10:30:00.000Z",
    link: "/classes/react-architecture",
  },
  {
    id: "notif-002",
    title: "Class Invitation",
    message: "Prof. Sarah Jenkins invited you to join Distributed Systems 401.",
    read: true,
    createdAt: "2026-09-12T16:45:00.000Z",
    link: "/classes/distributed-systems",
  },
];
