import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  GraduationCap,
  Layers,
  MapPin,
  Shield,
  Tag,
  UserPlus,
  Users,
  Video,
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
} from "../../api/courseworkApi.js";
import { routes } from "@/routes/paths";

const SPACE_LABELS = {
  ACADEMIC_CLASS: "Class",
  STUDY_GROUP: "Study Group",
  CLUB_SOCIETY: "Club & Society",
  PROJECT_TEAM: "Project Team",
  DEPARTMENT_COHORT: "Cohort",
  COMMUNITY_HUB: "Community Hub",
};

export function ClassHomeTab({
  isEnrolled = true,
  onJoin,
  isJoining = false,
  classroom,
}) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const courseId = classroom?.id;

  const accessType = (
    classroom?.accessType ||
    (classroom?.visibility === "PUBLIC" ? "open" : "code")
  ).toLowerCase();

  const { data: courseworkPage, isLoading: isLoadingCoursework } =
    useGetCourseworkListQuery(
      { courseId, page: 0, size: 50 },
      { skip: !courseId }
    );

  const [createCoursework] = useCreateCourseworkMutation();

  // Show both ANNOUNCEMENT posts and any stream updates
  const announcements = useMemo(() => {
    const list = courseworkPage?.content ?? [];
    return list.filter(
      (item) =>
        item.type === "ANNOUNCEMENT" ||
        item.type === "MATERIAL" ||
        item.type === "ASSIGNMENT" ||
        !item.type
    );
  }, [courseworkPage]);

  const handlePostAnnouncement = async (text) => {
    if (!text?.trim() || !courseId) return;
    await createCoursework({
      courseId,
      payload: {
        type: "ANNOUNCEMENT",
        title: "Announcement",
        description: text.trim(),
        status: "PUBLISHED",
      },
    }).unwrap();
  };

  const ownerName =
    typeof classroom?.owner === "string"
      ? classroom.owner
      : classroom?.owner?.name ||
        classroom?.ownerName ||
        "Space Creator";

  const ownerAvatar =
    classroom?.owner?.avatarUrl ||
    classroom?.ownerAvatarUrl ||
    null;

  const spaceTypeLabel = SPACE_LABELS[classroom?.spaceType] || "Space";
  const location = classroom?.location || classroom?.room;
  const isOnline = classroom?.meetingType === "ONLINE";
  const isMeetingLink =
    location &&
    (location.startsWith("http://") ||
      location.startsWith("https://") ||
      location.includes("zoom.us") ||
      location.includes("meet.google"));

  const tags = Array.isArray(classroom?.tags) ? classroom.tags : [];

  const scheduleText = (() => {
    if (classroom?.schedule) return classroom.schedule;
    const days = Array.isArray(classroom?.days) ? classroom.days.join(", ") : null;
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
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                <Globe className="h-3 w-3" />
                Space Preview
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-text-heading">
                You are previewing this space
              </h3>
              <p className="text-xs text-text-muted max-w-xl leading-relaxed">
                Join now to participate in group discussions, access shared resources, submit coursework, and connect with peers.
              </p>
            </div>
            {accessType === "invite" ? (
              <span className="shrink-0 rounded-lg border border-border bg-canvas px-3 py-1.5 text-xs font-medium text-text-muted">
                Invite only
              </span>
            ) : accessType === "code" && classroom?.visibility !== "PUBLIC" ? (
              <Link
                to={`${routes.classes.join}?courseId=${encodeURIComponent(classroom?.id || "")}&accessType=code`}
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-hover"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Join with Code</span>
              </Link>
            ) : onJoin ? (
              <Button
                onClick={onJoin}
                disabled={isJoining}
                size="sm"
                className="shrink-0 gap-1.5 rounded-lg text-xs font-semibold h-8"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{isJoining ? "Joining•" : "Join Space"}</span>
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {/* Space Overview & Metadata Card */}
      <CollapsibleSection
        title="About this space"
        subtitle={`${spaceTypeLabel} • ${classroom?.subject || classroom?.title || ""}`}
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

        {/* Dense 4-col metadata grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-border">
          {/* Space Type / Category */}
          <div className="flex items-center gap-2.5 rounded-lg bg-canvas/60 p-2 border border-border/60">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary shrink-0">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Type</p>
              <p className="text-xs font-semibold text-text-heading truncate">
                {spaceTypeLabel}
              </p>
            </div>
          </div>

          {/* Subject / Domain */}
          <div className="flex items-center gap-2.5 rounded-lg bg-canvas/60 p-2 border border-border/60">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Domain</p>
              <p className="text-xs font-semibold text-text-heading truncate">
                {classroom?.subject || "General"}
              </p>
            </div>
          </div>

          {/* Location / Meeting format */}
          <div className="flex items-center gap-2.5 rounded-lg bg-canvas/60 p-2 border border-border/60">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              {isOnline ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Format</p>
              {isMeetingLink ? (
                <a
                  href={location}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline truncate"
                >
                  <span className="truncate">Online Room</span>
                  <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                </a>
              ) : (
                <p className="text-xs font-semibold text-text-heading truncate">
                  {location || (classroom?.meetingType === "ONLINE" ? "Online" : "In-Person")}
                </p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-center gap-2.5 rounded-lg bg-canvas/60 p-2 border border-border/60">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Schedule</p>
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
              <p className="text-[10px] font-medium text-text-muted">Space Owner</p>
              {classroom?.ownerId ? (
                <Link
                  to={routes.user(classroom.ownerId)}
                  className="text-xs font-bold text-text-heading hover:text-primary hover:underline transition-colors"
                >
                  {ownerName}
                </Link>
              ) : (
                <p className="text-xs font-bold text-text-heading">{ownerName}</p>
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
          <ClassPostBox onSubmit={handlePostAnnouncement} />
        )}

        {isLoadingCoursework && announcements.length === 0 ? (
          <div className="rounded-xl bg-surface p-5 text-center text-xs text-text-muted ring-1 ring-border shadow-xs">
            Loading space updates•
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
                post={{
                  ...post,
                  ownerName,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
