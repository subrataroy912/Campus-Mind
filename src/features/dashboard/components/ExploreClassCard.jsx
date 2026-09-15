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
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function formatLearners(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return "0 learners";
  if (value === 1) return "1 learner";
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}k learners`;
  }
  return `${value} learners`;
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
        aria-label={`Open ${cardTitle}`}
        className="group block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card
          onMouseEnter={handlePrefetchClass}
          onFocus={handlePrefetchClass}
          className={cn(
            "flex h-full flex-col overflow-hidden rounded-xl border-0 p-0 shadow-xs transition-all duration-200",
            "group-hover:-translate-y-0.5 group-hover:shadow-md",
            className
          )}
        >
          {/* Cover Header */}
          <div
            className={cn(
              "relative w-full",
              "h-20 sm:h-24",
              coverUrl ? "bg-muted" : classTheme.gradientClass
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
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/15 to-transparent" />

            {/* Access Type Badge */}
            <div className="absolute right-2 top-2 z-10">
              <AccessBadge accessType={accessType} />
            </div>

            <Avatar className="absolute bottom-2 left-2.5 z-10 h-7.5 w-7.5 sm:h-10 sm:w-10 rounded-md border border-white/70 shadow-xs dark:border-zinc-700 bg-background">
              <AvatarImage src={logoUrl} className="object-cover" />
              <AvatarFallback className="rounded-md text-[11px] font-bold text-primary">
                {initials(cardTitle) || "CL"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Main Body via Shadcn CardContent */}
          <CardContent className="flex flex-1 flex-col justify-between p-2.5 sm:p-3">
            <div className="w-full text-left transition-colors group-hover:text-primary">
              <h3
                title={cardTitle}
                className="truncate text-xs font-bold leading-tight text-foreground sm:text-sm"
              >
                {cardTitle}
              </h3>
            </div>

            <div className="mt-1 flex items-center justify-between space-x-2">
              {cardSubject && (
                <p className="truncate text-[11px] text-muted-foreground">
                  {cardSubject}
                </p>
              )}
              <span className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                <Users size={12} /> {learnersCount}
              </span>
            </div>
          </CardContent>
        </Card>
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

      <InviteOnlyModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        cardTitle={cardTitle}
      />
    </>
  );
}

export default memo(ExploreClassCard);
