import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Calendar,
  Clock,
  Globe,
  GraduationCap,
  Shield,
  Tag,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { CollapsibleSection } from "@/components/common/CollapsibleSection.jsx";
import { ClassroomAvatar } from "../ClassroomAvatar.jsx";
import ClassPostBox from "../ClassPostBox.jsx";
import ClassFeedPost from "../ClassFeedPost.jsx";
import {
  useGetCourseworkListQuery,
  useCreateCourseworkMutation,
  useUpdateCourseworkMutation,
  useDeleteCourseworkMutation,
} from "../../api/courseworkApi.js";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAuth } from "@/context/AuthContext.jsx";
import { isStaffRole } from "../../utils/roles.js";
import { routes } from "@/routes/paths";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import {
  useActiveCourseId,
  useCourseIsEnrolled,
  useCourseIsStaff,
} from "../../hooks/useCourseContext.js";

export function ClassHomeTab({
  classId: propClassId,
  isEnrolled: propIsEnrolled,
  classroom,
  isStaff: propIsStaff,
}) {
  const contextCourseId = useActiveCourseId();
  const contextIsEnrolled = useCourseIsEnrolled();
  const contextIsStaff = useCourseIsStaff();
  const isEnrolled = propIsEnrolled !== undefined ? propIsEnrolled : (contextIsEnrolled ?? true);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const { user, authStatus } = useAuth();
  const isHydrating = authStatus === "hydrating";
  const courseId = propClassId || classroom?.id || contextCourseId;

  const isStaff =
    propIsStaff ??
    contextIsStaff ??
    (isStaffRole(classroom?.role) ||
      (Boolean(user?.id) &&
        (user.id === classroom?.ownerId || user.id === classroom?.creatorId)));

  const accessType = (classroom?.accessType || "PUBLIC").toUpperCase();

  const { data: courseworkPage, isLoading: isLoadingCoursework } =
    useGetCourseworkListQuery(
      isHydrating || !courseId || (!isEnrolled && accessType !== "PUBLIC")
        ? skipToken
        : { courseId, page: 0, size: 20 },
    );

  const [createCoursework, { isLoading: isPosting }] =
    useCreateCourseworkMutation();
  const [updateCoursework] = useUpdateCourseworkMutation();
  const [deleteCoursework] = useDeleteCourseworkMutation();

  // Show ANNOUNCEMENT posts and activity cards (MATERIAL, ASSIGNMENT)
  const announcements = useMemo(() => {
    const list = courseworkPage?.content ?? [];
    return list.filter(
      (item) =>
        item.type === "ANNOUNCEMENT" ||
        item.type === "MATERIAL" ||
        item.type === "ASSIGNMENT" ||
        !item.type,
    );
  }, [courseworkPage]);

  const handlePostAnnouncement = async (input) => {
    if (!courseId) return;
    const text = typeof input === "string" ? input : input?.text;
    const attachments =
      typeof input === "object" && Array.isArray(input?.attachments)
        ? input.attachments
        : [];

    if (!text?.trim() && attachments.length === 0) return;

    try {
      await createCoursework({
        courseId,
        payload: {
          type: "ANNOUNCEMENT",
          title: "Announcement",
          description: text ? text.trim() : "",
          attachments,
          status: "PUBLISHED",
        },
      }).unwrap();
      toast.add({
        title: "Announcement posted",
        description: "Your post is now live in the space stream.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Failed to post announcement",
        description: parseApiError(err, "Unable to post your announcement.")
          .message,
        type: "error",
      });
    }
  };

  const handleEditPost = async (courseworkId, changes) => {
    try {
      await updateCoursework({
        courseId,
        courseworkId,
        changes,
      }).unwrap();
      toast.add({
        title: "Post updated",
        description: "Your changes have been saved.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Update failed",
        description: parseApiError(err, "Unable to save your edits.").message,
        type: "error",
      });
      throw err;
    }
  };

  const handleDeletePost = async (courseworkId) => {
    try {
      await deleteCoursework({
        courseId,
        courseworkId,
      }).unwrap();
      toast.add({
        title: "Post deleted",
        description: "Announcement removed from the space.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Delete failed",
        description: parseApiError(err, "Unable to delete announcement.")
          .message,
        type: "error",
      });
    }
  };

  const handlePinPost = async (courseworkId, pinned) => {
    try {
      await updateCoursework({
        courseId,
        courseworkId,
        changes: { pinned },
      }).unwrap();
      toast.add({
        title: pinned ? "Post pinned" : "Post unpinned",
        description: pinned
          ? "Announcement pinned to the top of the stream."
          : "Announcement unpinned from stream header.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Pin action failed",
        description: parseApiError(err, "Unable to update pin status.").message,
        type: "error",
      });
    }
  };

  const ownerName =
    typeof classroom?.owner === "string"
      ? classroom.owner
      : classroom?.owner?.name || classroom?.ownerName || "Space Creator";

  const ownerAvatar =
    classroom?.owner?.avatarUrl || classroom?.ownerAvatarUrl || null;

  const tags = Array.isArray(classroom?.tags) ? classroom.tags : [];

  const scheduleText = (() => {
    if (classroom?.schedule) return classroom.schedule;
    const days = Array.isArray(classroom?.days)
      ? classroom.days.join(", ")
      : null;
    const time =
      classroom?.startTime && classroom?.endTime
        ? `${classroom.startTime} - ${classroom.endTime}`
        : classroom?.startTime || null;
    if (days && time) return `${days} (${time})`;
    if (days) return days;
    if (time) return time;
    return null;
  })();

  return (
    <div className="mt-3 space-y-3.5">
      {/* Preview Banner for Non-Enrolled Users */}
      {!isEnrolled && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 sm:p-4 text-text-main shadow-xs">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
              {accessType === "PRIVATE" ? (
                <Shield className="h-3 w-3" />
              ) : (
                <Globe className="h-3 w-3" />
              )}
              {accessType === "PRIVATE"
                ? "Private Space — Restricted View"
                : "Space Preview"}
            </div>
            <h3 className="text-sm sm:text-base font-semibold text-text-heading">
              {accessType === "PRIVATE"
                ? "Approval required to access this space"
                : "You are previewing this space"}
            </h3>
            <p className="text-xs text-text-muted max-w-xl leading-relaxed">
              {accessType === "PRIVATE"
                ? "This is a private space. Use the Request to Join button in the header above to request membership from the space admins."
                : "Use the join button in the header above to participate in discussions, access shared resources, submit coursework, and connect with peers."}
            </p>
          </div>
        </div>
      )}

      {/* Space Overview & Metadata Card */}
      <CollapsibleSection
        title="About this space"
        subtitle={classroom?.subject || classroom?.title || ""}
        defaultExpanded={true}
        className="space-y-3"
        contentClassName="space-y-3"
      >
        <div>
          <p
            className={`text-xs sm:text-sm leading-relaxed text-text-main whitespace-pre-line ${
              !descriptionExpanded ? "line-clamp-3" : ""
            }`}
          >
            {classroom?.description?.trim() ||
              "No detailed description provided for this space yet. Check back soon for goals, schedule, and updates."}
          </p>
          {classroom?.description && classroom.description.length > 180 && (
            <button
              type="button"
              onClick={() => setDescriptionExpanded((prev) => !prev)}
              className="mt-1 text-[11px] font-semibold text-primary hover:underline focus:outline-hidden cursor-pointer"
            >
              {descriptionExpanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2 border-t border-border">
          {/* Subject / Domain */}
          <div className="flex items-center gap-2.5 rounded-lg bg-canvas/60 p-2 border border-border/60">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                Domain
              </p>
              <p className="text-xs font-semibold text-text-heading truncate">
                {classroom?.subject || "General"}
              </p>
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-2.5 rounded-lg bg-canvas/60 p-2 border border-border/60">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                Schedule
              </p>
              <p className="text-xs font-semibold text-text-heading truncate">
                {scheduleText || "Flexible / Async"}
              </p>
            </div>
          </div>
        </div>

        {/* Tags Row if present */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-1 text-xs text-text-muted">
            <Tag className="h-3 w-3 text-text-muted/70 mr-0.5" />
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-text-main border border-border"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Space Owner Profile & Enrollment Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-border">
          <div className="flex items-center gap-2.5">
            <ClassroomAvatar
              userId={classroom?.ownerId}
              name={ownerName}
              avatar={ownerAvatar}
              size="h-8 w-8 sm:h-9 sm:w-9"
            />
            <div>
              <p className="text-[10px] font-medium text-text-muted">
                Space Owner
              </p>
              {classroom?.ownerId ? (
                <Link
                  to={routes.user(classroom.ownerId)}
                  className="text-xs font-bold text-text-heading hover:text-primary hover:underline transition-colors"
                >
                  {ownerName}
                </Link>
              ) : (
                <p className="text-xs font-bold text-text-heading">
                  {ownerName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-text-muted">
            <div className="flex items-center gap-1 font-medium">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span>{classroom?.memberCount ?? 0} members</span>
            </div>
            <div className="flex items-center gap-1 font-medium">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="capitalize">{accessType} Access</span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Space Stream & Announcements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-text-heading">
            Space Stream & Updates
          </h3>
          {announcements.length > 0 && (
            <span className="text-xs font-medium text-text-muted">
              {announcements.length} post{announcements.length === 1 ? "" : "s"}
            </span>
          )}
        </div>

        {isEnrolled && (
          <ClassPostBox
            onSubmit={handlePostAnnouncement}
            isSubmitting={isPosting}
          />
        )}

        {!isEnrolled && accessType === "PRIVATE" ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-6 text-center shadow-2xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2.5">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Stream is restricted to space members
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-normal">
              Request to join this private space to view announcements, discussions, and shared updates.
            </p>
          </div>
        ) : isLoadingCoursework && announcements.length === 0 ? (
          <div className="rounded-xl bg-surface p-5 text-center text-xs text-text-muted ring-1 ring-border shadow-xs">
            Loading space updates…
          </div>
        ) : announcements.length === 0 ? (
          <EmptyState
            title="No updates posted yet"
            description="Announcements, project updates, and discussions will appear here when posted."
          />
        ) : (
          <div className="space-y-2.5">
            {announcements.map((post) => (
              <ClassFeedPost
                key={post.id}
                post={post}
                isStaff={isStaff}
                currentUser={user}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onPin={handlePinPost}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
