import { createSelector } from "@reduxjs/toolkit";

export const selectAuthState = (state) => state.auth;

export const selectCurrentUser = createSelector(
  [selectAuthState],
  (auth) => auth?.user ?? null
);

export const selectCurrentUserId = createSelector(
  [selectCurrentUser],
  (user) => user?.id ?? null
);

export const selectAccessToken = createSelector(
  [selectAuthState],
  (auth) => auth?.accessToken ?? null
);

export const selectIsAuthenticated = createSelector(
  [selectAccessToken, selectCurrentUser],
  (token, user) => Boolean(token && user)
);

export const selectIsAdmin = createSelector(
  [selectCurrentUser],
  (user) => Boolean(user?.isAdmin)
);

export const selectCanCreateCourses = createSelector(
  [selectCurrentUser],
  (user) => Boolean(user?.canCreateCourses)
);
