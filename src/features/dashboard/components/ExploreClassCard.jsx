import { memo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import { useDashboardData } from "@/features/dashboard/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { joinClassroom } from "@/features/classroom/api/classroomService.js";
import { getClassTheme } from "@/features/classroom/utils/classTheme.js";
import { classroomApi } from "@/features/classroom/api/classroomApi.js";
import { store } from "@/app/store.js";
import { initials } from "@/utils/initials.js";
import { AccessBadge, ACCESS_TYPES } from "@/features/classroom/components/AccessBadge.jsx";
import { CodePromptModal } from "@/features/classroom/components/CodePromptModal.jsx";
import { InviteOnlyModal } from "@/features/classroom/components/InviteOnlyModal.jsx";

function formatLearners(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return "0 learners";
  if (value === 1) return "1 learner";
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}k learners`;
  }
  return `${value} learners`;
}

function ExploreClassCard({
  classroom,
  className = "",
  priority = false,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { classrooms = [] } = useDashboardData({ includeExplore: false });

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
      <CodePromptModal
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
      <InviteOnlyModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        cardTitle={cardTitle}
      />
    </>
  );
}

export default memo(ExploreClassCard);
