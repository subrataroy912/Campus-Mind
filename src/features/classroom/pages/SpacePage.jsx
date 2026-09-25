import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { useDispatch } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import { useAuth } from "@/context/AuthContext.jsx";
import ClassHeader from "../components/ClassHeader.jsx";
import ClassTabs from "../components/ClassTabs.jsx";
import ClassQuickLinks from "../components/ClassQuickLinks.jsx";
import { ClassPageSkeleton } from "../components/ClassPageSkeleton.jsx";
import { CodePromptModal } from "../components/CodePromptModal.jsx";
import {
  classroomApi,
  useFindClassroomByIdQuery,
  useGetClassroomRosterQuery,
  useJoinClassroomMutation,
} from "../api/classroomApi.js";
import {
  courseworkApi,
  useGetCourseworkListQuery,
} from "../api/courseworkApi.js";
import { exploreApi } from "@/features/explore/api/exploreApi.js";
import { setCourseTypeFilter } from "../courseContextSlice.js";
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

function resolveActiveTabAndSubpath(pathname = "", classId = "", searchParams) {
  const prefix = `/spaces/${classId}`;
  const remainder = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length).replace(/^\/+|\/+$/g, "").toLowerCase()
    : "";

  if (remainder === "classwork" || remainder === "assignments" || remainder === "materials") {
    return { tab: "classwork", subSegment: remainder };
  }
  if (remainder === "resources" || remainder === "quick-links") {
    return { tab: "quick-links", subSegment: remainder };
  }
  if (remainder === "people" || remainder === "members") {
    return { tab: "members", subSegment: remainder };
  }
  if (remainder === "grades") {
    return { tab: "grades", subSegment: remainder };
  }
  if (remainder === "settings") {
    return { tab: "home", subSegment: "settings" };
  }
  if (remainder === "posts" || remainder === "announcements") {
    return { tab: "home", subSegment: remainder };
  }

  // Legacy ?tab= fallback
  const queryTab = (searchParams?.get("tab") || "").toLowerCase();
  if (queryTab === "classwork") return { tab: "classwork", subSegment: "classwork" };
  if (queryTab === "quick-links" || queryTab === "resources")
    return { tab: "quick-links", subSegment: "resources" };
  if (queryTab === "members" || queryTab === "people")
    return { tab: "members", subSegment: "people" };
  if (queryTab === "grades") return { tab: "grades", subSegment: "grades" };

  return { tab: "home", subSegment: "" };
}

