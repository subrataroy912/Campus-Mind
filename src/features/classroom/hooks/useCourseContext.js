import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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

/**
 * Granular hooks for components to subscribe ONLY to what they need.
 * Prevents unnecessary re-render cascades across tabs when filters change.
 */
export function useActiveCourseId() {
  return useSelector(selectActiveCourseId) ?? null;
}

export function useActiveCourseworkId() {
  return useSelector(selectActiveCourseworkId) ?? null;
}

export function useCourseRole() {
  return useSelector(selectCourseRole) ?? null;
}

export function useCourseIsStaff() {
  return useSelector(selectIsStaff) ?? false;
}

export function useCourseIsEnrolled() {
  return useSelector(selectIsEnrolled) ?? false;
}

export function useCourseFilters() {
  return useSelector(selectCourseFilters) ?? DEFAULT_STATE.filters;
}

export function useCourseSearchQuery() {
  return useSelector(selectCourseSearchQuery) ?? "";
}

export function useCourseTypeFilter() {
  return useSelector(selectCourseTypeFilter) ?? "ALL";
}

export function useCourseStatusFilter() {
  return useSelector(selectCourseStatusFilter) ?? "ALL";
}

export function useIsCourseSidebarOpen() {
  return useSelector(selectIsCourseSidebarOpen) ?? true;
}

/**
 * Memoized actions hook. Returns permanently stable action dispatchers.
 */
export function useCourseActions() {
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      setActiveCourseworkId: (id) => dispatch(setActiveCourseworkId(id)),
      setCourseSearchQuery: (query) => dispatch(setCourseSearchQuery(query)),
      setCourseTypeFilter: (type) => dispatch(setCourseTypeFilter(type)),
      setCourseStatusFilter: (status) =>
        dispatch(setCourseStatusFilter(status)),
      resetCourseFilters: () => dispatch(resetCourseFilters()),
      toggleCourseSidebar: () => dispatch(toggleCourseSidebar()),
      setCourseSidebarOpen: (isOpen) =>
        dispatch(setCourseSidebarOpen(isOpen)),
      resetCourseContext: () => dispatch(resetCourseContext()),
    }),
    [dispatch],
  );
}

/**
 * Combined course context hook with stable action dispatchers and memoized return value.
 * Preserves 100% backward compatibility with all legacy calls while preventing reference churn.
 */
export function useCourseContext() {
  const contextState = useSelector(selectCourseContext) ?? DEFAULT_STATE;
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
  const dispatch = useDispatch();
  const role = classroom?.role || null;

  useEffect(() => {
    if (!classId) return;

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
      dispatch(resetCourseContext());
    };
  }, [dispatch]);
}
