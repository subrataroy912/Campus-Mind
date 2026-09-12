import { Link } from "react-router";
import { Clock3, Globe, KeyRound, Lock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge.jsx";
import { formatDisplayText } from "@/utils/textFormat.js";
import { useDashboardData } from "@/features/dashboard/useDashboardData.js";

export default function ExploreClassCard({ classroom }) {
  const { classrooms = [] } = useDashboardData();

  const courseId = classroom.courseId || classroom.id;

  const activity = classroom.lastActivityAt
    ? new Date(classroom.lastActivityAt).toLocaleDateString()
    : "No recent activity";

  const isEnrolled = classrooms.some(
    (c) => c.id === courseId || c.courseId === courseId
  );
  const accessType = (classroom.accessType || "OPEN").toUpperCase();

  let target;
  if (isEnrolled || accessType === "OPEN") {
    target = `/dashboard/classes/${courseId}`;
  } else if (accessType === "INVITE") {
    target = `/dashboard/class/join?courseId=${encodeURIComponent(courseId)}&accessType=invite`;
  } else {
    target = classroom.code
      ? `/dashboard/class/join?courseId=${encodeURIComponent(courseId)}&accessType=code&code=${encodeURIComponent(classroom.code)}`
      : `/dashboard/class/join?courseId=${encodeURIComponent(courseId)}&accessType=code`;
  }

  return (
    <Link
      to={target}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <div className="h-2 w-full bg-primary" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-canvas text-text-main border-border"
              >
                {formatDisplayText(classroom.subject || "General")}
              </Badge>
              {isEnrolled ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                  Enrolled
                </span>
              ) : accessType === "OPEN" ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  <Globe size={11} /> Public
                </span>
              ) : accessType === "INVITE" ? (
                <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-0.5 text-xs font-medium text-text-muted">
                  <Lock size={11} /> Invite only
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-0.5 text-xs font-medium text-text-muted">
                  <KeyRound size={11} /> Code required
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-text-heading line-clamp-1">
              {classroom.title}
            </h3>
          </div>
        </div>
        <div className="mt-4 flex min-h-12 flex-wrap gap-2">
          {classroom.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-sm text-text-muted">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted">
            <Users size={16} aria-hidden="true" />
            {classroom.enrollmentCount} learners
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={16} aria-hidden="true" />
            {activity}
          </span>
        </div>
      </div>
    </Link>
  );
}
