import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Globe, KeyRound, Lock, Loader2, X } from "lucide-react";
import { useDashboardData } from "@/features/dashboard/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { joinClassroom } from "@/features/classroom/api/classroomService.js";

const formatLearners = (count) => {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return "0 learners";
  if (value === 1) return "1 learner";
  if (value >= 1000)
    return `${(value / 1000).toFixed(1).replace(".0", "")}k learners`;
  return `${value} learners`;
};

const getInitials = (text = "") => {
  const words = text
    .replace(/[^\w\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "CL";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

const renderAccessBadge = (type = "OPEN") => {
  const normalized = (type || "OPEN").toUpperCase();

  if (normalized === "INVITE") {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/80 text-zinc-100 backdrop-blur-xs border border-white/10 shadow-xs">
        <Lock size={10} aria-hidden="true" />
        <span>Invite only</span>
      </span>
    );
  }

  if (normalized === "CODE") {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-amber-600/90 text-white backdrop-blur-xs shadow-xs">
        <KeyRound size={10} aria-hidden="true" />
        <span>Code</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-600/90 text-white backdrop-blur-xs shadow-xs">
      <Globe size={10} aria-hidden="true" />
      <span>Public</span>
    </span>
  );
};

export default function ExploreClassCard({
  classroom,
  className = "",
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classrooms = [] } = useDashboardData();

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const courseId =
    classroom?.courseId ??
    classroom?.id ??
    classroom?.classId ??
    classroom?._id ??
    "";

  const cardTitle = classroom?.title || "Class";
  const cardSubject = classroom?.subject || "";
  const cover = classroom?.coverUrl || classroom?.cover || null;
  const logo = classroom?.logoUrl || classroom?.logo || null;
  const accessType = (classroom?.accessType || "OPEN").toUpperCase();

  const isEnrolled = classrooms.some(
    (item) =>
      item.id === courseId ||
      item.courseId === courseId ||
      item.classId === courseId
  );

  const learners = formatLearners(
    classroom?.enrollmentCount ?? classroom?.memberCount ?? 0
  );

  const handleOpenClick = (e) => {
    if (e) e.preventDefault();
    if (!courseId) return;

    // 1. If enrolled or public open access, directly open class page
    if (isEnrolled || accessType === "OPEN") {
      navigate(`/dashboard/classes/${courseId}`);
      return;
    }

    // 2. If code required, prompt user to enter class code
    if (accessType === "CODE") {
      setJoinError("");
      setCode("");
      setIsCodeModalOpen(true);
      return;
    }

    // 3. If invite only, inform user
    if (accessType === "INVITE") {
      setIsInviteModalOpen(true);
      return;
    }

    navigate(`/dashboard/classes/${courseId}`);
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setJoinError("Please enter a class code.");
      return;
    }

    setIsJoining(true);
    setJoinError("");
    try {
      await joinClassroom(user?.id, courseId, cleanCode);
      setIsCodeModalOpen(false);
      navigate(`/dashboard/classes/${courseId}`);
    } catch (err) {
      const msg =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        "Invalid class code or failed to join class.";
      setJoinError(msg);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <>
      <article
        className={[
          "group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
          className,
        ].join(" ")}
      >
        {/* Cover Header & Floating/Overlay Logo */}
        <div className="relative h-14 w-full bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 dark:from-primary/30 dark:to-zinc-900">
          {cover && (
            <img
              src={cover}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

          {/* Access Type Badge */}
          <div className="absolute top-2 right-2 z-10">
            {renderAccessBadge(accessType)}
          </div>

          {/* Logo - always above on cover */}
          <div className="absolute bottom-2 left-2.5 z-10 flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center overflow-hidden rounded-md border border-white/70 dark:border-zinc-700 bg-surface shadow-xs">
            {logo ? (
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[11px] font-bold text-primary">
                {getInitials(cardTitle)}
              </span>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleOpenClick}
              className="block text-left w-full group-hover:text-primary transition-colors cursor-pointer"
            >
              <h3
                title={cardTitle}
                className="text-xs sm:text-sm font-bold leading-tight text-text-heading truncate"
              >
                {cardTitle}
              </h3>
            </button>
            {cardSubject && (
              <p className="mt-0.5 text-[11px] text-text-muted truncate">
                {cardSubject}
              </p>
            )}
          </div>

          {/* Bottom Row */}
          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border/40 pt-2 text-[11px] text-text-muted">
            <span className="truncate">{learners}</span>
            <button
              type="button"
              onClick={handleOpenClick}
              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
            >
              <span>Open</span>
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </article>

      {/* Code Prompt Modal for AccessType === CODE */}
      {isCodeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => !isJoining && setIsCodeModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <KeyRound size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-text-heading truncate">
                    Enter Class Code
                  </h3>
                  <p className="text-xs text-text-muted truncate">
                    Code required to join this class
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCodeModalOpen(false)}
                disabled={isJoining}
                className="rounded-lg p-1 text-text-muted hover:bg-canvas hover:text-text-heading cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-3 text-xs text-text-muted">
              Enter the code provided by your instructor to join{" "}
              <span className="font-semibold text-text-heading">{cardTitle}</span>.
            </p>

            <form onSubmit={handleJoinByCode} className="mt-4 space-y-3">
              <div>
                <input
                  type="text"
                  autoFocus
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setJoinError("");
                  }}
                  placeholder="e.g. ABCD1234"
                  maxLength={16}
                  className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-center font-mono text-base font-semibold tracking-wider text-text-heading uppercase outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {joinError && (
                  <p className="mt-1.5 text-xs text-destructive">{joinError}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  to={`/dashboard/class/join?courseId=${encodeURIComponent(courseId)}&accessType=code`}
                  onClick={() => setIsCodeModalOpen(false)}
                  className="text-[11px] text-text-muted hover:text-primary hover:underline"
                >
                  Dedicated join page
                </Link>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCodeModalOpen(false)}
                    disabled={isJoining}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:bg-canvas hover:text-text-heading cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!code.trim() || isJoining}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Joining…</span>
                      </>
                    ) : (
                      <>
                        <span>Join & Open</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Only Modal for AccessType === INVITE */}
      {isInviteModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
          onClick={() => setIsInviteModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 shrink-0">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-heading">
                    Invite Only Class
                  </h3>
                  <p className="text-xs text-text-muted">Private learning space</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-lg p-1 text-text-muted hover:bg-canvas hover:text-text-heading cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-3 text-xs text-text-muted leading-relaxed">
              <span className="font-semibold text-text-heading">{cardTitle}</span>{" "}
              is an invite-only class. Only invited members can access
              this course. Please request an invitation link or code from the
              instructor.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
