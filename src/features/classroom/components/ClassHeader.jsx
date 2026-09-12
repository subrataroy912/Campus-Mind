import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, UserPlus } from "lucide-react";
import { ClassroomIcon } from "./ClassroomIcon.jsx";
import { getClassTheme } from "../utils/classTheme.js";

export default function ClassHeader({
  classroom,
  isEnrolled = true,
  onJoin,
  isJoining = false,
  teacher = false,
}) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const classTheme = getClassTheme(classroom);
  const teacherName =
    typeof classroom?.teacher === "string"
      ? classroom.teacher
      : classroom?.teacher?.name ||
        classroom?.instructor?.name ||
        classroom?.teacherName ||
        classroom?.ownerName ||
        "CampusMind Instructor";

  const accessType = (
    classroom?.accessType ||
    (classroom?.visibility === "PUBLIC" ? "open" : "code")
  ).toLowerCase();

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
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border">
      {/* Banner Section */}
      <div
        className={`relative h-28 sm:h-36 overflow-hidden ${classTheme.gradientClass}`}
      >
        {(classroom?.coverUrl || classroom?.cover) && (
          <img
            src={classroom.coverUrl || classroom.cover}
            alt={`${classroom?.title || "Class"} banner`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Scrim: Subtle overall dimming + top gradient for button contrast */}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 via-black/20 to-transparent" />

        {/* Back Link */}
        <div className="absolute left-3 top-3 z-10">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-full bg-black/30 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black/45 backdrop-blur-md shadow-xs border border-white/15"
            aria-label="Back to dashboard classes"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Classes</span>
          </Link>
        </div>
        {/* Settings Dropdown - Only visible to teachers / instructors */}
        {teacher && (
          <div className="absolute right-3 top-3 z-10">
            <div className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Class settings"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white transition hover:bg-black/45 backdrop-blur-md border border-white/15 shadow-xs cursor-pointer"
              >
                <ClassroomIcon name="settings" className="h-5 w-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-11 z-10 w-52 overflow-hidden rounded-lg bg-surface py-1 shadow-lg ring-1 ring-border">
                  {[
                    "Edit class details",
                    "Change theme",
                    "Notification preferences",
                  ].map((label) => (
                    <button
                      key={label}
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3.5 py-2 text-left text-sm text-text-main hover:bg-canvas transition-colors cursor-pointer"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6 sm:pt-0">
        {/* Logo & Title Group */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
          {/* Floating Logo */}
          <div className="-mt-12 h-20 w-20 z-20 shrink-0 overflow-hidden rounded-2xl border-4 border-surface bg-canvas shadow-sm sm:-mt-14 sm:h-24 sm:w-24">
            {classroom?.logo || classroom?.logoUrl ? (
              <img
                src={classroom.logo || classroom.logoUrl}
                alt={`${classroom?.title || "Class"} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-primary/10 text-xl font-bold text-primary">
                {classroom?.title?.slice(0, 2)?.toUpperCase() || "CL"}
              </div>
            )}
          </div>

          {/* Title, Subtitle, and Badges */}
          <div className="mb-1 sm:mb-2 space-y-1.5">
            <h1 className="text-xl font-bold text-text-heading sm:text-2xl line-clamp-1">
              {classroom?.title || "Class"}
            </h1>
            <p className="text-sm font-medium text-text-muted line-clamp-1">
              {classroom?.section || classroom?.subtitle}
              {(classroom?.section || classroom?.subtitle) && teacherName
                ? " · "
                : ""}
              {teacherName}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {classroom?.subject && (
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {classroom.subject}
                </span>
              )}
              {(classroom?.targetGrade || classroom?.gradeLevel) && (
                <span className="inline-flex items-center rounded-md bg-canvas px-2 py-0.5 text-xs font-medium text-text-muted border border-border">
                  {classroom.targetGrade || classroom.gradeLevel}
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-md bg-canvas px-2 py-0.5 text-xs font-medium text-text-muted border border-border">
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
                <span className="capitalize">{accessType}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Button based on Enrollment / Access Type */}
        {!isEnrolled ? (
          accessType === "invite" ? (
            <div className="flex w-full items-center justify-center gap-2 self-start rounded-xl border border-border bg-canvas/70 px-4 py-2 text-sm font-medium text-text-muted sm:mb-2 sm:w-auto sm:self-auto">
              <ClassroomIcon name="lock" className="h-4 w-4 text-text-muted" />
              <span>Invite only</span>
            </div>
          ) : accessType === "code" && classroom?.visibility !== "PUBLIC" ? (
            <Link
              to={`/dashboard/class/join?courseId=${encodeURIComponent(
                classroom?.id || ""
              )}&accessType=code`}
              className="flex w-full items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover sm:mb-2 sm:w-auto sm:self-auto cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Join with Code</span>
            </Link>
          ) : (
            <button
              onClick={onJoin}
              disabled={isJoining}
              className="flex w-full items-center justify-center gap-2 self-start rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:mb-2 sm:w-auto sm:self-auto cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>{isJoining ? "Joining class…" : "Join Class"}</span>
            </button>
          )
        ) : accessType === "invite" ? (
          <div className="flex w-full items-center justify-center gap-2 self-start rounded-xl border border-border bg-canvas/70 px-4 py-2 text-sm font-medium text-text-muted sm:mb-2 sm:w-auto sm:self-auto">
            <ClassroomIcon name="lock" className="h-4 w-4 text-text-muted" />
            <span>Invite only</span>
          </div>
        ) : accessType === "open" ? (
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-2 self-start rounded-xl border border-border bg-canvas px-4 py-2 text-sm font-semibold text-text-main transition hover:bg-border/50 sm:mb-2 sm:w-auto sm:self-auto cursor-pointer"
          >
            <ClassroomIcon
              name={copied ? "check" : "link"}
              className={`h-4 w-4 ${
                copied ? "text-success" : "text-text-muted"
              }`}
            />
            {copied ? (
              <span className="text-success">Link copied!</span>
            ) : (
              <span>Copy join link</span>
            )}
          </button>
        ) : teacher ? (
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-2 self-start rounded-xl border border-border bg-canvas px-4 py-2 text-sm font-semibold text-text-main transition hover:bg-border/50 sm:mb-2 sm:w-auto sm:self-auto cursor-pointer"
          >
            <ClassroomIcon
              name={copied ? "check" : "copy"}
              className={`h-4 w-4 ${
                copied ? "text-success" : "text-text-muted"
              }`}
            />
            {copied ? (
              <span className="text-success">Copied to clipboard</span>
            ) : (
              <span>
                Class code:{" "}
                <span className="font-mono text-primary">
                  {classroom?.code}
                </span>
              </span>
            )}
          </button>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 self-start rounded-xl border border-border bg-canvas/70 px-4 py-2 text-sm font-medium text-text-muted sm:mb-2 sm:w-auto sm:self-auto">
            <ClassroomIcon name="check" className="h-4 w-4 text-success" />
            <span className="text-text-heading font-semibold">Enrolled</span>
          </div>
        )}
      </div>
    </div>
  );
}
