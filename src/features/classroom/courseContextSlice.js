import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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

const courseContextSlice = createSlice({
  name: "courseContext",
  initialState,
  reducers: {
    setActiveCourse: (state, action) => {
      const { courseId, role, isStaff, isEnrolled } = action.payload ?? {};

      // Only reset ephemeral state if the course actually changed
      if (state.activeCourseId !== courseId) {
        state.activeCourseworkId = null;
        state.filters = initialState.filters;
      }

      state.activeCourseId = courseId;
      state.userRole = role || null;
      state.isStaff = Boolean(isStaff);
      state.isEnrolled = Boolean(isEnrolled);
    },
    setActiveCourseworkId: (state, action) => {
      state.activeCourseworkId = action.payload;
    },
    setCourseSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
    },
    setCourseTypeFilter: (state, action) => {
      state.filters.typeFilter = action.payload;
    },
    setCourseStatusFilter: (state, action) => {
      state.filters.statusFilter = action.payload;
    },
    resetCourseFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleCourseSidebar: (state) => {
      state.isCourseSidebarOpen = !state.isCourseSidebarOpen;
    },
    setCourseSidebarOpen: (state, action) => {
      state.isCourseSidebarOpen = Boolean(action.payload);
    },
    resetCourseContext: () => initialState,
  },
});

export const {
  setActiveCourse,
  setActiveCourseworkId,
  setCourseSearchQuery,
  setCourseTypeFilter,
  setCourseStatusFilter,
  resetCourseFilters,
  toggleCourseSidebar,
  setCourseSidebarOpen,
  resetCourseContext,
} = courseContextSlice.actions;

// --- Selectors ---
export const selectCourseContext = (state) => state.courseContext;
export const selectActiveCourseId = (state) =>
  state.courseContext.activeCourseId;
export const selectActiveCourseworkId = (state) =>
  state.courseContext.activeCourseworkId;
export const selectCourseRole = (state) => state.courseContext.userRole;
export const selectIsStaff = (state) => state.courseContext.isStaff;
export const selectIsEnrolled = (state) => state.courseContext.isEnrolled;
export const selectCourseFilters = (state) => state.courseContext.filters;
export const selectCourseSearchQuery = (state) =>
  state.courseContext.filters.searchQuery;
export const selectCourseTypeFilter = (state) =>
  state.courseContext.filters.typeFilter;
export const selectCourseStatusFilter = (state) =>
  state.courseContext.filters.statusFilter;
export const selectIsCourseSidebarOpen = (state) =>
  state.courseContext.isCourseSidebarOpen;

export default courseContextSlice.reducer;
