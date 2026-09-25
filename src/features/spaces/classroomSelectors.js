import { createSelector } from "@reduxjs/toolkit";
import { classroomApi } from "./api/classroomApi.js";
import { isSpaceOwner } from "./utils/roles.js";

const EMPTY_ARRAY = Object.freeze([]);
const EMPTY_SET = Object.freeze(new Set());

/**
 * RTK Query generated memoized selector for the fetchClassrooms endpoint query result.
 */
export const selectClassroomsQueryResult =
  classroomApi.endpoints.fetchClassrooms.select(undefined);

/**
 * Returns the un-nested array of classrooms from the store cache.
 */
export const selectClassroomsData = createSelector(
  [selectClassroomsQueryResult],
  (result) => (Array.isArray(result?.data) ? result.data : EMPTY_ARRAY)
);

/**
 * Memoized Set of all enrolled space / course IDs for O(1) membership lookups.
 */
export const selectEnrolledCourseIds = createSelector(
  [selectClassroomsData],
  (classrooms) => {
    if (!classrooms || classrooms.length === 0) return EMPTY_SET;
    const ids = new Set();
    for (const c of classrooms) {
      if (c?.id) ids.add(c.id);
      if (c?.courseId) ids.add(c.courseId);
      if (c?.classId) ids.add(c.classId);
      if (c?._id) ids.add(c._id);
    }
    return ids;
  }
);

/**
 * Memoized selector for spaces created by the user.
 */
export const selectCreatedSpaces = createSelector(
  [selectClassroomsData, (_state, userId) => userId],
  (classrooms, userId) => {
    if (!classrooms || classrooms.length === 0) return EMPTY_ARRAY;
    return classrooms.filter((c) => isSpaceOwner(c, userId));
  }
);

/**
 * Memoized selector for spaces joined by the user.
 */
export const selectJoinedSpaces = createSelector(
  [selectClassroomsData, (_state, userId) => userId],
  (classrooms, userId) => {
    if (!classrooms || classrooms.length === 0) return EMPTY_ARRAY;
    return classrooms.filter((c) => !isSpaceOwner(c, userId));
  }
);

