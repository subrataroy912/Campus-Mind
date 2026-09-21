import { memo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Users } from "lucide-react";

import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData.js";
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
      item.classId === courseId,
  );

  const learnersCount = formatLearners(
    classroom?.enrollmentCount ?? classroom?.memberCount ?? 0,
  );

  const handleOpenClassAction = (e) => {
    if (e) e.preventDefault();
    if (!courseId) return;

    if (isAlreadyEnrolled || accessType === ACCESS_TYPES.OPEN) {
      navigate({ pathname: routes.classes.detail(courseId) });
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

    navigate({ pathname: routes.classes.detail(courseId) });
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
      navigate({ pathname: routes.classes.detail(courseId) });
    } catch (err) {
      setJoinErrorMessage(
        err?.data?.error ||
          err?.data?.message ||
          err?.message ||
          "Invalid class code or failed to join class.",
      );
    } finally {
      setIsJoinSubmitting(false);
    }
  };

  const handlePrefetchClass = () => {
    if (courseId) {
      store.dispatch(
        classroomApi.util.prefetch("findClassroomById", courseId, {
          force: false,
        }),
      );
    }
  };

  return (
    <>
      <Link
        onClick={handleOpenClassAction}
        to={routes.classes.detail(courseId)}
        aria-label={`Open ${cardTitle}`}
        className="group block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
      >
        <Card
          onMouseEnter={handlePrefetchClass}
          onFocus={handlePrefetchClass}
          className={cn(
            "flex h-full flex-col overflow-hidden rounded-lg border border-border/70 bg-card p-0 shadow-none transition-all duration-150 hover:border-foreground/20 hover:shadow-xs",
            className,
          )}
        >
          {/* Header Banner */}
          <div
            className={cn(
              "relative h-16 sm:h-18 w-full overflow-hidden",
              coverUrl ? "bg-muted" : classTheme.gradientClass,
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
                className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* Top Bar inside Banner: Access Badge */}
            <div className="absolute right-2 top-2 z-10">
              <AccessBadge
                accessType={accessType}
                className="text-[10px] px-1.5 py-0.5"
              />
            </div>

            {/* Bottom Accent Avatar */}
            <div className="absolute bottom-1.5 left-2 z-10">
              <Avatar className="h-6 w-6 rounded border border-background/90 bg-background shadow-xs">
                <AvatarImage src={logoUrl} className="object-cover" />
                <AvatarFallback className="rounded text-[9px] font-semibold text-primary">
                  {initials(cardTitle) || "CL"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Compact Body Content */}
          <CardContent className="flex flex-1 flex-col justify-between gap-2 p-2.5">
            <div>
              <h3
                title={cardTitle}
                className="truncate text-xs font-semibold leading-tight text-foreground transition-colors group-hover:text-primary"
              >
                {cardTitle}
              </h3>
            </div>

            {/* Footer Metadata Row */}
            <div className="flex items-center justify-between gap-1.5 border-t border-border/40 pt-1.5 text-[10px] text-muted-foreground">
              <span className="truncate max-w-[110px] font-medium">
                {cardSubject || "General"}
              </span>

              <span className="inline-flex shrink-0 items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{learnersCount}</span>
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
