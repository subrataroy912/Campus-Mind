import { useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { ReactReduxContext } from "react-redux";
import {
  setActiveCourse,
  setActiveCourseworkId,
  setCourseSearchQuery,
  setCourseTypeFilter,
  setCourseStatusFilter,
  resetCourseFilters,
  toggleCourseSidebar,
  setCourseSidebarOpen,
  resetCourseContext,
} from "../courseContextSlice.js";

const DEFAULT_STATE = Object.freeze({
  activeCourseId: null,
  activeCourseworkId: null,
  userRole: null,
  isStaff: false,
  isEnrolled: false,
  isCourseSidebarOpen: true,
  filters: Object.freeze({
    searchQuery: "",
    typeFilter: "ALL",
    statusFilter: "ALL",
  }),
});

const NOOP_SUBSCRIBE = () => () => {};
const DEFAULT_SNAPSHOT = () => DEFAULT_STATE;

/**
 * Hook for consuming course context state and exposing bound dispatchers.
 * Fully reactive with Redux via useSyncExternalStore when inside a Provider,
 * and seamlessly provides safe fallback defaults in isolated test environments.
 */
export function useCourseContext() {
  const reduxContext = useContext(ReactReduxContext);
  const store = reduxContext?.store;

  const subscribe = store?.subscribe ?? NOOP_SUBSCRIBE;
  const getSnapshot = store
    ? () => store.getState().courseContext ?? DEFAULT_STATE
    : DEFAULT_SNAPSHOT;

  const contextState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    DEFAULT_SNAPSHOT,
  );

  const dispatch = store?.dispatch;

  const actions = {
    setActiveCourseworkId: useCallback(
      (id) => dispatch?.(setActiveCourseworkId(id)),
      [dispatch],
    ),
    setCourseSearchQuery: useCallback(
      (query) => dispatch?.(setCourseSearchQuery(query)),
      [dispatch],
    ),
    setCourseTypeFilter: useCallback(
      (type) => dispatch?.(setCourseTypeFilter(type)),
      [dispatch],
    ),
    setCourseStatusFilter: useCallback(
      (status) => dispatch?.(setCourseStatusFilter(status)),
      [dispatch],
    ),
    resetCourseFilters: useCallback(
      () => dispatch?.(resetCourseFilters()),
      [dispatch],
    ),
    toggleCourseSidebar: useCallback(
      () => dispatch?.(toggleCourseSidebar()),
      [dispatch],
    ),
    setCourseSidebarOpen: useCallback(
      (isOpen) => dispatch?.(setCourseSidebarOpen(isOpen)),
      [dispatch],
    ),
    resetCourseContext: useCallback(
      () => dispatch?.(resetCourseContext()),
      [dispatch],
    ),
  };

  return {
    ...contextState,
    ...actions,
  };
}

/**
 * Hook for synchronizing route/page parameters with Redux state.
 * Should be called exactly once per space, ideally at the top level (SpacePage.jsx).
 */
export function useCourseContextSync(classId, classroom, isEnrolled, isStaff) {
  const reduxContext = useContext(ReactReduxContext);
  const dispatch = reduxContext?.store?.dispatch;
  const role = classroom?.role || null;

  useEffect(() => {
    if (!dispatch || !classId) return;

    dispatch(
      setActiveCourse({
        courseId: classId,
        role,
        isStaff,
        isEnrolled,
      }),
    );

    return () => {
      dispatch(resetCourseContext());
    };
  }, [dispatch, classId, role, isStaff, isEnrolled]);
}
