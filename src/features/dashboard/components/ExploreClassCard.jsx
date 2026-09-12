import { memo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Globe, KeyRound, Lock, Loader2, X } from "lucide-react";
import { useDashboardData } from "@/features/dashboard/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { joinClassroom } from "@/features/classroom/api/classroomService.js";
import { getClassTheme } from "@/features/classroom/utils/classTheme.js";
import { classroomApi } from "@/features/classroom/api/classroomApi.js";
import { store } from "@/app/store.js";
import { initials } from "@/utils/initials.js";

const ACCESS_TYPES = Object.freeze({
  OPEN: "OPEN",
  CODE: "CODE",
  INVITE: "INVITE",
});

function formatLearners(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return "0 learners";
  if (value === 1) return "1 learner";
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}k learners`;
  }
  return `${value} learners`;
}

function AccessBadge({ accessType = ACCESS_TYPES.OPEN }) {
  const normalized = (accessType || ACCESS_TYPES.OPEN).toUpperCase();

  if (normalized === ACCESS_TYPES.INVITE) {
    return (
      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-900/80 text-zinc-100 backdrop-blur-xs border border-white/10 shadow-xs">
        <Lock size={10} aria-hidden="true" />
        <span>Invite only</span>
      </span>
    );
  }

  if (normalized === ACCESS_TYPES.CODE) {
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
}

function CodePromptDialog({
  isOpen,
  onClose,
  onSubmit,
  cardTitle,
  courseId,
  classCode,
  onChangeCode,
  joinError,
  isJoining,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-prompt-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={() => !isJoining && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <KeyRound size={18} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 id="code-prompt-dialog-title" className="text-base font-bold text-text-heading truncate">
                Enter Class Code
              </h3>
              <p className="text-xs text-text-muted truncate">
                Code required to join this class
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <input
              type="text"
              autoFocus
              value={classCode}
              onChange={(e) => onChangeCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABCD1234"
              maxLength={16}
              aria-label="Class Code"
              className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-center font-mono text-base font-semibold tracking-wider text-text-heading uppercase outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {joinError && (
              <p className="mt-1.5 text-xs text-destructive">{joinError}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to={`/dashboard/class/join?courseId=${encodeURIComponent(courseId)}&accessType=code`}
              onClick={onClose}
              className="text-[11px] text-text-muted hover:text-primary hover:underline"
            >
              Dedicated join page
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isJoining}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-muted hover:bg-canvas hover:text-text-heading cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!classCode.trim() || isJoining}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50 cursor-pointer"
              >
                {isJoining ? (
                  <>
                    <Loader2 size={13} className="animate-spin" aria-hidden="true" />
                    <span>Joining...</span>
                  </>
                ) : (
                  <>
                    <span>Join & Open</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function InviteOnlyDialog({ isOpen, onClose, cardTitle }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-only-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 shrink-0">
              <Lock size={18} aria-hidden="true" />
            </div>
            <div>
              <h3 id="invite-only-dialog-title" className="text-base font-bold text-text-heading">
                Invite Only Class
              </h3>
              <p className="text-xs text-text-muted">Private learning space</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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
            onClick={onClose}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

function ExploreClassCard({
  classroom,
  className = "",
  priority = false,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classrooms = [] } = useDashboardData();

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [joinErrorMessage, setJoinErrorMessage] = useState("");
  const [isJoinSubmitting, setIsJoinSubmitting] = useState(false);

  const courseId =
    classroom?.courseId ??
    classroom?.id ??
    classroom?.classId ??
    classroom?._id ??
    "";

  const cardTitle = classroom?.title || "Class";
  const cardSubject = classroom?.subject || "";
  const coverUrl = classroom?.coverUrl || classroom?.cover || null;
  const logoUrl = classroom?.logoUrl || classroom?.logo || null;
  const accessType = (classroom?.accessType || ACCESS_TYPES.OPEN).toUpperCase();
  const classTheme = getClassTheme(classroom);

  const isAlreadyEnrolled = classrooms.some(
    (item) =>
      item.id === courseId ||
      item.courseId === courseId ||
      item.classId === courseId
  );

  const learnersCount = formatLearners(
    classroom?.enrollmentCount ?? classroom?.memberCount ?? 0
  );

  const handleOpenClassAction = (e) => {
    if (e) e.preventDefault();
    if (!courseId) return;

    if (isAlreadyEnrolled || accessType === ACCESS_TYPES.OPEN) {
      navigate(`/dashboard/classes/${courseId}`);
      return;
    }

    if (accessType === ACCESS_TYPES.CODE) {
      setIsCodeModalOpen(true);
      return;
    }

    if (accessType === ACCESS_TYPES.INVITE) {
      setIsInviteModalOpen(true);
      return;
    }

    navigate(`/dashboard/classes/${courseId}`);
  };

  const handleJoinClassByCode = async (e) => {
    if (e) e.preventDefault();
    const cleanCode = classCodeInput.trim();
    if (!cleanCode) {
      setJoinErrorMessage("Please enter a class code.");
      return;
    }

    setIsJoinSubmitting(true);
    setJoinErrorMessage("");
    try {
      await joinClassroom(user?.id, courseId, cleanCode);
      setIsCodeModalOpen(false);
      navigate(`/dashboard/classes/${courseId}`);
    } catch (err) {
      const message =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        "Invalid class code or failed to join class.";
      setJoinErrorMessage(message);
    } finally {
      setIsJoinSubmitting(false);
    }
  };

  const handlePrefetchClass = () => {
    if (courseId) {
      store.dispatch(
        classroomApi.util.prefetch("findClassroomById", courseId, {
          force: false,
        })
      );
    }
  };

  return (
    <>
      <article
        onMouseEnter={handlePrefetchClass}
        onFocus={handlePrefetchClass}
        className={[
          "group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
          className,
        ].join(" ")}
      >
        {/* Cover Header & Floating/Overlay Logo */}
        <div className={`relative h-14 w-full ${coverUrl ? "bg-canvas" : classTheme.gradientClass}`}>
          {coverUrl && (
            <img
              src={coverUrl}
              alt=""
              aria-hidden="true"
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={priority ? "high" : "auto"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

          {/* Access Type Badge */}
          <div className="absolute top-2 right-2 z-10">
            <AccessBadge accessType={accessType} />
          </div>

          {/* Logo - always above on cover */}
          <div className="absolute bottom-2 left-2.5 z-10 flex h-7.5 w-7.5 sm:h-8 sm:w-8 items-center justify-center overflow-hidden rounded-md border border-white/70 dark:border-zinc-700 bg-surface shadow-xs">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-[11px] font-bold text-primary">
                {initials(cardTitle) || "CL"}
              </span>
            )}
          </div>
        </div>

        {/* Main Body */}
        <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleOpenClassAction}
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
            <span className="truncate">{learnersCount}</span>
            <button
              type="button"
              onClick={handleOpenClassAction}
              className="inline-flex shrink-0 items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-white shadow-2xs hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
            >
              <span>Open</span>
              <ArrowRight size={11} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>

      {/* Code Prompt Modal for AccessType === CODE */}
      <CodePromptDialog
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onSubmit={handleJoinClassByCode}
        cardTitle={cardTitle}
        courseId={courseId}
        classCode={classCodeInput}
        onChangeCode={(nextCode) => {
          setClassCodeInput(nextCode);
          setJoinErrorMessage("");
        }}
        joinError={joinErrorMessage}
        isJoining={isJoinSubmitting}
      />

      {/* Invite Only Modal for AccessType === INVITE */}
      <InviteOnlyDialog
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        cardTitle={cardTitle}
      />
    </>
  );
}

export default memo(ExploreClassCard);
