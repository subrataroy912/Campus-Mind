import { useContext, useEffect, useMemo, useSyncExternalStore } from "react";
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
  selectCourseContext,
  selectActiveCourseId,
  selectActiveCourseworkId,
  selectCourseRole,
  selectIsStaff,
  selectIsEnrolled,
  selectCourseFilters,
  selectCourseSearchQuery,
  selectCourseTypeFilter,
  selectCourseStatusFilter,
  selectIsCourseSidebarOpen,
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
 * Hook for consuming an individual slice of course context with memoized selectors.
 * Only re-renders when the selected value actually changes reference.
 */
export function useCourseSelector(selector, fallback = null) {
  const reduxContext = useContext(ReactReduxContext);
  const store = reduxContext?.store;

  const subscribe = store?.subscribe ?? NOOP_SUBSCRIBE;
  const getSnapshot = store
    ? () => selector(store.getState())
    : () => fallback;

  return useSyncExternalStore(subscribe, getSnapshot, () => fallback);
}

/**
 * Granular hooks for components to subscribe ONLY to what they need.
 * Prevents unnecessary re-render cascades across tabs when filters change.
 */
export function useActiveCourseId() {
  return useCourseSelector(selectActiveCourseId, null);
}

export function useActiveCourseworkId() {
  return useCourseSelector(selectActiveCourseworkId, null);
}

export function useCourseRole() {
  return useCourseSelector(selectCourseRole, null);
}

export function useCourseIsStaff() {
  return useCourseSelector(selectIsStaff, false);
}

export function useCourseIsEnrolled() {
  return useCourseSelector(selectIsEnrolled, false);
}

export function useCourseFilters() {
  return useCourseSelector(selectCourseFilters, DEFAULT_STATE.filters);
}

export function useCourseSearchQuery() {
  return useCourseSelector(selectCourseSearchQuery, "");
}

export function useCourseTypeFilter() {
  return useCourseSelector(selectCourseTypeFilter, "ALL");
}

export function useCourseStatusFilter() {
  return useCourseSelector(selectCourseStatusFilter, "ALL");
}

export function useIsCourseSidebarOpen() {
  return useCourseSelector(selectIsCourseSidebarOpen, true);
}

/**
 * Memoized actions hook. Returns permanently stable action dispatchers.
 */
export function useCourseActions() {
  const reduxContext = useContext(ReactReduxContext);
  const dispatch = reduxContext?.store?.dispatch;

  return useMemo(
    () => ({
      setActiveCourseworkId: (id) => dispatch?.(setActiveCourseworkId(id)),
      setCourseSearchQuery: (query) => dispatch?.(setCourseSearchQuery(query)),
      setCourseTypeFilter: (type) => dispatch?.(setCourseTypeFilter(type)),
      setCourseStatusFilter: (status) =>
        dispatch?.(setCourseStatusFilter(status)),
      resetCourseFilters: () => dispatch?.(resetCourseFilters()),
      toggleCourseSidebar: () => dispatch?.(toggleCourseSidebar()),
      setCourseSidebarOpen: (isOpen) =>
        dispatch?.(setCourseSidebarOpen(isOpen)),
      resetCourseContext: () => dispatch?.(resetCourseContext()),
    }),
    [dispatch],
  );
}

/**
 * Combined course context hook with stable action dispatchers and memoized return value.
 * Preserves 100% backward compatibility with all legacy calls while preventing reference churn.
 */
export function useCourseContext() {
  const reduxContext = useContext(ReactReduxContext);
  const store = reduxContext?.store;

  const subscribe = store?.subscribe ?? NOOP_SUBSCRIBE;
  const getSnapshot = store
    ? () => selectCourseContext(store.getState()) ?? DEFAULT_STATE
    : DEFAULT_SNAPSHOT;

  const contextState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    DEFAULT_SNAPSHOT,
  );

  const actions = useCourseActions();

  return useMemo(
    () => ({
      ...contextState,
      ...actions,
    }),
    [contextState, actions],
  );
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
  }, [dispatch, classId, role, isStaff, isEnrolled]);

  useEffect(() => {
    return () => {
      dispatch?.(resetCourseContext());
    };
  }, [dispatch]);
}
