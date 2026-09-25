export const selectAuthState = (state) => state.auth;

export const selectCurrentUser = (state) => state.auth?.user ?? null;

export const selectCurrentUserId = (state) => state.auth?.user?.id ?? null;

export const selectAccessToken = (state) => state.auth?.accessToken ?? null;

export const selectIsAuthenticated = (state) =>
  Boolean(state.auth?.accessToken && state.auth?.user);

export const selectIsAdmin = (state) => Boolean(state.auth?.user?.isAdmin);

export const selectCanCreateCourses = (state) =>
  Boolean(state.auth?.user?.canCreateCourses || state.auth?.user?.isAdmin);
