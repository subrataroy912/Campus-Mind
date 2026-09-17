import { useLocation, useParams, useSearchParams } from "react-router";
import SpaceHeader from "../components/SpaceHeader.jsx";
import SpaceTabs from "../components/SpaceTabs.jsx";
import ClassQuickLinks from "../components/ClassQuickLinks.jsx";
import { ClassPageSkeleton } from "../components/ClassPageSkeleton.jsx";
import { CodePromptModal } from "../components/CodePromptModal.jsx";
import { SpaceStateCard } from "../components/SpaceStateCard.jsx";
import { useSpace } from "../hooks/useSpace.js";
import { useSpaceJoin } from "../hooks/useSpaceJoin.js";
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

  const { space, isEnrolled, teacher, isLoading, isNotFound, error } =
    useSpace(classId);

  // Preserve new enrollment code from router navigation state if available
  const currentSpace =
    space?.code || !location.state?.enrollmentCode
      ? space
      : { ...space, code: location.state.enrollmentCode };

  const {
    isCodeModalOpen,
    setIsCodeModalOpen,
    classCodeInput,
    setClassCodeInput,
    joinError,
    isJoining,
    handleJoin,
    handleCodeSubmit,
  } = useSpaceJoin({ space: currentSpace, spaceId: classId });

  if (isLoading) {
    return <ClassPageSkeleton />;
  }

  if (isNotFound) {
    return (
      <SpaceStateCard
        type="not-found"
        title="Space Not Found"
        description="This space is unavailable or you are not enrolled as a member yet."
        spaceId={classId}
      />
    );
  }

  if (error || !currentSpace) {
    return (
      <SpaceStateCard
        type="error"
        title="Space Unavailable"
        description="This space is unavailable at the moment. Please check back later."
      />
    );
  }

  return (
    <div className="min-h-screen bg-canvas px-2.5 py-2.5 sm:px-4 sm:py-3.5 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-2.5 sm:space-y-3">
        {joinError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive font-medium">
            {joinError}
          </div>
        )}

        <SpaceHeader
          classroom={currentSpace}
          space={currentSpace}
          isEnrolled={isEnrolled}
          onJoin={handleJoin}
          isJoining={isJoining}
          teacher={teacher}
        />

        <SpaceTabs
          active={activeTab}
          spaceType={currentSpace?.spaceType}
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
            classroom={currentSpace}
            teacher={teacher}
          />
        )}

        {activeTab === "classwork" && (
          <ClassworkTab
            teacher={teacher}
            classId={classId}
            classroom={currentSpace}
            isEnrolled={isEnrolled}
            onJoin={handleJoin}
            isJoining={isJoining}
          />
        )}

        {activeTab === "quick-links" && (
          <ClassQuickLinks classroom={currentSpace} teacher={teacher} />
        )}

        {activeTab === "members" && (
          <MembersTab
            classroom={currentSpace}
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
          onClose={() => setIsCodeModalOpen(false)}
          onSubmit={handleCodeSubmit}
          cardTitle={currentSpace?.title || "Space"}
          courseId={classId}
          classCode={classCodeInput}
          onChangeCode={setClassCodeInput}
          joinError={joinError}
          isJoining={isJoining}
        />
      </div>
    </div>
  );
}
