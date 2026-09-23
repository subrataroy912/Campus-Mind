import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Archive,
  Camera,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Globe,
  ImagePlus,
  KeyRound,
  Link2,
  Lock,
  LogOut,
  MapPin,
  Pencil,
  RefreshCw,
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
import { InviteLinkModal } from "./InviteLinkModal.jsx";
import {
  useArchiveClassroomMutation,
  useCancelJoinRequestMutation,
  useDeleteClassroomMutation,
  useLeaveClassroomMutation,
} from "../api/classroomApi.js";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { useCourseContext } from "../hooks/useCourseContext.js";

export default function ClassHeader({
  classroom,
  isEnrolled: propIsEnrolled,
  onJoin,
  isJoining = false,
  isStaff: propIsStaff,
}) {
  const courseContext = useCourseContext();
  const isStaff = propIsStaff !== undefined ? propIsStaff : (courseContext?.isStaff ?? false);
  const isEnrolled = propIsEnrolled !== undefined ? propIsEnrolled : (courseContext?.isEnrolled ?? true);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  const [archiveClassroom, { isLoading: isArchiving }] =
    useArchiveClassroomMutation();
  const [deleteClassroom, { isLoading: isDeleting }] =
    useDeleteClassroomMutation();
  const [leaveClassroom, { isLoading: isLeaving }] =
    useLeaveClassroomMutation();
  const [cancelJoinRequest, { isLoading: isCancelling }] =
    useCancelJoinRequestMutation();

  const classTheme = getClassTheme(classroom);
  const facilitatorName =
    typeof classroom?.owner === "string"
      ? classroom.owner
      : classroom?.owner?.name ||
        classroom?.ownerName ||
        classroom?.creatorName ||
        "Space Owner";

  const accessType = ["PUBLIC", "PRIVATE", "LINK_ONLY"].includes(
    (classroom?.accessType || "").toUpperCase()
  )
    ? classroom.accessType.toUpperCase()
    : "PUBLIC";

  const membershipStatus = classroom?.membershipStatus?.toUpperCase();
  const isPending = membershipStatus === "PENDING";
  const isRejected = membershipStatus === "REJECTED";

  const tags = Array.isArray(classroom?.tags) ? classroom.tags : [];

  const handleCopy = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const textToCopy = `${origin}/spaces/${classroom?.id || ""}`;
    if (!textToCopy) return;
    navigator.clipboard?.writeText(textToCopy).catch(() => {});
    setCopied(true);
    toast.add({
      title: "Link copied",
      description: "Space link copied to clipboard.",
      type: "success",
    });
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCancelRequest = async () => {
    if (!classroom?.id) return;
    try {
      await cancelJoinRequest(classroom.id).unwrap();
      toast.add({
        title: "Request cancelled",
        description: "Your join request has been cancelled.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Cancellation failed",
        description: parseApiError(err, "Failed to cancel join request.").message,
        type: "error",
      });
    }
  };

  const handleArchive = async () => {
    try {
      await archiveClassroom(classroom.id).unwrap();
      setIsArchiveDialogOpen(false);
      toast.add({
        title: "Space archived",
        description: "This space has been archived.",
        type: "success",
      });
      if (navigate) navigate(routes.spaces.list);
    } catch (err) {
      toast.add({
        title: "Archive failed",
        description: parseApiError(err, "Failed to archive this space.").message,
        type: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClassroom(classroom.id).unwrap();
      setIsDeleteDialogOpen(false);
      toast.add({
        title: "Space deleted",
        description: "This space has been permanently deleted.",
        type: "success",
      });
      if (navigate) navigate(routes.spaces.list);
    } catch (err) {
      toast.add({
        title: "Delete failed",
        description: parseApiError(err, "Failed to delete this space.").message,
        type: "error",
      });
    }
  };

  const handleLeave = async () => {
    try {
      await leaveClassroom(classroom.id).unwrap();
      setIsLeaveDialogOpen(false);
      toast.add({
        title: "Left space",
        description: "You have un-enrolled from this space.",
        type: "success",
      });
      if (navigate) navigate(routes.spaces.list);
    } catch (err) {
      toast.add({
        title: "Leave failed",
        description: parseApiError(err, "Failed to leave this space.").message,
        type: "error",
      });
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-card border border-border/70 shadow-2xs">
      {/* Responsive Facebook-style Banner Section */}
      <div
        className={`relative h-28 sm:h-36 md:h-44 lg:h-52 w-full overflow-hidden ${classTheme.gradientClass} transition-all`}
      >
        {(classroom?.coverUrl || classroom?.cover) && (
          <img
            src={classroom.coverUrl || classroom.cover}
            alt={`${classroom?.title || "Space"} banner`}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Back Link */}
        <div className="absolute left-2.5 top-2.5 z-10 sm:left-3.5 sm:top-3.5">
          <Link
            to={routes.spaces.list}
            className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-black/60 backdrop-blur-md shadow-2xs border border-white/15"
            aria-label="Back to spaces"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Spaces</span>
          </Link>
        </div>

        {/* Settings & Leader Controls */}
        <div className="absolute right-2.5 top-2.5 z-20 flex items-center gap-1.5 sm:right-3.5 sm:top-3.5">
          {isEnrolled && !isStaff && (
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
              <LogOutIcon className="mr-1 h-3 w-3" />
              <span className="hidden sm:inline">Leave</span>
            </Button>
          )}

          {isStaff && (
            <>
              <Button
                variant="outline"
                size="sm"
                title="Change banner & branding (Recommended: 1920 × 480px, 4:1 · Keep important text centered)"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                className="h-7 border-white/20 bg-black/40 px-2.5 text-[11px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60 hover:text-white"
              >
                <ImagePlus className="mr-1.5 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Change banner</span>
              </Button>

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
                    <span>Edit space & branding</span>
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
            </>
          )}
        </div>
      </div>

      {/* Content Section - Facebook-style Left-Anchored Overlapping Identity */}
      <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-end sm:justify-between sm:px-5 sm:pb-3 sm:pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Responsive Floating Logo (h-14 mobile, h-18 tablet, h-21 desktop) */}
          <div className="relative -mt-7 sm:-mt-9 md:-mt-11 h-14 w-14 sm:h-18 sm:w-18 md:h-21 md:w-21 z-10 shrink-0">
            <div className="h-full w-full overflow-hidden rounded-2xl border-2 sm:border-[3px] md:border-4 border-card bg-background shadow-md">
              {classroom?.logo || classroom?.logoUrl ? (
                <img
                  src={classroom.logo || classroom.logoUrl}
                  alt={`${classroom?.title || "Space"} logo`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full w-full place-items-center bg-primary/10 text-xs sm:text-base md:text-lg font-bold text-primary">
                  {classroom?.title?.slice(0, 2)?.toUpperCase() || "SP"}
                </div>
              )}
            </div>

            {/* Quick Logo Edit Button for Leaders */}
            {isStaff && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                className="absolute -bottom-1 -right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-card bg-surface text-muted-foreground shadow-xs transition hover:text-primary hover:bg-canvas cursor-pointer"
                title="Change logo (Recommended: 400 × 400px, 1:1 square · Max 2MB)"
              >
                <Camera className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </button>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-foreground truncate">
                {classroom?.title || "Space"}
              </h1>
            </div>

            <p className="text-xs font-medium text-muted-foreground truncate">
              {classroom?.section || classroom?.subtitle
                ? `${classroom.section || classroom.subtitle} • `
                : ""}
              <span>by {facilitatorName}</span>
              {classroom?.subject ? ` • ${classroom.subject}` : ""}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
              {/* Access type */}
              <span className="inline-flex items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 text-muted-foreground border border-border/60 capitalize font-medium">
                {accessType === "PUBLIC" ? (
                  <Globe className="h-3 w-3 text-muted-foreground" />
                ) : accessType === "LINK_ONLY" ? (
                  <Link2 className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Lock className="h-3 w-3 text-muted-foreground" />
                )}
                <span>
                  {accessType === "PUBLIC"
                    ? "Public"
                    : accessType === "LINK_ONLY"
                    ? "Link only"
                    : "Private"}
                </span>
              </span>

              {/* Space Tags */}
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded bg-accent/60 px-1.5 py-0.2 text-accent-foreground text-[10px] font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons - Compact Single Action */}
        <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-end">
          {!isEnrolled ? (
            accessType === "PRIVATE" ? (
              isPending ? (
                <div className="flex w-full items-center gap-1.5 sm:w-auto">
                  <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Request Pending</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelRequest}
                    disabled={isCancelling}
                    className="h-8 text-xs font-medium"
                  >
                    {isCancelling ? "Cancelling…" : "Cancel"}
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={onJoin}
                  disabled={isJoining}
                  className="w-full sm:w-auto h-8 text-xs font-semibold gap-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>
                    {isJoining
                      ? "Requesting…"
                      : isRejected
                      ? "Re-request to Join"
                      : "Request to Join"}
                  </span>
                </Button>
              )
            ) : accessType === "LINK_ONLY" ? (
              classroom?.inviteToken || onJoin ? (
                <Button
                  size="sm"
                  onClick={onJoin}
                  disabled={isJoining}
                  className="w-full sm:w-auto h-8 text-xs font-semibold gap-1.5"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>{isJoining ? "Joining…" : "Join Space"}</span>
                </Button>
              ) : (
                <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-canvas/70 px-3 py-1.5 text-xs font-medium text-text-muted sm:w-auto">
                  <Lock className="h-3.5 w-3.5 text-text-muted" />
                  <span>Invite only</span>
                </div>
              )
            ) : (
              /* PUBLIC */
              <Button
                size="sm"
                onClick={onJoin}
                disabled={isJoining}
                className="w-full sm:w-auto h-8 text-xs font-semibold gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{isJoining ? "Joining…" : "Join Space"}</span>
              </Button>
            )
          ) : isStaff ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {accessType === "LINK_ONLY" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="w-full sm:w-auto h-8 text-xs gap-1.5"
                >
                  <Link2 className="h-3.5 w-3.5 text-primary" />
                  <span>Invite Link</span>
                </Button>
              ) : (
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
                  <span>{copied ? "Link copied!" : "Copy space link"}</span>
                </Button>
              )}
            </div>
          ) : (
            /* Regular Enrolled Member */
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-canvas/70 px-3 py-1.5 text-xs font-medium text-text-muted sm:w-auto">
                <Check className="h-3.5 w-3.5 text-success" />
                <span className="font-semibold text-text-heading">Enrolled</span>
              </div>
              {accessType !== "LINK_ONLY" && (
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
                  <span>{copied ? "Copied!" : "Copy link"}</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invite Link Modal for Staff */}
      {isInviteModalOpen && (
        <InviteLinkModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          classroom={classroom}
        />
      )}

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
