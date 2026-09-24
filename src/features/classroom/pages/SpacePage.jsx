import { useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import ClassHeader from "../components/ClassHeader.jsx";
import ClassTabs from "../components/ClassTabs.jsx";
import ClassQuickLinks from "../components/ClassQuickLinks.jsx";
import { ClassPageSkeleton } from "../components/ClassPageSkeleton.jsx";
import { CodePromptModal } from "../components/CodePromptModal.jsx";
import {
  useFindClassroomByIdQuery,
  useJoinClassroomMutation,
} from "../api/classroomApi.js";
import { isStaffRole, isUserEnrolled } from "../utils/roles.js";
import { routes } from "@/routes/paths";
import { parseApiError } from "@/lib/errorUtils.js";
import { toast } from "@/components/ui/toast.jsx";
import {
  ClassHomeTab,
  ClassworkTab,
  GradesTab,
  MembersTab,
} from "../components/classPage/index.js";
import { useCourseContextSync } from "../hooks/useCourseContext.js";
import EmptyState from "@/components/common/EmptyState.jsx";

export default function SpacePage() {
  const { classId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const activeTab = searchParams.get("tab") || "home";
  const { user, authStatus } = useAuth();
  const isHydrating = authStatus === "hydrating";

  const {
    data: classroom,
    isLoading,
    error,
  } = useFindClassroomByIdQuery(classId, {
    skip: isHydrating || !classId,
  });

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [localJoinError, setLocalJoinError] = useState("");

  const [joinClassroom, { isLoading: isJoining, error: joinErrorObj }] =
    useJoinClassroomMutation();

  const isEnrolled = isUserEnrolled(classroom, user?.id);
  const isStaff = isStaffRole(classroom?.role);

  useCourseContextSync(classId, classroom, isEnrolled, isStaff);

  const rawAccessType = (
    classroom?.accessType ||
    (classroom?.visibility === "PUBLIC" ? "PUBLIC" : "LINK_ONLY")
  ).toUpperCase();
  const isCodeProtected =
    (rawAccessType === "CODE" || rawAccessType === "LINK_ONLY") &&
    classroom?.visibility !== "PUBLIC";

  const handleJoin = async (overrideCode) => {
    if (!classId) return;

    const isStringCode = typeof overrideCode === "string";

    const effectiveCode = isStringCode
      ? overrideCode.trim()
      : (classCodeInput || "").trim();

    if (isCodeProtected && !effectiveCode) {
      setLocalJoinError("");
      setIsCodeModalOpen(true);
      return;
    }

    setLocalJoinError("");

    try {
      const result = await joinClassroom({
        courseId: classId,
        code: effectiveCode || undefined,
      }).unwrap();

      setIsCodeModalOpen(false);
      setClassCodeInput("");

      if (result?.membershipStatus === "PENDING") {
        toast.add({
          title: "Request submitted",
          description: "Your join request has been sent for admin review.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Joined space",
          description: "You are now a member of this space.",
          type: "success",
        });
      }
    } catch (err) {
      const message = parseApiError(
        err,
        "Failed to join space. Please try again.",
      ).message;
      setLocalJoinError(message);
    }
  };

  const handleCodeSubmit = (e) => {
    if (e) e.preventDefault();
    if (!classCodeInput.trim()) {
      setLocalJoinError("Please enter a class code.");
      return;
    }
    handleJoin(classCodeInput);
  };

  const joinError =
    localJoinError ||
    joinErrorObj?.data?.message ||
    joinErrorObj?.data?.error ||
    joinErrorObj?.message ||
    null;

  if (isLoading) {
    return <ClassPageSkeleton />;
  }

  const isNotFound =
    !classroom || error?.status === 404 || error?.data?.status === 404;

  if (isNotFound) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4 py-8">
        <div className="w-full max-w-md">
          <EmptyState
            title="Space Not Found"
            description="This space is unavailable or you are not enrolled as a member yet."
            action={{
              label: "Explore Spaces",
              to: routes.spaces.list,
            }}
          />
        </div>
      </div>
    );
  }

  if (error || !classroom) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4 py-8">
        <div className="w-full max-w-md">
          <EmptyState
            title="Space Unavailable"
            description={
              error
                ? parseApiError(error, "Unable to load space details.").message
                : "Space not found."
            }
            action={{
              label: "Back to Spaces",
              to: routes.spaces.list,
            }}
          />
        </div>
      </div>
    );
  }

  const classroomWithNewCode =
    classroom.code || !location.state?.enrollmentCode
      ? classroom
      : { ...classroom, code: location.state.enrollmentCode };

  return (
    <div className="min-h-screen bg-canvas px-2.5 pt-2.5 pb-12 sm:px-4 sm:pt-3.5 sm:pb-16 lg:px-6 lg:pb-20">
      <div className="w-full space-y-2.5 sm:space-y-3">
        {joinError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
            {joinError}
          </div>
        )}

        <ClassHeader
          classroom={classroomWithNewCode}
          onJoin={handleJoin}
          isJoining={isJoining}
        />

        <ClassTabs
          active={activeTab}
          onChange={(nextTab) => {
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              if (nextTab === "home") {
                next.delete("tab");
              } else {
                next.set("tab", nextTab);
              }
              return next;
            });
          }}
        />

        {activeTab === "home" && (
          <ClassHomeTab
            classroom={classroom}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}

        {activeTab === "classwork" && (
          <ClassworkTab
            classroom={classroom}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}

        {activeTab === "quick-links" && (
          <ClassQuickLinks classroom={classroom} />
        )}

        {activeTab === "members" && (
          <MembersTab
            classroom={classroom}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}

        {activeTab === "grades" && (
          <GradesTab onJoin={handleJoin} isJoining={isJoining} />
        )}

        <CodePromptModal
          isOpen={isCodeModalOpen}
          onClose={() => {
            setIsCodeModalOpen(false);
            setLocalJoinError("");
          }}
          onSubmit={handleCodeSubmit}
          cardTitle={classroom?.title || "Class"}
          courseId={classId}
          classCode={classCodeInput}
          onChangeCode={setClassCodeInput}
          joinError={localJoinError}
          isJoining={isJoining}
        />
      </div>
    </div>
  );
}
