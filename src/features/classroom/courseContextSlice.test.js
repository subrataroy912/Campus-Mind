import { describe, expect, it } from "vitest";
import courseContextReducer, {
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
} from "./courseContextSlice.js";
import { store } from "@/app/store.js";
import { clearCredentials, forcedSignOut } from "@/features/auth/authSlice.js";

describe("courseContextSlice", () => {
  const initialSliceState = {
    activeCourseId: null,
    activeCourseworkId: null,
    userRole: null,
    isStaff: false,
    isEnrolled: false,
    isCourseSidebarOpen: true,
    filters: {
      searchQuery: "",
      typeFilter: "ALL",
      statusFilter: "ALL",
    },
  };

  it("returns the initial state when initialized", () => {
    expect(courseContextReducer(undefined, { type: "UNKNOWN" })).toEqual(
      initialSliceState,
    );
  });

  describe("setActiveCourse", () => {
    it("sets course ID, role, and boolean permission flags", () => {
      const state = courseContextReducer(
        initialSliceState,
        setActiveCourse({
          courseId: "course-123",
          role: "TEACHER",
          isStaff: true,
          isEnrolled: true,
        }),
      );

      expect(state.activeCourseId).toBe("course-123");
      expect(state.userRole).toBe("TEACHER");
      expect(state.isStaff).toBe(true);
      expect(state.isEnrolled).toBe(true);
    });

    it("resets ephemeral coursework and filter state when switching to a different course", () => {
      const modifiedState = {
        ...initialSliceState,
        activeCourseId: "course-1",
        activeCourseworkId: "work-99",
        filters: {
          searchQuery: "exam",
          typeFilter: "ASSIGNMENT",
          statusFilter: "PUBLISHED",
        },
      };

      const nextState = courseContextReducer(
        modifiedState,
        setActiveCourse({
          courseId: "course-2",
          role: "STUDENT",
          isStaff: false,
          isEnrolled: true,
        }),
      );

      expect(nextState.activeCourseId).toBe("course-2");
      expect(nextState.activeCourseworkId).toBeNull();
      expect(nextState.filters).toEqual(initialSliceState.filters);
    });

    it("preserves ephemeral coursework and filter state when updating the same course", () => {
      const modifiedState = {
        ...initialSliceState,
        activeCourseId: "course-1",
        activeCourseworkId: "work-99",
        filters: {
          searchQuery: "exam",
          typeFilter: "ASSIGNMENT",
          statusFilter: "PUBLISHED",
        },
      };

      const nextState = courseContextReducer(
        modifiedState,
        setActiveCourse({
          courseId: "course-1",
          role: "TEACHER",
          isStaff: true,
          isEnrolled: true,
        }),
      );

      expect(nextState.activeCourseId).toBe("course-1");
      expect(nextState.activeCourseworkId).toBe("work-99");
      expect(nextState.filters.searchQuery).toBe("exam");
      expect(nextState.userRole).toBe("TEACHER");
      expect(nextState.isStaff).toBe(true);
    });
  });

  describe("coursework selection and filters", () => {
    it("handles setActiveCourseworkId", () => {
      const state = courseContextReducer(
        initialSliceState,
        setActiveCourseworkId("cw-42"),
      );
      expect(state.activeCourseworkId).toBe("cw-42");

      const cleared = courseContextReducer(
        state,
        setActiveCourseworkId(null),
      );
      expect(cleared.activeCourseworkId).toBeNull();
    });

    it("handles filter changes and resetting filters", () => {
      let state = courseContextReducer(
        initialSliceState,
        setCourseSearchQuery("homework"),
      );
      expect(state.filters.searchQuery).toBe("homework");

      state = courseContextReducer(
        state,
        setCourseTypeFilter("ASSIGNMENT"),
      );
      expect(state.filters.typeFilter).toBe("ASSIGNMENT");

      state = courseContextReducer(
        state,
        setCourseStatusFilter("DRAFT"),
      );
      expect(state.filters.statusFilter).toBe("DRAFT");

      const resetState = courseContextReducer(state, resetCourseFilters());
      expect(resetState.filters).toEqual(initialSliceState.filters);
    });
  });

  describe("sidebar toggles", () => {
    it("toggles and sets course sidebar state", () => {
      let state = courseContextReducer(initialSliceState, toggleCourseSidebar());
      expect(state.isCourseSidebarOpen).toBe(false);

      state = courseContextReducer(state, toggleCourseSidebar());
      expect(state.isCourseSidebarOpen).toBe(true);

      state = courseContextReducer(state, setCourseSidebarOpen(false));
      expect(state.isCourseSidebarOpen).toBe(false);

      state = courseContextReducer(state, setCourseSidebarOpen(true));
      expect(state.isCourseSidebarOpen).toBe(true);
    });
  });

  describe("resetCourseContext", () => {
    it("resets entire slice back to initial state", () => {
      const populatedState = {
        activeCourseId: "course-123",
        activeCourseworkId: "work-1",
        userRole: "ADMIN",
        isStaff: true,
        isEnrolled: true,
        isCourseSidebarOpen: false,
        filters: {
          searchQuery: "test",
          typeFilter: "MATERIAL",
          statusFilter: "PUBLISHED",
        },
      };

      const reset = courseContextReducer(populatedState, resetCourseContext());
      expect(reset).toEqual(initialSliceState);
    });
  });

  describe("selectors", () => {
    const mockRootState = {
      courseContext: {
        activeCourseId: "c-100",
        activeCourseworkId: "cw-200",
        userRole: "TEACHER",
        isStaff: true,
        isEnrolled: true,
        isCourseSidebarOpen: false,
        filters: {
          searchQuery: "midterm",
          typeFilter: "ASSIGNMENT",
          statusFilter: "PUBLISHED",
        },
      },
    };

    it("extracts all values correctly using selectors", () => {
      expect(selectCourseContext(mockRootState)).toEqual(
        mockRootState.courseContext,
      );
      expect(selectActiveCourseId(mockRootState)).toBe("c-100");
      expect(selectActiveCourseworkId(mockRootState)).toBe("cw-200");
      expect(selectCourseRole(mockRootState)).toBe("TEACHER");
      expect(selectIsStaff(mockRootState)).toBe(true);
      expect(selectIsEnrolled(mockRootState)).toBe(true);
      expect(selectCourseFilters(mockRootState)).toEqual(
        mockRootState.courseContext.filters,
      );
      expect(selectCourseSearchQuery(mockRootState)).toBe("midterm");
      expect(selectCourseTypeFilter(mockRootState)).toBe("ASSIGNMENT");
      expect(selectCourseStatusFilter(mockRootState)).toBe("PUBLISHED");
      expect(selectIsCourseSidebarOpen(mockRootState)).toBe(false);
    });
  });

  describe("root store integration", () => {
    it("clears courseContext when forcedSignOut or clearCredentials occurs", () => {
      store.dispatch(
        setActiveCourse({
          courseId: "course-session",
          role: "TEACHER",
          isStaff: true,
          isEnrolled: true,
        }),
      );
      expect(store.getState().courseContext.activeCourseId).toBe("course-session");

      store.dispatch(forcedSignOut());
      expect(store.getState().courseContext).toEqual(initialSliceState);

      store.dispatch(
        setActiveCourse({
          courseId: "course-session-2",
          role: "STUDENT",
          isStaff: false,
          isEnrolled: true,
        }),
      );
      expect(store.getState().courseContext.activeCourseId).toBe("course-session-2");

      store.dispatch(clearCredentials());
      expect(store.getState().courseContext).toEqual(initialSliceState);
    });
  });
});
