import { useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import ClassHeader from "../components/ClassHeader.jsx";
import ClassTabs from "../components/ClassTabs.jsx";
import ClassQuickLinks from "../components/ClassQuickLinks.jsx";
import ClassPageSkeleton from "../components/ClassPageSkeleton.jsx";
import { useClassroom } from "../hooks/useClassroom.js";
import { joinClassroom } from "../api/classroomService.js";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";
import { isTeacherRole } from "../roles.js";
import {
  ClassHomeTab,
  ClassworkTab,
  GradesTab,
  MembersTab,
} from "../components/classPage/index.js";

export default function ClassPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "home";
  const { classId } = useParams();
  const location = useLocation();
  const { user } = useAuth();

  const { classroom, error, notFound, isEnrolled, isLoading } =
    useClassroom(classId);

  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const handleJoin = async () => {
    if (!classId || isJoining) return;
    setIsJoining(true);
    setJoinError("");
    try {
      await joinClassroom(user?.id, { courseId: classId });
      triggerLifecycleRefresh("course:joined", { courseId: classId });
    } catch (err) {
      const status = err?.status ?? err?.originalStatus;
      if (
        status === 409 ||
        err?.data?.error?.toLowerCase()?.includes("already")
      ) {
        triggerLifecycleRefresh("course:joined", { courseId: classId });
        return;
      }
      setJoinError(
        err?.data?.error ||
          err?.message ||
          "Failed to join class. Please try again."
      );
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading && !classroom) {
    return <ClassPageSkeleton />;
  }

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-4 text-center">
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
              to={`/dashboard/class/join?courseId=${encodeURIComponent(
                classId || ""
              )}`}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover shadow-xs"
            >
              Join this class
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-text-main transition hover:bg-canvas"
            >
              Back to classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        {joinError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
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

        {activeTab === "quick-links" && <ClassQuickLinks teacher={teacher} />}

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
      </div>
    </div>
  );
}
