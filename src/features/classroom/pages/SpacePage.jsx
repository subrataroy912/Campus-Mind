import { useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
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
import { isTeacherRole, isUserEnrolled } from "../roles.js";
import { routes } from "@/routes/paths";
import {
  ClassHomeTab,
  ClassworkTab,
  GradesTab,
  MembersTab,
} from "../components/classPage/index.js";

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

  const rawAccessType = (
    classroom?.accessType ||
    (classroom?.visibility === "PUBLIC" ? "OPEN" : "CODE")
  ).toUpperCase();
  const isCodeProtected =
    rawAccessType === "CODE" && classroom?.visibility !== "PUBLIC";

  const handleJoin = async (overrideCode) => {
    if (!classId) return;

    // If this classroom requires a code and no code was provided yet, open the modal
    const effectiveCode =
      typeof overrideCode === "string"
        ? overrideCode.trim()
        : classCodeInput.trim();
    if (isCodeProtected && !effectiveCode) {
      setLocalJoinError("");
      setIsCodeModalOpen(true);
      return;
    }

    setLocalJoinError("");
    try {
      await joinClassroom({
        courseId: classId,
        code: effectiveCode || undefined,
      }).unwrap();
      setIsCodeModalOpen(false);
      setClassCodeInput("");
    } catch (err) {
      const message =
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        "Failed to join class. Please verify the code and try again.";
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

  // TODO:: Have to make a reusable component
  if (isNotFound) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas px-4 py-8">
        <div className="max-w-md rounded-2xl bg-surface p-6 shadow-xs ring-1 ring-border">
          <h2 className="text-lg font-semibold text-text-heading">
            Classroom Not Found
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            This classroom is unavailable or you are not enrolled as a member
            yet.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              to={`${routes.classes.join}?courseId=${encodeURIComponent(
                classId || ""
              )}`}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover shadow-xs"
            >
              Join this class
            </Link>
            <Link
              to={routes.classes.list}
              className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-main transition hover:bg-canvas"
            >
              Back to classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

        // TODO:: Have to make a reusable component
  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-text-muted text-sm">
        This class is unavailable at the moment.
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-text-muted text-sm">
        Class not found.
      </div>
    );
  }

  const teacher = isTeacherRole(classroom.role);

  const classroomWithNewCode =
    classroom.code || !location.state?.enrollmentCode
      ? classroom
      : { ...classroom, code: location.state.enrollmentCode };

  return (
    <div className="min-h-screen bg-canvas px-2.5 py-2.5 sm:px-4 sm:py-3.5 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-2.5 sm:space-y-3">
        {joinError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
            {joinError}
          </div>
        )}

        <ClassHeader
          classroom={classroomWithNewCode}
          isEnrolled={isEnrolled}
          onJoin={handleJoin}
          isJoining={isJoining}
          teacher={teacher}
        />

        <ClassTabs
          active={activeTab}
          spaceType={classroom?.spaceType}
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
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
            classroom={classroom}
            teacher={teacher}
          />
        )}

        {activeTab === "classwork" && (
          <ClassworkTab
            teacher={teacher}
            classId={classId}
            classroom={classroom}
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}

        {activeTab === "quick-links" && (
          <ClassQuickLinks classroom={classroom} teacher={teacher} />
        )}

        {activeTab === "members" && (
          <MembersTab
            classroom={classroom}
            teacher={teacher}
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}

        {activeTab === "grades" && (
          <GradesTab
            teacher={teacher}
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
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
