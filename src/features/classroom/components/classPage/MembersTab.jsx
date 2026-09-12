import React, { useMemo, useState } from "react";
import { MessageCircle, MoreVertical, Search, Ticket, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ClassroomAvatar } from "../ClassroomAvatar.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import {
  useGetClassroomRosterQuery,
  useUpdateClassroomMutation,
  useRemoveCourseMemberMutation,
} from "../../api/classroomApi.js";


// File-scoped, memoized row component to avoid re-creation on parent re-renders
const MemberRow = React.memo(function MemberRow({
  member,
  teacher,
  confirming,
  setConfirming,
  onRemove,
  isRemoving,
}) {
  const memberName =
    member?.name ||
    member?.displayName ||
    (member?.userId ? `Member (${member.userId.slice(-4)})` : "Class Member");
  const memberId = member?.id || member?.userId || "";
  const isTeacherRole =
    String(member?.role || "").toLowerCase() === "teacher" ||
    String(member?.role || "").toLowerCase() === "owner";

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-canvas/50 transition-colors">
      <div className="relative">
        <ClassroomAvatar
          name={memberName}
          avatar={member?.avatar || member?.avatarUrl}
          size="h-10 w-10"
        />
        {member?.online && (
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-success" />
        )}
      </div>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-main">
        {memberName}
      </span>
      {isTeacherRole && (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
          {String(member?.role).toLowerCase() === "owner" ? "Owner" : "Teacher"}
        </span>
      )}
      <Button
        to={`/dashboard/messages?member=${memberId}`}
        variant="ghost"
        size="icon-sm"
        aria-label={`Message ${memberName}`}
        className="rounded-lg text-text-muted hover:text-text-main"
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
      </Button>
      {teacher && !isTeacherRole && (
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
              <p className="text-xs text-text-muted">
                Remove {memberName} from this class?
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isRemoving}
                  onClick={() => setConfirming(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  loading={isRemoving}
                  onClick={() => onRemove(memberId)}
                >
                  Remove
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
  const { authStatus } = useAuth();

  const [updateClassroom, { isLoading: isUpdatingInvite }] = useUpdateClassroomMutation();
  const [removeCourseMember] = useRemoveCourseMemberMutation();

  const handleToggleInvite = async () => {
    const isCurrentlyEnabled = classroom?.enrollmentEnabled !== false;
    try {
      await updateClassroom({
        courseId: classroom?.id,
        changes: { enrollmentEnabled: !isCurrentlyEnabled },
      }).unwrap();
    } catch (err) {
      console.error("Failed to update invite code setting", err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setRemovingId(memberId);
      await removeCourseMember({
        courseId: classroom?.id,
        userId: memberId,
      }).unwrap();
      setConfirming(null);
    } catch (err) {
      console.error("Failed to remove member", err);
    } finally {
      setRemovingId(null);
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

  const teachers = useMemo(() => {
    return members.filter((x) => {
      const r = String(x?.role || "").toLowerCase();
      return r === "teacher" || r === "owner";
    });
  }, [members]);

  const students = useMemo(() => {
    return members.filter(
      (x) => String(x?.role || "").toLowerCase() === "student"
    );
  }, [members]);

  if (!isEnrolled) {
    return (
      <section className="mt-4">
        <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <UserPlus className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-text-heading">
            Class roster is only available to members
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-text-muted">
            Join this class to view students and teachers and connect with classmates.
          </p>
          {onJoin && (
            <Button onClick={onJoin} loading={isJoining} className="mt-4 gap-2 rounded-xl">
              <UserPlus className="h-4 w-4" />
              <span>Join Class</span>
            </Button>
          )}
        </div>
      </section>
    );
  }

  const enrollmentCode = classroom?.code || classroom?.enrollmentCode;

  return (
    <section className="mt-4">
      <div className="rounded-2xl bg-surface p-5 shadow-xs ring-1 ring-border sm:p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              Class Roster
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-text-heading">
              Members
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {classroom?.memberCount || roster.length} members enrolled in this class
            </p>
          </div>
          {teacher && enrollmentCode && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                loading={isUpdatingInvite}
                onClick={handleToggleInvite}
                className="rounded-xl gap-1.5"
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
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roster members by name…"
            className="w-full rounded-xl border border-border bg-canvas py-2.5 pl-10 pr-4 text-sm text-text-main outline-none focus:ring-2 focus:ring-focus"
          />
        </div>

        {members.length === 0 ? (
          <EmptyState
            title="No members found"
            description="Try searching with a different name or spelling."
          />
        ) : (
          <div className="space-y-6">
            {teachers.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text-heading">
                  Instructors & Teachers ({teachers.length})
                </h3>
                <div className="overflow-hidden rounded-2xl ring-1 ring-border divide-y divide-border bg-surface">
                  {teachers.map((m) => (
                    <MemberRow
                      key={m.id}
                      member={m}
                      teacher={teacher}
                      confirming={confirming}
                      setConfirming={setConfirming}
                      onRemove={handleRemoveMember}
                      isRemoving={removingId === (m.id || m.userId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {students.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text-heading">
                  Students ({students.length})
                </h3>
                <div className="grid overflow-hidden rounded-2xl ring-1 ring-border divide-y divide-border bg-surface sm:grid-cols-2 sm:divide-x">
                  {students.map((m) => (
                    <MemberRow
                      key={m.id}
                      member={m}
                      teacher={teacher}
                      confirming={confirming}
                      setConfirming={setConfirming}
                      onRemove={handleRemoveMember}
                      isRemoving={removingId === (m.id || m.userId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

