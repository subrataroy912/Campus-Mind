import { memo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDashboardData } from "@/features/dashboard/useDashboardData.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { joinClassroom } from "@/features/classroom/api/classroomService.js";
import { getClassTheme } from "@/features/classroom/utils/classTheme.js";
import { classroomApi } from "@/features/classroom/api/classroomApi.js";
import { store } from "@/app/store.js";
import { initials } from "@/utils/initials.js";
import {
  AccessBadge,
  ACCESS_TYPES,
} from "@/features/classroom/components/AccessBadge.jsx";
import { CodePromptModal } from "@/features/classroom/components/CodePromptModal.jsx";
import { InviteOnlyModal } from "@/features/classroom/components/InviteOnlyModal.jsx";
import { routes } from "@/routes/paths";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
function formatLearners(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value === 1) return "1";
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}k `;
  }
  return `${value}`;
}

function ExploreClassCard({ classroom, className = "", priority = false }) {
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
      navigate({
        pathname: routes.classes.detail(courseId),
      });
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

    navigate({
      pathname: routes.classes.detail(courseId),
    });
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
      navigate({
        pathname: routes.classes.detail(courseId),
      });
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
      <Link
        onClick={handleOpenClassAction}
        to={routes.classes.detail(courseId)}
        className="block group"
      >
        <article
          onMouseEnter={handlePrefetchClass}
          onFocus={handlePrefetchClass}
          className={cn(
            "flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs",
            "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40",
            className
          )}
        >
          <div
            className={cn(
              "relative h-14 w-full",
              coverUrl ? "bg-canvas" : classTheme.gradientClass
            )}
          >
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

            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/15 to-transparent" />

            {/* Access Type Badge */}
            <div className="absolute top-2 right-2 z-10">
              <AccessBadge accessType={accessType} />
            </div>

            {/* Logo */}
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
            <div className="w-full text-left transition-colors group-hover:text-primary">
              <h3
                title={cardTitle}
                className="truncate text-xs font-bold leading-tight text-text-heading sm:text-sm"
              >
                {cardTitle}
              </h3>
            </div>

            <div className="mt-1 flex items-center justify-between space-x-2">
              {cardSubject && (
                <p className="truncate text-[11px] text-text-muted">
                  {cardSubject}
                </p>
              )}
              <span className="flex items-center gap-1 truncate text-[11px] text-text-muted">
                <Users size={12} /> {learnersCount}
              </span>
            </div>
          </div>
        </article>
      </Link>

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
