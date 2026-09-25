import React, { useMemo, useState, useRef, useLayoutEffect } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Link } from "react-router";
import {
  Check,
  Clock,
  Copy,
  MessageCircle,
  MoreVertical,
  Search,
  Ticket,
  UserPlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ClassroomAvatar } from "../ClassroomAvatar.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useGetClassroomRosterQuery,
  useUpdateClassroomMutation,
  useRemoveCourseMemberMutation,
  useUpdateMemberRoleMutation,
  useGetPendingJoinRequestsQuery,
  useApproveJoinRequestMutation,
  useDeclineJoinRequestMutation,
} from "../../api/classroomApi.js";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";
import {
  useCourseIsEnrolled,
  useCourseIsStaff,
} from "../../hooks/useCourseContext.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.jsx";

// File-scoped, memoized row component to avoid re-creation on parent re-renders
const MemberRow = React.memo(function MemberRow({
  member,
  isCurrentOwner,
  isCurrentAdmin,
  confirming,
  setConfirming,
  onRemove,
  isRemoving,
  onUpdateRole,
  isUpdatingRole,
}) {
  const memberName =
    member?.name ||
    member?.displayName ||
    (member?.userId ? `Member (${member.userId.slice(-4)})` : "Space Member");
  const memberId = member?.id || member?.userId || "";
  const role = String(member?.role || "member").toLowerCase();
  const isOwner = role === "owner";
  const isAdmin = role === "admin";
  const isMember = !isOwner && !isAdmin;

  // Permissions:
  // - Cannot manage space owner
  // - Space owner can manage admins and members
  // - Space admin can manage regular members only
  const canManage =
    !isOwner && (isCurrentOwner || (isCurrentAdmin && isMember));

  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-canvas/50 transition-colors">
      <div className="relative">
        <ClassroomAvatar
          name={memberName}
          userId={memberId}
          avatar={member?.avatar || member?.avatarUrl}
          size="h-8 w-8"
        />
        {member?.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
        )}
      </div>
      {memberId ? (
        <Link
          to={routes.user(memberId)}
          className="min-w-0 flex-1 truncate text-sm font-medium text-text-main hover:text-primary hover:underline transition-colors"
        >
          {memberName}
        </Link>
      ) : (
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-main">
          {memberName}
        </span>
      )}
      {isOwner && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          Owner
        </span>
      )}
      {isAdmin && (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
          Admin
        </span>
      )}
      {isMember && (
        <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-text-muted">
          Member
        </span>
      )}
      <Button
        to={`${routes.messages}?member=${memberId}`}
        variant="ghost"
        size="icon-sm"
        aria-label={`Message ${memberName}`}
        className="rounded-lg text-text-muted hover:text-text-main"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
      </Button>
      {canManage && (
        <Popover
          open={confirming === memberId}
          onOpenChange={(open) =>
            setConfirming(open ? memberId : null)
          }
        >
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Manage ${memberName}`}
                className="rounded-lg text-text-muted hover:text-text-main"
              >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />
          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="w-56 rounded-xl bg-surface p-3 text-text-main shadow-lg ring-1 ring-border border-0"
          >
            <p className="text-xs font-medium text-text-main mb-2">
              Manage {memberName}
            </p>
            <div className="flex flex-col gap-1.5">
              {isCurrentOwner && isMember && (
                <Button
                  variant="outline"
                  size="sm"
                  loading={isUpdatingRole}
                  onClick={() => onUpdateRole(memberId, "ADMIN")}
                  className="w-full justify-start text-xs h-7"
                >
                  Promote to Admin
                </Button>
              )}
              {isCurrentOwner && isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  loading={isUpdatingRole}
                  onClick={() => onUpdateRole(memberId, "MEMBER")}
                  className="w-full justify-start text-xs h-7"
                >
                  Demote to Member
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                loading={isRemoving}
                onClick={() => onRemove(memberId)}
                className="w-full justify-start text-xs h-7"
              >
                Remove from Space
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={isRemoving || isUpdatingRole}
                onClick={() => setConfirming(null)}
                className="w-full justify-start text-xs h-7"
              >
                Cancel
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
});

export function MembersTab({
  classroom,
  isStaff: isStaffProp,
  isEnrolled: isEnrolledProp,
}) {
  const contextIsEnrolled = useCourseIsEnrolled();
  const contextIsStaff = useCourseIsStaff();
  const isEnrolled = isEnrolledProp !== undefined ? isEnrolledProp : (contextIsEnrolled ?? true);
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const { user, authStatus } = useAuth();

  const [updateClassroom, { isLoading: isUpdatingInvite }] =
    useUpdateClassroomMutation();
  const [removeCourseMember] = useRemoveCourseMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();

  const currentUserId = user?.id;
  const isCurrentOwner =
    String(classroom?.role || "").toLowerCase() === "owner" ||
    Boolean(currentUserId && classroom?.ownerId === currentUserId);
  const isCurrentAdmin =
    String(classroom?.role || "").toLowerCase() === "admin";
  const isStaff =
    isStaffProp !== undefined
      ? isStaffProp
      : contextIsStaff ?? (isCurrentOwner || isCurrentAdmin);

  const enrollmentCode = classroom?.code || classroom?.enrollmentCode;
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (!enrollmentCode) return;
    navigator.clipboard?.writeText(enrollmentCode).catch(() => {});
    setCopiedCode(true);
    toast.add({
      title: "Code copied",
      description: `Space code ${enrollmentCode} copied to clipboard.`,
      type: "success",
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleToggleInvite = async () => {
    const isCurrentlyEnabled = classroom?.enrollmentEnabled !== false;
    const effectiveCourseId =
      classroom?.id || classroom?.courseId || classroom?._id;
    if (!effectiveCourseId) return;

    try {
      await updateClassroom({
        courseId: effectiveCourseId,
        changes: { enrollmentEnabled: !isCurrentlyEnabled },
      }).unwrap();
      toast.add({
        title: !isCurrentlyEnabled
          ? "Invite code enabled"
          : "Invite code disabled",
        description: !isCurrentlyEnabled
          ? "New members can now join with the space code."
          : "Joining with code has been turned off for this space.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Update failed",
        description: parseApiError(err, "Failed to update invite code setting.")
          .message,
        type: "error",
      });
    }
  };

  const handleRemoveMember = async (memberId) => {
    setRemovingId(memberId);
    try {
      await removeCourseMember({
        courseId: classroom?.id,
        userId: memberId,
      }).unwrap();
      setConfirming(null);
      toast.add({
        title: "Member removed",
        description: "The member has been removed from this space.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Removal failed",
        description: parseApiError(err, "Failed to remove member from space.")
          .message,
        type: "error",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    setUpdatingRoleId(memberId);
    try {
      await updateMemberRole({
        courseId: classroom?.id,
        userId: memberId,
        role: newRole,
      }).unwrap();
      setConfirming(null);
      toast.add({
        title: "Role updated",
        description: `Member has been ${newRole === "ADMIN" ? "promoted to Admin" : "demoted to Member"}.`,
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Update failed",
        description: parseApiError(err, "Failed to update member role.")
          .message,
        type: "error",
      });
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [approveJoinRequest, { isLoading: isApproving }] =
    useApproveJoinRequestMutation();
  const [declineJoinRequest, { isLoading: isDeclining }] =
    useDeclineJoinRequestMutation();

  const { pendingRequests = [] } = useGetPendingJoinRequestsQuery(
    authStatus === "hydrating" || !classroom?.id || !isStaff
      ? skipToken
      : classroom.id,
    {
      selectFromResult: ({ data }) => ({ pendingRequests: data ?? [] }),
    },
  );

  const handleApproveRequest = async (applicantUserId) => {
    setProcessingRequestId(applicantUserId);
    try {
      await approveJoinRequest({
        courseId: classroom?.id,
        userId: applicantUserId,
      }).unwrap();
      toast.add({
        title: "Request approved",
        description: "Member has been accepted into the space.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Approval failed",
        description: parseApiError(err, "Failed to approve join request.")
          .message,
        type: "error",
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  const handleDeclineRequest = async (applicantUserId) => {
    setProcessingRequestId(applicantUserId);
    try {
      await declineJoinRequest({
        courseId: classroom?.id,
        userId: applicantUserId,
      }).unwrap();
      toast.add({
        title: "Request declined",
        description: "Join request has been declined.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Decline failed",
        description: parseApiError(err, "Failed to decline join request.")
          .message,
        type: "error",
      });
    } finally {
      setProcessingRequestId(null);
    }
  };

  const { roster = [] } = useGetClassroomRosterQuery(
    authStatus === "hydrating" || !classroom?.id || !isEnrolled
      ? skipToken
      : classroom.id,
    {
      selectFromResult: ({ data }) => ({ roster: data ?? [] }),
    },
  );

  const members = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter((member) =>
      String(member?.name || member?.displayName || "")
        .toLowerCase()
        .includes(q),
    );
  }, [roster, query]);

  const staffMembers = useMemo(() => {
    return members.filter((x) => {
      const r = String(x?.role || "").toLowerCase();
      return r === "owner" || r === "admin";
    });
  }, [members]);

  const generalMembers = useMemo(() => {
    return members.filter((x) => {
      const r = String(x?.role || "").toLowerCase();
      return r !== "owner" && r !== "admin";
    });
  }, [members]);

  const listRef = useRef(null);
  const [listOffset, setListOffset] = useState(0);

  useLayoutEffect(() => {
    if (listRef.current) {
      setListOffset(
        listRef.current.getBoundingClientRect().top + window.scrollY
      );
    }
  }, [generalMembers.length, query]);

  const virtualizer = useWindowVirtualizer({
    count: generalMembers.length,
    estimateSize: () => 64, // ~64px row height for members
    overscan: 10,
    scrollMargin: listOffset,
  });

  if (!isEnrolled) {
    return (
      <section className="mt-3">
        <div className="rounded-xl border border-dashed border-border/80 bg-card/60 p-6 text-center shadow-2xs">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2.5">
            <UserPlus className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Class roster is only available to members
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground leading-normal">
            Join this space to view members and connect with participants.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-3 space-y-3">
      {/* Pending Requests Queue for Space Staff */}
      {isStaff && pendingRequests.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 sm:p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-foreground">
                Pending Join Requests
              </h3>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.2 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                {pendingRequests.length}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Review requests to join this space
            </span>
          </div>

          <div className="divide-y divide-border/60 rounded-lg border border-border/60 bg-card overflow-hidden">
            {pendingRequests.map((req) => {
              const applicantName = req.name || req.handle || "Applicant";
              const applicantHandle = req.handle
                ? `@${req.handle}`
                : req.email || "";
              const isProcessing = processingRequestId === req.userId;
              return (
                <div
                  key={req.userId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ClassroomAvatar
                      name={applicantName}
                      userId={req.userId}
                      avatar={req.avatarUrl}
                      size="h-8 w-8"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {applicantName}
                      </p>
                      {applicantHandle && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {applicantHandle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <Button
                      size="sm"
                      onClick={() => handleApproveRequest(req.userId)}
                      disabled={isProcessing}
                      className="h-7 text-xs font-semibold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Check className="h-3 w-3" />
                      <span>
                        {isProcessing && isApproving ? "Accepting…" : "Accept"}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeclineRequest(req.userId)}
                      disabled={isProcessing}
                      className="h-7 text-xs font-medium gap-1 text-destructive hover:text-destructive border-border/70"
                    >
                      <X className="h-3 w-3" />
                      <span>
                        {isProcessing && isDeclining ? "Declining…" : "Decline"}
                      </span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-card p-3.5 sm:p-4 border border-border/70 shadow-2xs space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground">
                Members
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.2 text-[10px] font-semibold text-primary">
                {classroom?.memberCount || roster.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enrolled members and administrators in this space.
            </p>
          </div>
          {isStaff && enrollmentCode && (
            <div className="flex items-center gap-1.5">
              {classroom?.enrollmentEnabled !== false ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    title="Click to copy space code"
                    className="h-7 rounded-md gap-1.5 text-xs border-border/70"
                  >
                    <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{`Code: ${enrollmentCode}`}</span>
                    {copiedCode ? (
                      <Check className="h-3 w-3 text-success ml-0.5" />
                    ) : (
                      <Copy className="h-3 w-3 text-muted-foreground ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    loading={isUpdatingInvite}
                    onClick={handleToggleInvite}
                    title="Turn off joining with code"
                    className="h-7 px-2 text-[11px] text-muted-foreground hover:text-destructive"
                  >
                    Disable
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                    <Ticket className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                    <span>Code disabled</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={isUpdatingInvite}
                    onClick={handleToggleInvite}
                    className="h-7 rounded-md px-2 text-xs font-medium text-primary hover:text-primary"
                  >
                    Enable
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <Search
            className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roster members by name…"
            className="w-full rounded-lg border border-border/60 bg-muted/30 py-1.5 pl-8 pr-3 text-base sm:text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/50"
          />
        </div>

        {members.length === 0 ? (
          <EmptyState
            title="No members found"
            description="Try searching with a different name or spelling."
          />
        ) : (
          <div className="space-y-4">
            {staffMembers.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-foreground">
                  Admins &amp; Owner ({staffMembers.length})
                </h3>
                <div className="overflow-hidden rounded-lg border border-border/70 divide-y divide-border/60 bg-card">
                  {staffMembers.map((m) => (
                    <MemberRow
                      key={m.id || m.userId}
                      member={m}
                      isCurrentOwner={isCurrentOwner}
                      isCurrentAdmin={isCurrentAdmin}
                      confirming={confirming}
                      setConfirming={setConfirming}
                      onRemove={handleRemoveMember}
                      isRemoving={removingId === (m.id || m.userId)}
                      onUpdateRole={handleUpdateRole}
                      isUpdatingRole={updatingRoleId === (m.id || m.userId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {generalMembers.length > 0 && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-semibold text-foreground">
                  Members ({generalMembers.length})
                </h3>
                <div
                  ref={listRef}
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: "100%",
                    position: "relative",
                  }}
                  className="rounded-lg border border-border/70 bg-card overflow-hidden"
                >
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const m = generalMembers[virtualRow.index];
                    return (
                      <div
                        key={m.id || m.userId}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${
                            virtualRow.start - virtualizer.options.scrollMargin
                          }px)`,
                        }}
                        className="border-b border-border/60"
                      >
                        <MemberRow
                          member={m}
                          isCurrentOwner={isCurrentOwner}
                          isCurrentAdmin={isCurrentAdmin}
                          confirming={confirming}
                          setConfirming={setConfirming}
                          onRemove={handleRemoveMember}
                          isRemoving={removingId === (m.id || m.userId)}
                          onUpdateRole={handleUpdateRole}
                          isUpdatingRole={updatingRoleId === (m.id || m.userId)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
