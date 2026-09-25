import { memo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Users } from "lucide-react";

import { useSelector } from "react-redux";
import { selectEnrolledCourseIds } from "@/features/spaces/classroomSelectors.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { joinClassroom } from "@/features/spaces/api/classroomService.js";
import { getClassTheme } from "@/features/spaces/utils/classTheme.js";
import { getSpaceId } from "@/features/spaces/utils/roles.js";
import { classroomApi } from "@/features/spaces/api/classroomApi.js";
import { courseworkApi } from "@/features/spaces/api/courseworkApi.js";
import { store } from "@/app/store.js";
import { initials } from "@/utils/initials.js";
import {
  AccessBadge,
  ACCESS_TYPES,
} from "@/features/spaces/components/AccessBadge.jsx";
import { CodePromptModal } from "@/features/spaces/components/CodePromptModal.jsx";
import { InviteOnlyModal } from "@/features/spaces/components/InviteOnlyModal.jsx";
import { routes } from "@/routes/paths";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { parseApiError } from "@/lib/errorUtils.js";

function formatLearners(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return "0 learners";
  if (value === 1) return "1 learner";
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}k learners`;
  }
  return `${value} learners`;
}

function ExploreSpaceCard({
  classroom,
  className = "",
  priority = false,
  isEnrolled,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [joinErrorMessage, setJoinErrorMessage] = useState("");
  const [isJoinSubmitting, setIsJoinSubmitting] = useState(false);

  const courseId = getSpaceId(classroom);

  const cardTitle = classroom?.title || "Class";
  const cardSubject = classroom?.subject || "";
  const coverUrl = classroom?.coverUrl || classroom?.cover || null;
  const logoUrl = classroom?.logoUrl || classroom?.logo || null;
  const accessType = (classroom?.accessType || ACCESS_TYPES.PUBLIC).toUpperCase();
  const classTheme = getClassTheme(classroom);

  const enrolledCourseIds = useSelector(selectEnrolledCourseIds);

  const isAlreadyEnrolled =
    typeof isEnrolled === "boolean"
      ? isEnrolled
      : Boolean(
          classroom?.isEnrolled ||
          classroom?.enrolled ||
          (courseId && enrolledCourseIds?.has(courseId)),
        );

  const learnersCount = formatLearners(
    classroom?.enrollmentCount ?? classroom?.memberCount ?? 0,
  );

  const handleOpenClassAction = (e) => {
    if (e) e.preventDefault();
    if (!courseId) return;

    if (
      isAlreadyEnrolled ||
      accessType === ACCESS_TYPES.PUBLIC ||
      accessType === ACCESS_TYPES.OPEN ||
      accessType === ACCESS_TYPES.PRIVATE
    ) {
      navigate({ pathname: routes.classes.detail(courseId) });
      return;
    }

    if (accessType === ACCESS_TYPES.CODE) {
      setIsCodeModalOpen(true);
      return;
    }

    if (
      accessType === ACCESS_TYPES.INVITE ||
      accessType === ACCESS_TYPES.LINK_ONLY
    ) {
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
        parseApiError(err, "Invalid class code or failed to join class.")
          .message,
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
      if (isAlreadyEnrolled || accessType === ACCESS_TYPES.PUBLIC) {
        store.dispatch(
          courseworkApi.util.prefetch(
            "getCourseworkList",
            { courseId, page: 0, size: 20 },
            { force: false },
          ),
        );
      }
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
            "flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card p-0 shadow-2xs transition-all duration-200 hover:border-border hover:shadow-xs",
            className,
          )}
        >
          {/* 70% Header Banner */}
          <div
            className={cn(
              "relative h-40 sm:h-44 w-full shrink-0 overflow-hidden",
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
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Top Bar inside Banner: Access Badge */}
            <div className="absolute right-2.5 top-2.5 z-10">
              <AccessBadge
                accessType={accessType}
                className="text-[10px] px-2 py-0.5 backdrop-blur-xs bg-black/40 border-white/20 text-white font-medium"
              />
            </div>

            {/* Bottom Accent Avatar */}
            <div className="absolute bottom-2.5 left-2.5 z-10">
              <Avatar className="h-9 w-9 rounded-xl border-2 border-background/90 bg-background shadow-xs">
                <AvatarImage src={logoUrl} className="object-cover" />
                <AvatarFallback className="rounded-lg text-[10px] font-bold text-primary">
                  {initials(cardTitle) || "CL"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* 30% Compact Body Content */}
          <CardContent className="flex flex-1 flex-col justify-between p-2.5 sm:p-3 min-w-0 bg-card">
            <div>
              {cardSubject && (
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary truncate">
                  {cardSubject}
                </div>
              )}
              <h3
                title={cardTitle}
                className="mt-0.5 truncate text-xs sm:text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary"
              >
                {cardTitle}
              </h3>
            </div>

            {/* Footer Metadata Row */}
            <div className="mt-2 flex items-center justify-between gap-1.5 border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
              <span className="truncate max-w-[130px] font-medium text-[11px]">
                {cardSubject || "General"}
              </span>

              <span className="inline-flex shrink-0 items-center gap-1 font-medium text-[11px]">
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

export default memo(ExploreSpaceCard);
