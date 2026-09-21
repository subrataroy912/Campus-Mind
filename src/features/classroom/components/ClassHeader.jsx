import { useState } from "react";
import { Link, useNavigate } from "react-router";
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
  LogOutIcon,
  PencilIcon,
} from "lucide-react";
import { ClassroomIcon } from "./ClassroomIcon.jsx";
import { getClassTheme } from "../utils/classTheme.js";
import { routes } from "@/routes/paths";
import { Button } from "@/components/ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { EditSpaceModal } from "./EditSpaceModal.jsx";
import {
  useArchiveClassroomMutation,
  useDeleteClassroomMutation,
  useLeaveClassroomMutation,
} from "../api/classroomApi.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

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

export default function ClassHeader({
  classroom,
  isEnrolled = true,
  onJoin,
  isJoining = false,
  teacher = false,
}) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const [archiveClassroom, { isLoading: isArchiving }] =
    useArchiveClassroomMutation();
  const [deleteClassroom, { isLoading: isDeleting }] =
    useDeleteClassroomMutation();
  const [leaveClassroom, { isLoading: isLeaving }] =
    useLeaveClassroomMutation();

  const classTheme = getClassTheme(classroom);
  const teacherName =
    typeof classroom?.teacher === "string"
      ? classroom.teacher
      : classroom?.teacher?.name ||
        classroom?.instructor?.name ||
        classroom?.teacherName ||
        classroom?.ownerName ||
        "CampusMind Facilitator";

  const accessType = (
    classroom?.accessType ||
    (classroom?.visibility === "PUBLIC" ? "Public" : "code")
  ).toLowerCase();

  const spaceTypeInfo =
    SPACE_TYPE_CONFIG[classroom?.spaceType] || SPACE_TYPE_CONFIG.ACADEMIC_CLASS;
  const isOnline = classroom?.meetingType === "ONLINE";
  const location = classroom?.location || classroom?.room;
  const isMeetingLink =
    location &&
    (location.startsWith("http://") ||
      location.startsWith("https://") ||
      location.includes("zoom.us") ||
      location.includes("meet.google"));

  const tags = Array.isArray(classroom?.tags) ? classroom.tags : [];

  const handleCopy = () => {
    let textToCopy = classroom?.code || classroom?.enrollmentCode || "";
    if (accessType === "open") {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      textToCopy = `${origin}/join?courseId=${classroom?.id || ""}`;
    }
    if (!textToCopy) return;
    navigator.clipboard?.writeText(textToCopy).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleArchive = async () => {
    try {
      await archiveClassroom(classroom.id).unwrap();
      setIsArchiveDialogOpen(false);
      if (navigate) navigate(routes.spaces.list);
    } catch (err) {
      console.error("Failed to archive space", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClassroom(classroom.id).unwrap();
      setIsDeleteDialogOpen(false);
      if (navigate) navigate(routes.spaces.list);
    } catch (err) {
      console.error("Failed to delete space", err);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveClassroom(classroom.id).unwrap();
      setIsLeaveDialogOpen(false);
      if (navigate) navigate(routes.spaces.list);
    } catch (err) {
      console.error("Failed to leave space", err);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-xs ring-1 ring-border">
      {/* Compact Banner Section */}
      <div
        className={`relative h-20 sm:h-28 overflow-hidden ${classTheme.gradientClass}`}
      >
        {(classroom?.coverUrl || classroom?.cover) && (
          <img
            src={classroom.coverUrl || classroom.cover}
            alt={`${classroom?.title || "Space"} banner`}
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

        {/* Settings Dropdown for Teachers / Leaders */}
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
              <LogOutIcon className="mr-1.5 h-3 w-3" />
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
                  <PencilIcon className="h-3.5 w-3.5 text-primary" />
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
      <div className="flex flex-col gap-2 p-2.5 sm:flex-row sm:items-end sm:justify-between sm:px-4 sm:pb-3 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Compact Floating Avatar */}
          <div className="-mt-7 h-14 w-14 z-10 shrink-0 overflow-hidden rounded-xl border-3 border-surface bg-canvas shadow-xs sm:-mt-8 sm:h-16 sm:w-16">
            {classroom?.logo || classroom?.logoUrl ? (
              <img
                src={classroom.logo || classroom.logoUrl}
                alt={`${classroom?.title || "Space"} logo`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-primary/10 text-sm sm:text-base font-bold text-primary">
                {classroom?.title?.slice(0, 2)?.toUpperCase() || "SP"}
              </div>
            )}
          </div>

          {/* Title, Badges & Metadata */}
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-text-heading truncate">
                {classroom?.title || "Space"}
              </h1>
              <span
                className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${spaceTypeInfo.color}`}
              >
                {spaceTypeInfo.label}
              </span>
            </div>

            <p className="text-xs font-medium text-text-muted truncate">
              {classroom?.section || classroom?.subtitle
                ? `${classroom.section || classroom.subtitle} • `
                : ""}
              <span>with {teacherName}</span>
              {classroom?.subject ? ` • ${classroom.subject}` : ""}
            </p>

            {/* Badges & Location Line */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
              {/* Meeting format */}
              <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-1.5 py-0.5 text-text-muted border border-border font-medium">
                {isOnline ? (
                  <Video className="h-3 w-3 text-primary" />
                ) : (
                  <MapPin className="h-3 w-3 text-primary" />
                )}
                {isMeetingLink ? (
                  <a
                    href={location}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-primary hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Online Room</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                ) : (
                  <span>
                    {location ||
                      (classroom?.meetingType === "ONLINE"
                        ? "Online"
                        : "In-Person")}
                  </span>
                )}
              </span>

              {/* Access type */}
              <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-1.5 py-0.5 text-text-muted border border-border capitalize font-medium">
                <ClassroomIcon
                  name={
                    accessType === "open"
                      ? "globe"
                      : accessType === "code"
                      ? "key"
                      : "lock"
                  }
                  className="h-3 w-3 text-text-muted"
                />
                <span>{accessType}</span>
              </span>

              {/* Space Tags */}
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-accent/40 px-1.5 py-0.5 text-text-muted text-[10px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-end">
          {!isEnrolled ? (
            accessType === "invite" ? (
              <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-canvas/70 px-3 py-1.5 text-xs font-medium text-text-muted sm:w-auto">
                <Lock className="h-3.5 w-3.5 text-text-muted" />
                <span>Invite only</span>
              </div>
            ) : accessType === "code" && classroom?.visibility !== "PUBLIC" ? (
              <Link
                to={`${routes.classes.join}?courseId=${encodeURIComponent(
                  classroom?.id || ""
                )}&accessType=code`}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-primary-hover sm:w-auto"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Join with Code</span>
              </Link>
            ) : (
              <Button
                size="sm"
                onClick={onJoin}
                disabled={isJoining}
                className="w-full sm:w-auto h-8 text-xs font-semibold gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{isJoining ? "Joining•" : "Join Space"}</span>
              </Button>
            )
          ) : accessType === "open" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="w-full sm:w-auto h-8 text-xs gap-1.5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-text-muted" />
              )}
              <span>{copied ? "Link copied!" : "Copy join link"}</span>
            </Button>
          ) : teacher ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="w-full sm:w-auto h-8 text-xs gap-1.5 font-mono"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-success" />
              ) : (
                <KeyRound className="h-3.5 w-3.5 text-primary" />
              )}
              <span>
                {copied ? "Copied!" : "Class code: "}
                {!copied && (
                  <span className="font-mono text-primary">
                    {classroom?.code}
                  </span>
                )}
              </span>
            </Button>
          ) : (
            <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-canvas/70 px-3 py-1.5 text-xs font-medium text-text-muted sm:w-auto">
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="font-semibold text-text-heading">Enrolled</span>
            </div>
          )}
        </div>
      </div>

      {/* Edit Space Modal */}
      {isEditModalOpen && (
        <EditSpaceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          classroom={classroom}
        />
      )}

      {/* Archive Confirmation Dialog */}
      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent className="max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-heading">
              Archive Space?
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              Archiving hides this space from active lists and disables new
              enrollments, while preserving past discussions and submissions.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsArchiveDialogOpen(false)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={handleArchive}
              disabled={isArchiving}
            >
              {isArchiving ? "Archiving•" : "Archive"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-heading">
              Delete Space Permanently?
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              This action cannot be undone. All materials, coursework, member
              records, and announcements will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting•" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Space Confirmation Dialog */}
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-text-heading">
              Leave this Space?
            </DialogTitle>
            <DialogDescription className="text-xs text-text-muted">
              You will lose access to member updates, resources, and discussions
              until you re-enroll with an invite code.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLeaveDialogOpen(false)}
              disabled={isLeaving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLeave}
              disabled={isLeaving}
            >
              {isLeaving ? "Leaving•" : "Leave Space"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
