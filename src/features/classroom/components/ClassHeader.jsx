import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ClassroomIcon } from "./ClassroomIcon.jsx";

export default function ClassHeader({ classroom }) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const teacherName =
    typeof classroom?.teacher === "string"
      ? classroom.teacher
      : classroom?.teacher?.name || classroom?.instructor?.name || "CampusMind teacher";

  const accessType = (
    classroom?.accessType ||
    (classroom?.visibility === "PUBLIC" ? "open" : "code")
  ).toLowerCase();

  const handleCopy = () => {
    let textToCopy = classroom?.code || "";
    if (accessType === "open") {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
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
        className={`relative h-28 sm:h-36 ${classroom?.theme || "bg-primary"}`}
      >
        {/* Back Link */}
        <div className="absolute left-3 top-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-full bg-surface/25 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-surface/40 backdrop-blur-sm shadow-xs"
            aria-label="Back to dashboard classes"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Classes</span>
          </Link>
        </div>
        {/* Settings Dropdown */}
        <div className="absolute right-3 top-3">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Class settings"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/20 text-surface transition hover:bg-surface/30 backdrop-blur-sm"
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
                    className="block w-full px-3.5 py-2 text-left text-sm text-text-main hover:bg-canvas transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pb-6 sm:pt-0">
        {/* Logo & Title Group */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
          {/* Floating Logo */}
          <div className="-mt-12 h-20 w-20 z-20 shrink-0 overflow-hidden rounded-2xl border-4 border-surface bg-canvas shadow-sm sm:-mt-14 sm:h-24 sm:w-24">
            <img
              src={
                classroom?.logo ||
                "https://testingbot.com/free-online-tools/random-avatar/100"
              }
              alt={`${classroom?.title || "Class"} logo`}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Title and Subtitle */}
          <div className="mb-1 sm:mb-2">
            <h1 className="text-xl font-bold text-text-heading sm:text-2xl line-clamp-1">
              {classroom?.title || "Untitled Class"}
            </h1>
            <p className="mt-1 text-sm font-medium text-text-muted line-clamp-1">
              {classroom?.section || classroom?.subtitle}
              {(classroom?.section || classroom?.subtitle) && teacherName ? " · " : ""}
              {teacherName}
            </p>
          </div>
        </div>

        {/* Action Button based on Access Type */}
        {accessType === "invite" ? (
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
              className={`h-4 w-4 ${copied ? "text-success" : "text-text-muted"}`}
            />
            {copied ? (
              <span className="text-success">Link copied!</span>
            ) : (
              <span>Copy join link</span>
            )}
          </button>
        ) : (
          <button
            onClick={handleCopy}
            className="flex w-full items-center justify-center gap-2 self-start rounded-xl border border-border bg-canvas px-4 py-2 text-sm font-semibold text-text-main transition hover:bg-border/50 sm:mb-2 sm:w-auto sm:self-auto cursor-pointer"
          >
            <ClassroomIcon
              name={copied ? "check" : "copy"}
              className={`h-4 w-4 ${copied ? "text-success" : "text-text-muted"}`}
            />
            {copied ? (
              <span className="text-success">Copied to clipboard</span>
            ) : (
              <span>
                Class code:{" "}
                <span className="font-mono text-primary">{classroom?.code}</span>
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
