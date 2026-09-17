import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Archive,
  Check,
  Copy,
  ExternalLink,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  MapPin,
  Pencil,
  Settings,
  Trash2,
  UserPlus,
  Video,
} from "lucide-react";
import { getClassTheme } from "../utils/classTheme.js";
import { routes } from "@/routes/paths";
import { Button } from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { EditSpaceModal } from "./EditSpaceModal.jsx";
import { SpaceActionDialogs } from "./SpaceActionDialogs.jsx";
import { useSpaceActions } from "../hooks/useSpaceActions.js";

const SPACE_TYPE_CONFIG = {
  ACADEMIC_CLASS: {
    label: "Class",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  STUDY_GROUP: {
    label: "Study Group",
    color:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  CLUB_SOCIETY: {
    label: "Club & Society",
    color:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  PROJECT_TEAM: {
    label: "Project Team",
    color:
      "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  },
  DEPARTMENT_COHORT: {
    label: "Cohort",
    color:
      "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  COMMUNITY_HUB: {
    label: "Community",
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
};

export function SpaceHeader({
  classroom,
  space = classroom,
  isEnrolled = true,
  onJoin,
  isJoining = false,
  teacher = false,
}) {
  const currentSpace = space || classroom;
  const [copied, setCopied] = useState(false);

  const {
    isEditModalOpen,
    setIsEditModalOpen,
    isArchiveDialogOpen,
    setIsArchiveDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isLeaveDialogOpen,
    setIsLeaveDialogOpen,
    isArchiving,
    isDeleting,
    isLeaving,
    handleArchive,
    handleDelete,
    handleLeave,
  } = useSpaceActions(currentSpace);

  const classTheme = getClassTheme(currentSpace);
  const teacherName =
    typeof currentSpace?.teacher === "string"
      ? currentSpace.teacher
      : currentSpace?.teacher?.name ||
        currentSpace?.instructor?.name ||
        currentSpace?.teacherName ||
        currentSpace?.ownerName ||
        "CampusMind Facilitator";

  const accessType = (
    currentSpace?.accessType ||
    (currentSpace?.visibility === "PUBLIC" ? "Public" : "code")
  ).toLowerCase();

  const spaceTypeInfo =
    SPACE_TYPE_CONFIG[currentSpace?.spaceType] || SPACE_TYPE_CONFIG.ACADEMIC_CLASS;
  const isOnline = currentSpace?.meetingType === "ONLINE";
  const location = currentSpace?.location || currentSpace?.room;
  const isMeetingLink =
    location &&
    (location.startsWith("http://") ||
      location.startsWith("https://") ||
      location.includes("zoom.us") ||
      location.includes("meet.google"));

  const tags = Array.isArray(currentSpace?.tags) ? currentSpace.tags : [];

  const handleCopy = () => {
    let textToCopy = currentSpace?.code || currentSpace?.enrollmentCode || "";
    if (accessType === "open") {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      textToCopy = `${origin}/spaces/join?courseId=${currentSpace?.id || ""}`;
    }
    if (!textToCopy) return;
    navigator.clipboard?.writeText(textToCopy).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-xs ring-1 ring-border">
      {/* Compact Banner Section */}
      <div
        className={`relative h-20 sm:h-28 overflow-hidden ${classTheme.gradientClass}`}
      >
        {(currentSpace?.coverUrl || currentSpace?.cover) && (
          <img
            src={currentSpace.coverUrl || currentSpace.cover}
            alt={`${currentSpace?.title || "Space"} banner`}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/50 via-black/20 to-transparent" />

        {/* Back Link */}
        <div className="absolute left-2.5 top-2.5 z-10">
          <Link
            to={routes.spaces.list}
            className="flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-black/50 backdrop-blur-md shadow-xs border border-white/15"
            aria-label="Back to spaces"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Spaces</span>
          </Link>
        </div>

        {/* Action Controls for Enrolled Members / Leaders */}
        <div className="absolute right-2.5 top-2.5 z-20 flex items-center gap-1.5">
          {isEnrolled && !teacher && (
            <Button
              variant="outline"
              size="sm"
              title="Leave space"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLeaveDialogOpen(true);
              }}
              className="h-7 border-white/20 bg-black/40 px-2.5 text-[11px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
            >
              <LogOut className="mr-1.5 h-3 w-3" />
              <span className="hidden sm:inline">Leave</span>
            </Button>
          )}

          {teacher && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Class settings"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="h-7 w-7 rounded-full border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white focus-visible:ring-1 focus-visible:ring-white"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span className="sr-only">Class settings</span>
                  </Button>
                }
              />

              <DropdownMenuContent
                align="end"
                className="w-48 text-xs font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <DropdownMenuItem
                  onClick={() => setIsEditModalOpen(true)}
                  className="cursor-pointer gap-2"
                >
                  <Pencil className="h-3.5 w-3.5 text-primary" />
                  <span>Edit space details</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setIsArchiveDialogOpen(true)}
                  className="cursor-pointer gap-2 text-amber-600 focus:bg-amber-50 focus:text-amber-700 dark:text-amber-500 dark:focus:bg-amber-950/50 dark:focus:text-amber-400"
                >
                  <Archive className="h-3.5 w-3.5" />
                  <span>Archive space</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete space</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content Section - High-Density layout */}
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:pb-3.5 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Floating Avatar */}
          <div className="-mt-8 h-16 w-16 z-10 shrink-0 overflow-hidden rounded-xl border-3 border-surface bg-canvas shadow-xs sm:-mt-10 sm:h-20 sm:w-20">
            {currentSpace?.logo || currentSpace?.logoUrl ? (
              <img
                src={currentSpace.logo || currentSpace.logoUrl}
                alt={`${currentSpace?.title || "Space"} logo`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-primary/10 text-base sm:text-lg font-bold text-primary">
                {currentSpace?.title?.slice(0, 2)?.toUpperCase() || "SP"}
              </div>
            )}
          </div>

          {/* Title, Badges & Metadata */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${spaceTypeInfo.color}`}
              >
                {spaceTypeInfo.label}
              </span>

              {currentSpace?.subject && (
                <span className="inline-flex items-center rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-text-muted border border-border">
                  {currentSpace.subject}
                </span>
              )}

              {accessType === "open" ? (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Globe size={10} />
                  Public
                </span>
              ) : accessType === "invite" ? (
                <span className="inline-flex items-center gap-0.5 rounded-md bg-zinc-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
                  <Lock size={10} />
                  Invite only
                </span>
              ) : null}

              {/* Tags */}
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="hidden sm:inline-flex items-center rounded-md bg-canvas px-1.5 py-0.5 text-[10px] font-medium text-text-muted border border-border"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-text-heading truncate">
              {currentSpace?.title || currentSpace?.name || "Untitled space"}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
              {currentSpace?.section && (
                <span className="font-medium text-text-main">
                  {currentSpace.section}
                </span>
              )}
              {teacherName && (
                <span>
                  Led by <span className="font-medium text-text-main">{teacherName}</span>
                </span>
              )}

              {/* Meeting / Location Info */}
              {location && (
                <div className="flex items-center gap-1">
                  {isOnline ? (
                    <Video size={11} className="text-primary" />
                  ) : (
                    <MapPin size={11} className="text-text-muted" />
                  )}
                  {isMeetingLink ? (
                    <a
                      href={location}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-primary hover:underline"
                    >
                      <span>Join call</span>
                      <ExternalLink size={9} />
                    </a>
                  ) : (
                    <span>{location}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right CTA / Code Section */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 pt-1 sm:pt-0">
          {/* Join Link / Code Copy Button */}
          {teacher && currentSpace?.code && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted font-medium">Class code:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                title="Click to copy class code"
                className="h-8 gap-1.5 rounded-lg border-border bg-canvas font-mono text-xs font-semibold text-text-main shadow-2xs hover:bg-surface"
              >
                {copied ? (
                  <Check size={12} className="text-emerald-500" />
                ) : (
                  <Copy size={12} className="text-text-muted" />
                )}
                <span>{currentSpace.code}</span>
              </Button>
            </div>
          )}

          {accessType === "open" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-1.5 rounded-lg border-border bg-canvas text-xs font-medium text-text-main shadow-2xs hover:bg-surface"
            >
              {copied ? (
                <Check size={12} className="text-emerald-500" />
              ) : (
                <Globe size={12} className="text-primary" />
              )}
              <span>{copied ? "Link copied" : "Copy join link"}</span>
            </Button>
          )}

          {/* Enrollment Gate / Indicator */}
          {!isEnrolled ? (
            <Button
              onClick={() => onJoin?.()}
              disabled={isJoining}
              size="sm"
              className="h-8 gap-1.5 rounded-lg bg-primary text-xs font-semibold text-white shadow-xs hover:bg-primary-hover"
            >
              <UserPlus size={13} />
              <span>{isJoining ? "Joining…" : "Join Space"}</span>
            </Button>
          ) : !teacher ? (
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Enrolled
            </span>
          ) : null}
        </div>
      </div>

      {/* Edit Space Modal */}
      {teacher && (
        <EditSpaceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          classroom={currentSpace}
        />
      )}

      {/* Action Dialogs (Archive, Delete, Leave) */}
      <SpaceActionDialogs
        spaceTitle={currentSpace?.title || "this space"}
        isArchiveOpen={isArchiveDialogOpen}
        onArchiveClose={() => setIsArchiveDialogOpen(false)}
        onArchiveConfirm={handleArchive}
        isArchiving={isArchiving}
        isDeleteOpen={isDeleteDialogOpen}
        onDeleteClose={() => setIsDeleteDialogOpen(false)}
        onDeleteConfirm={handleDelete}
        isDeleting={isDeleting}
        isLeaveOpen={isLeaveDialogOpen}
        onLeaveClose={() => setIsLeaveDialogOpen(false)}
        onLeaveConfirm={handleLeave}
        isLeaving={isLeaving}
      />
    </div>
  );
}

export const ClassHeader = SpaceHeader;
export default SpaceHeader;
