import { useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { useNotificationsPolling } from "../hooks/useNotificationsPolling.js";
import { useMarkNotificationReadMutation } from "../api/notificationsApi.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { data: response, isLoading } = useNotificationsPolling({ interval: 30000 });
  const [markRead] = useMarkNotificationReadMutation();

  const notifications = Array.isArray(response)
    ? response
    : response?.content || response?.data || [];

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
      <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
        <div className="flex items-center justify-between border-b border-border p-3">
          <DropdownMenuLabel className="p-0 font-bold text-text-heading">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              {unreadCount} new
            </span>
          )}
        </div>

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
            notifications.map((n) => {
              const id = n.id || n._id;
              const isUnread = !n.read && !n.isRead;
              return (
                <div
                  key={id}
                  className={`flex items-start justify-between gap-3 p-3 transition-colors ${
                    isUnread ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-canvas/50"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-text-heading line-clamp-1">
                      {n.title || n.subject || "Notification"}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted line-clamp-2">
                      {n.message || n.content || n.body || ""}
                    </p>
                  </div>
                  {isUnread && (
                    <button
                      onClick={() => markRead(id)}
                      title="Mark as read"
                      aria-label="Mark as read"
                      className="shrink-0 p-1 text-text-muted hover:text-primary transition-colors cursor-pointer"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
