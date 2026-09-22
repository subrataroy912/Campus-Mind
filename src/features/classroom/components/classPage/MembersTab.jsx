import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { MessageCircle, MoreVertical, Search, Ticket, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ClassroomAvatar } from "../ClassroomAvatar.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { routes } from "@/routes/paths.js";
import {
  useGetClassroomRosterQuery,
  useUpdateClassroomMutation,
  useRemoveCourseMemberMutation,
  useUpdateMemberRoleMutation,
} from "../../api/classroomApi.js";
import { toast } from "@/components/ui/toast.jsx";
import { parseApiError } from "@/lib/errorUtils.js";

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
  const canManage = !isOwner && (isCurrentOwner || (isCurrentAdmin && isMember));

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
        <div className="relative">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Manage ${memberName}`}
            onClick={() =>
              setConfirming(confirming === memberId ? null : memberId)
            }
            className="rounded-lg text-text-muted hover:text-text-main"
          >
            <MoreVertical className="h-4 w-4" aria-hidden="true" />
          </Button>
          {confirming === memberId && (
            <div className="absolute right-0 top-9 z-10 w-56 rounded-xl bg-surface p-3 shadow-lg ring-1 ring-border">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export function MembersTab({
  classroom,
  teacher,
  isEnrolled = true,
  onJoin,
  isJoining = false,
}) {
  const [query, setQuery] = useState("");
  const [confirming, setConfirming] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [updatingRoleId, setUpdatingRoleId] = useState(null);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const { user, authStatus } = useAuth();

  const [updateClassroom, { isLoading: isUpdatingInvite }] = useUpdateClassroomMutation();
  const [removeCourseMember] = useRemoveCourseMemberMutation();
  const [updateMemberRole] = useUpdateMemberRoleMutation();

  const currentUserId = user?.id;
  const isCurrentOwner =
    String(classroom?.role || "").toLowerCase() === "owner" ||
    Boolean(currentUserId && classroom?.ownerId === currentUserId);
  const isCurrentAdmin = String(classroom?.role || "").toLowerCase() === "admin";
  const isStaff = isCurrentOwner || isCurrentAdmin || teacher;

  const handleToggleInvite = async () => {
    const isCurrentlyEnabled = classroom?.enrollmentEnabled !== false;
    try {
      await updateClassroom({
        courseId: classroom?.id,
        changes: { enrollmentEnabled: !isCurrentlyEnabled },
      }).unwrap();
      toast.add({
        title: !isCurrentlyEnabled ? "Invite code enabled" : "Invite code disabled",
        description: !isCurrentlyEnabled
          ? "New members can now join with the space code."
          : "Joining with code has been turned off for this space.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Update failed",
        description: parseApiError(err, "Failed to update invite code setting.").message,
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
        description: parseApiError(err, "Failed to remove member from space.").message,
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
        description: parseApiError(err, "Failed to update member role.").message,
        type: "error",
      });
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const { data: roster = [] } = useGetClassroomRosterQuery(classroom?.id, {
    skip: authStatus === "hydrating" || !classroom?.id || !isEnrolled,
  });

  const members = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter((member) =>
      String(member?.name || member?.displayName || "")
        .toLowerCase()
        .includes(q)
    );
  }, [roster, query]);

  const staffMembers = useMemo(() => {
    return members.filter((x) => {
      const r = String(x?.role || "").toLowerCase();
      return r === "owner" || r === "admin" || r === "teacher";
    });
  }, [members]);

  const generalMembers = useMemo(() => {
    return members.filter((x) => {
      const r = String(x?.role || "").toLowerCase();
      return r !== "owner" && r !== "admin" && r !== "teacher";
    });
  }, [members]);

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
          {onJoin && (
            <Button onClick={onJoin} loading={isJoining} size="sm" className="mt-3.5 gap-1.5 rounded-lg text-xs">
              <UserPlus className="h-3.5 w-3.5" />
              <span>Join Space</span>
            </Button>
          )}
        </div>
      </section>
    );
  }

  const enrollmentCode = classroom?.code || classroom?.enrollmentCode;

  return (
    <section className="mt-3">
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                loading={isUpdatingInvite}
                onClick={handleToggleInvite}
                className="h-7 rounded-md gap-1.5 text-xs border-border/70"
              >
                <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {classroom?.enrollmentEnabled !== false
                    ? `Code: ${enrollmentCode}`
                    : "Code disabled"}
                </span>
              </Button>
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
            className="w-full rounded-lg border border-border/60 bg-muted/30 py-1.5 pl-8 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring/50"
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
                <div className="grid overflow-hidden rounded-lg border border-border/70 divide-y divide-border/60 bg-card sm:grid-cols-2 sm:divide-x">
                  {(showAllMembers ? generalMembers : generalMembers.slice(0, 50)).map((m) => (
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
                {generalMembers.length > 50 && (
                  <div className="pt-2 text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllMembers((prev) => !prev)}
                      className="rounded-md text-xs h-7"
                    >
                      {showAllMembers
                        ? "Show fewer members"
                        : `Show all ${generalMembers.length} members`}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
