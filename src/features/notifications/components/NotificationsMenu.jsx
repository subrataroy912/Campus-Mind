import { useState } from "react";
import {
  Bell,
  BookOpen,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MessageSquare,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useNotificationsPolling } from "../hooks/useNotificationsPolling.js";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../api/notificationsApi.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import { routes } from "@/routes/paths.js";

const NOTIFICATION_META = {
  COURSE_JOIN_REQUEST: {
    label: "Join Request",
    actionText: "Review in People",
    Icon: UserPlus,
    iconWrap:
      "bg-amber-500/12 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
    badgeClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
  },
  COURSE_JOIN_APPROVED: {
    label: "Approved",
    actionText: "Open Space",
    Icon: CheckCircle2,
    iconWrap:
      "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  },
  COURSE_JOIN_DECLINED: {
    label: "Declined",
    actionText: "View Space",
    Icon: XCircle,
    iconWrap:
      "bg-rose-500/12 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500/20",
    badgeClass:
      "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25",
  },
  COURSE_INVITATION: {
    label: "Invitation",
    actionText: "Open Space",
    Icon: UserPlus,
    iconWrap: "bg-primary/12 text-primary ring-1 ring-primary/20",
    badgeClass: "bg-primary/10 text-primary border-primary/25",
  },
  COURSEWORK_PUBLISHED: {
    label: "New Post",
    actionText: "View Classwork",
    Icon: BookOpen,
    iconWrap: "bg-primary/12 text-primary ring-1 ring-primary/20",
    badgeClass: "bg-primary/10 text-primary border-primary/25",
  },
  COURSEWORK_UPDATED: {
    label: "Updated",
    actionText: "View Classwork",
    Icon: BookOpen,
    iconWrap:
      "bg-sky-500/12 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20",
    badgeClass:
      "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25",
  },
  SUBMISSION_GRADED: {
    label: "Graded",
    actionText: "View Grades",
    Icon: GraduationCap,
    iconWrap:
      "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  },
  ASSIGNMENT_GRADED: {
    label: "Graded",
    actionText: "View Grades",
    Icon: GraduationCap,
    iconWrap:
      "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
    badgeClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  },
  COMMENT_ADDED: {
    label: "Comment",
    actionText: "View Discussion",
    Icon: MessageSquare,
    iconWrap:
      "bg-violet-500/12 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20",
    badgeClass:
      "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25",
  },
};

function getNotificationMeta(type) {
  if (type && NOTIFICATION_META[type]) {
    return NOTIFICATION_META[type];
  }
  return {
    label: type ? type.replace(/_/g, " ") : "Update",
    actionText: "Open",
    Icon: Bell,
    iconWrap: "bg-muted/60 text-text-muted ring-1 ring-border/60",
    badgeClass: "bg-muted/40 text-text-muted border-border/50",
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export function resolveNotificationTargetLink(item) {
  if (!item) return null;
  if (item.link) return item.link;

  const targetCourseId =
    item.courseId || (item.resourceType === "COURSE" ? item.resourceId : null);

  if (item.type === "COURSE_JOIN_REQUEST" && targetCourseId) {
    return routes.space.people(targetCourseId);
  }

  if (
    (item.type === "COURSEWORK_PUBLISHED" ||
      item.type === "COURSEWORK_UPDATED" ||
      item.resourceType === "COURSEWORK") &&
    (targetCourseId || item.resourceId)
  ) {
    return routes.space.classwork(targetCourseId || item.resourceId);
  }

  if (
    (item.type === "SUBMISSION_GRADED" ||
      item.type === "ASSIGNMENT_GRADED" ||
      item.resourceType === "SUBMISSION") &&
    (targetCourseId || item.resourceId)
  ) {
    return routes.space.grades(targetCourseId || item.resourceId);
  }

  if (targetCourseId) {
    return routes.spaces.detail(targetCourseId);
  }

  if (item.resourceId) {
    return routes.spaces.detail(item.resourceId);
  }

  return null;
}

export default function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data: response, isLoading } = useNotificationsPolling({
    interval: 30000,
    onNavigate: (targetLink) => {
      if (targetLink) {
        navigate(targetLink);
      }
    },
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const handleMarkNotificationRead = async (id) => {
    if (!id) return;
    try {
      await markRead(id).unwrap();
    } catch {
      // Best-effort notification state update
    }
  };

  const apiData = Array.isArray(response)
    ? response
    : response?.content || response?.data;
  const notifications = Array.isArray(apiData) ? apiData : [];
  const unreadNotifications = notifications.filter((n) => !n.read && !n.isRead);
  const unreadCount = unreadNotifications.length;

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch {
      await Promise.allSettled(
        unreadNotifications
          .map((n) => n.id || n._id)
          .filter(Boolean)
          .map((id) => markRead(id).unwrap()),
      );
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className="relative flex min-h-9 min-w-9 sm:h-8 sm:w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-canvas hover:text-text-main cursor-pointer"
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell size={16} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 p-0 overflow-hidden rounded-xl border border-border/80 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/70 bg-surface/90 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-text-heading">
              Notifications
            </span>
            {unreadCount > 0 && (
              <Badge
                variant="secondary"
                className="h-4.5 px-1.5 text-[10px] font-semibold text-primary bg-primary/10"
              >
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
            >
              <CheckCheck size={12} />
              <span>Mark all read</span>
            </Button>
          )}
        </div>

        {/* Body list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
          {isLoading && notifications.length === 0 ? (
            <div className="flex flex-col gap-2.5 p-3.5">
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-full rounded-lg" />
              <Skeleton className="h-14 w-4/5 rounded-lg" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-1.5 py-8 px-4 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 text-text-muted">
                <Bell size={16} />
              </div>
              <p className="text-xs font-semibold text-text-heading">
                You&apos;re all caught up
              </p>
              <p className="text-[11px] text-text-muted max-w-[220px]">
                Join requests, coursework updates, and space announcements will appear here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id || n._id}
                notification={n}
                onMarkRead={handleMarkNotificationRead}
                onClick={(item) => {
                  const itemId = item.id || item._id;
                  if (!item.read && !item.isRead && itemId) {
                    handleMarkNotificationRead(itemId);
                  }
                  const targetLink = resolveNotificationTargetLink(item);
                  if (targetLink) {
                    setOpen(false);
                    navigate(targetLink);
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
  className = "",
}) {
  const {
    id,
    _id,
    type,
    title = "Notification",
    message = "",
    read,
    isRead,
    createdAt,
  } = notification || {};

  const notificationId = id || _id;
  const isUnread = !read && !isRead;
  const meta = getNotificationMeta(type);
  const IconComponent = meta.Icon;
  const targetLink = resolveNotificationTargetLink(notification);

  const handleCardClick = () => {
    onClick?.(notification);
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (onMarkRead && notificationId) {
      onMarkRead(notificationId);
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
        "group relative flex items-start gap-3 px-3.5 py-2.5",
        "transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        onClick && "cursor-pointer",
        isUnread
          ? "bg-primary/[0.04] hover:bg-primary/[0.08]"
          : "bg-transparent hover:bg-muted/35",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Contextual Type Icon + Unread Dot */}
      <div className="relative mt-0.5 shrink-0">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${meta.iconWrap}`}
        >
          <IconComponent size={15} strokeWidth={2} />
        </div>
        {isUnread && (
          <span
            className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-surface"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Title + Semantic Badge */}
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p
            className={[
              "min-w-0 flex-1 truncate text-xs text-text-heading",
              isUnread ? "font-semibold" : "font-medium",
            ].join(" ")}
          >
            {title}
          </p>

          <Badge
            variant="outline"
            className={`shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold tracking-wide h-auto ${meta.badgeClass}`}
          >
            {meta.label}
          </Badge>
        </div>

        {/* Message */}
        {message && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-text-muted">
            {message}
          </p>
        )}

        {/* Footer: Relative time + Action hint */}
        <div className="flex items-center justify-between gap-2 pt-0.5 text-[10px] text-text-muted/80">
          {createdAt ? (
            <time dateTime={createdAt} className="font-medium">
              {formatRelativeTime(createdAt)}
            </time>
          ) : (
            <span />
          )}

          {targetLink && (
            <span className="inline-flex items-center gap-0.5 font-semibold text-primary opacity-85 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
              <span>{meta.actionText}</span>
              <ChevronRight size={11} />
            </span>
          )}
        </div>
      </div>

      {/* Mark as read button */}
      {isUnread && onMarkRead && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleMarkRead}
          title="Mark as read"
          aria-label={`Mark "${title}" as read`}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-muted/70 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
        >
          <Check size={12} strokeWidth={2.2} />
        </Button>
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

