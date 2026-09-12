import { Link } from "react-router";
import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Globe,
  GraduationCap,
  MapPin,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ClassroomAvatar } from "../ClassroomAvatar.jsx";

export function ClassHomeTab({
  isEnrolled = true,
  onJoin,
  isJoining = false,
  classroom,
}) {
  const accessType = (
    classroom?.accessType ||
    (classroom?.visibility === "PUBLIC" ? "open" : "code")
  ).toLowerCase();

  const teacherName =
    typeof classroom?.teacher === "string"
      ? classroom.teacher
      : classroom?.teacher?.name ||
        classroom?.instructor?.name ||
        classroom?.teacherName ||
        classroom?.ownerName ||
        "CampusMind Instructor";

  const teacherAvatar =
    classroom?.teacher?.avatarUrl ||
    classroom?.teacher?.avatar ||
    classroom?.ownerAvatarUrl ||
    null;

  const targetGrade = classroom?.targetGrade || classroom?.gradeLevel;
  const isMeetingLink =
    classroom?.room &&
    (classroom.room.startsWith("http://") ||
      classroom.room.startsWith("https://") ||
      classroom.room.includes("zoom.us") ||
      classroom.room.includes("meet.google"));

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
    <div className="mt-4 space-y-6">
      {/* Preview Banner for Non-Enrolled Users */}
      {!isEnrolled && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-text-main shadow-xs">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Globe className="h-3.5 w-3.5" />
                Course Preview
              </div>
              <h3 className="text-base font-semibold text-text-heading">
                You are previewing this course
              </h3>
              <p className="text-sm text-text-muted max-w-xl">
                Join now to participate in class discussions, access assignments and resources, submit coursework, and connect with your instructor and classmates.
              </p>
            </div>
            {accessType === "invite" ? (
              <span className="shrink-0 rounded-xl border border-border bg-canvas px-4 py-2 text-xs font-medium text-text-muted">
                Invite only
              </span>
            ) : accessType === "code" && classroom?.visibility !== "PUBLIC" ? (
              <Link
                to={`/dashboard/class/join?courseId=${encodeURIComponent(classroom?.id || "")}&accessType=code`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-primary-hover"
              >
                <UserPlus className="h-4 w-4" />
                <span>Join with Code</span>
              </Link>
            ) : onJoin ? (
              <Button
                onClick={onJoin}
                disabled={isJoining}
                className="shrink-0 gap-2 rounded-xl font-medium"
              >
                <UserPlus className="h-4 w-4" />
                <span>{isJoining ? "Joining…" : "Join Class"}</span>
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {/* Course Overview & Metadata Card */}
      <div className="rounded-2xl bg-surface p-5 ring-1 ring-border shadow-xs sm:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-text-heading">
            About this class
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text-main whitespace-pre-line">
            {classroom?.description?.trim() ||
              "No detailed description provided for this class yet. Check back soon for course syllabus, goals, and announcements."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-2 border-t border-border">
          {/* Subject */}
          <div className="flex items-start gap-3 rounded-xl bg-canvas/50 p-3 border border-border/60">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-muted">Subject</p>
              <p className="mt-0.5 text-sm font-semibold text-text-heading truncate">
                {classroom?.subject || "General"}
              </p>
            </div>
          </div>

          {/* Target Grade */}
          <div className="flex items-start gap-3 rounded-xl bg-canvas/50 p-3 border border-border/60">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-muted">Target Grade</p>
              <p className="mt-0.5 text-sm font-semibold text-text-heading truncate">
                {targetGrade || "All Levels"}
              </p>
            </div>
          </div>

          {/* Room / Location / Meeting link */}
          <div className="flex items-start gap-3 rounded-xl bg-canvas/50 p-3 border border-border/60">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-muted">Location / Room</p>
              {isMeetingLink ? (
                <a
                  href={classroom.room}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-0.5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline truncate"
                >
                  <span className="truncate">Online Meeting</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                <p className="mt-0.5 text-sm font-semibold text-text-heading truncate">
                  {classroom?.room || "Not specified"}
                </p>
              )}
            </div>
          </div>

          {/* Schedule */}
          <div className="flex items-start gap-3 rounded-xl bg-canvas/50 p-3 border border-border/60">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 shrink-0">
              <Clock className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-text-muted">Schedule</p>
              <p className="mt-0.5 text-sm font-semibold text-text-heading truncate">
                {scheduleText || "Flexible / Async"}
              </p>
            </div>
          </div>
        </div>

        {/* Teacher Profile & Enrollment Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <ClassroomAvatar
              name={teacherName}
              avatar={teacherAvatar}
              size="h-11 w-11"
            />
            <div>
              <p className="text-xs font-medium text-text-muted">Instructor</p>
              <p className="text-sm font-bold text-text-heading">{teacherName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="h-4 w-4 text-primary" />
              <span>{classroom?.memberCount ?? 0} enrolled members</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Shield className="h-4 w-4 text-primary" />
              <span className="capitalize">{accessType} Enrollment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Stream & Updates */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-text-heading">
          Class Stream & Updates
        </h3>
        <EmptyState
          title="No class updates yet"
          description="Announcements, discussions, and class updates will appear here when your instructor posts them."
        />
      </div>
    </div>
  );
}