export default function SpacePage() {
  const params = useParams();
  const classId = params.spaceId || params.classId;
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { tab: activeTab, subSegment } = useMemo(
    () => resolveActiveTabAndSubpath(location.pathname, classId, searchParams),
    [location.pathname, classId, searchParams],
  );

  const { user, authStatus } = useAuth();
  const isHydrating = authStatus === "hydrating";

  // Sync coursework type filter when visiting /assignments or /materials sub-routes
  useEffect(() => {
    if (subSegment === "assignments") {
      dispatch(setCourseTypeFilter("ASSIGNMENT"));
    } else if (subSegment === "materials") {
      dispatch(setCourseTypeFilter("MATERIAL"));
    } else if (subSegment === "classwork") {
      dispatch(setCourseTypeFilter("ALL"));
    }
  }, [dispatch, subSegment]);

  // Track visited tabs so switching back and forth between tabs is instant (0ms remount)
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([activeTab]));
  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  // Reset visited tabs when navigating to a different space
  useEffect(() => {
    setVisitedTabs(new Set([activeTab]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  // Instant fallback from the already-loaded enrolled courses list or public explore feed (if present)
  const { cachedListCourse } = classroomApi.endpoints.fetchClassrooms.useQueryState(
    undefined,
    {
      selectFromResult: ({ data }) => ({
        cachedListCourse: Array.isArray(data)
          ? data.find(
              (c) =>
                String(c?.id || c?.courseId || c?._id) === String(classId),
            )
          : undefined,
      }),
    },
  );

  const { cachedPublicCourse } = exploreApi.endpoints.getPublicCourse.useQueryState(
    classId,
    {
      selectFromResult: ({ data }) => ({
        cachedPublicCourse: data
          ? {
              ...data,
              id: data.id ?? data.courseId ?? classId,
              name: data.name ?? data.title ?? "Untitled class",
              title: data.title ?? data.name ?? "Untitled class",
              role: data.role ?? "VIEWER",
            }
          : undefined,
      }),
    },
  );

  const {
    data: fetchedClassroom,
    isLoading,
    error,
  } = useFindClassroomByIdQuery(classId, {
    skip: isHydrating || !classId,
  });

  const classroom = fetchedClassroom ?? cachedListCourse ?? cachedPublicCourse;

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

  // Fire coursework & roster queries in parallel once classroom access/enrollment is known
  const canPrefetchCoursework =
    !isHydrating &&
    Boolean(classId) &&
    Boolean(classroom) &&
    (isEnrolled || rawAccessType === "PUBLIC");

  const canPrefetchRoster =
    !isHydrating && Boolean(classId) && Boolean(classroom) && isEnrolled;

  useGetCourseworkListQuery(
    canPrefetchCoursework ? { courseId: classId, page: 0, size: 20 } : skipToken,
  );

  useGetClassroomRosterQuery(
    canPrefetchRoster ? classId : skipToken,
  );

  const handlePrefetchTab = useCallback(
    (tabId) => {
      if (isHydrating || !classId || !isEnrolled) return;
      if (tabId === "home" || tabId === "classwork") {
        dispatch(
          courseworkApi.util.prefetch(
            "getCourseworkList",
            { courseId: classId, page: 0, size: 20 },
            { ifOlderThan: 60 },
          ),
        );
      } else if (tabId === "members") {
        dispatch(
          classroomApi.util.prefetch("getClassroomRoster", classId, {
            ifOlderThan: 60,
          }),
        );
        if (isStaff) {
          dispatch(
            classroomApi.util.prefetch("getPendingJoinRequests", classId, {
              ifOlderThan: 60,
            }),
          );
        }
      } else if (tabId === "grades") {
        if (isStaff) {
          dispatch(
            courseworkApi.util.prefetch("getCourseGradebook", classId, {
              ifOlderThan: 60,
            }),
          );
          dispatch(
            courseworkApi.util.prefetch("getCourseAnalyticsSummary", classId, {
              ifOlderThan: 60,
            }),
          );
        } else if (user?.id) {
          dispatch(
            courseworkApi.util.prefetch(
              "getStudentGradebook",
              { courseId: classId, studentId: user.id },
              { ifOlderThan: 60 },
            ),
          );
        }
      }
    },
    [dispatch, isHydrating, classId, isEnrolled, isStaff, user?.id],
  );

  // Eagerly warm remaining secondary tab queries (gradebook / join requests) once classroom role is known
  useEffect(() => {
    if (isHydrating || !classId || !classroom || !isEnrolled) return;
    if (isStaff) {
      dispatch(
        classroomApi.util.prefetch("getPendingJoinRequests", classId, {
          ifOlderThan: 60,
        }),
      );
      dispatch(
        courseworkApi.util.prefetch("getCourseGradebook", classId, {
          ifOlderThan: 60,
        }),
      );
      dispatch(
        courseworkApi.util.prefetch("getCourseAnalyticsSummary", classId, {
          ifOlderThan: 60,
        }),
      );
    } else if (user?.id) {
      dispatch(
        courseworkApi.util.prefetch(
          "getStudentGradebook",
          { courseId: classId, studentId: user.id },
          { ifOlderThan: 60 },
        ),
      );
    }
  }, [dispatch, isHydrating, classId, classroom, isEnrolled, isStaff, user?.id]);

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

  if ((isLoading || isHydrating) && !classroom) {
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

  if (error && !classroom) {
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
    <div className="w-full bg-canvas px-2.5 pt-2.5 pb-12 sm:px-4 sm:pt-3.5 sm:pb-16 lg:px-6 lg:pb-20 min-w-0">
      <div className="mx-auto w-full max-w-7xl space-y-2.5 sm:space-y-3">
        {joinError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
            {joinError}
          </div>
        )}

        <ClassHeader
          classroom={classroomWithNewCode}
          isEnrolled={isEnrolled}
          isStaff={isStaff}
          onJoin={handleJoin}
          isJoining={isJoining}
          isSettingsRouteOpen={subSegment === "settings" && isStaff}
          onCloseSettingsRoute={() =>
            navigate(routes.spaces.detail(classId), { replace: true })
          }
        />

        <ClassTabs
          active={activeTab}
          isStaff={isStaff}
          onPrefetch={handlePrefetchTab}
          onChange={(nextTab) => {
            if (!classId) return;
            if (nextTab === "classwork") {
              navigate(routes.space.classwork(classId));
            } else if (nextTab === "quick-links") {
              navigate(routes.space.resources(classId));
            } else if (nextTab === "members") {
              navigate(routes.space.people(classId));
            } else if (nextTab === "grades") {
              navigate(routes.space.grades(classId));
            } else {
              navigate(routes.spaces.detail(classId));
            }
          }}
        />

        {(activeTab === "home" || visitedTabs.has("home")) && (
          <div className={activeTab === "home" ? "block" : "hidden"}>
            <ClassHomeTab
              classId={classId}
              classroom={classroom}
              isEnrolled={isEnrolled}
              isStaff={isStaff}
              onJoin={handleJoin}
              isJoining={isJoining}
            />
          </div>
        )}

        {(activeTab === "classwork" || visitedTabs.has("classwork")) && (
          <div className={activeTab === "classwork" ? "block" : "hidden"}>
            <ClassworkTab
              classId={classId}
              classroom={classroom}
              isEnrolled={isEnrolled}
              isStaff={isStaff}
              onJoin={handleJoin}
              isJoining={isJoining}
            />
          </div>
        )}

        {(activeTab === "quick-links" || visitedTabs.has("quick-links")) && (
          <div className={activeTab === "quick-links" ? "block" : "hidden"}>
            <ClassQuickLinks
              classroom={classroom}
              isStaff={isStaff}
              isEnrolled={isEnrolled}
            />
          </div>
        )}

        {(activeTab === "members" || visitedTabs.has("members")) && (
          <div className={activeTab === "members" ? "block" : "hidden"}>
            <MembersTab
              classroom={classroom}
              isEnrolled={isEnrolled}
              isStaff={isStaff}
              onJoin={handleJoin}
              isJoining={isJoining}
            />
          </div>
        )}

        {(activeTab === "grades" || visitedTabs.has("grades")) && (
          <div className={activeTab === "grades" ? "block" : "hidden"}>
            <GradesTab
              classId={classId}
              classroom={classroom}
              isEnrolled={isEnrolled}
              isStaff={isStaff}
              onJoin={handleJoin}
              isJoining={isJoining}
            />
          </div>
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
