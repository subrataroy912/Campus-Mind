import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    // AuthProvider is the only place that reads persisted credentials. This
    // prevents requests made during application startup from racing hydration.
    accessToken: null,
    refreshToken: null,
    user: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload ?? {};
      state.accessToken = accessToken ?? state.accessToken ?? null;
      state.refreshToken = refreshToken ?? state.refreshToken ?? null;
      state.user = user ?? state.user ?? null;
    },
    // Replaces, rather than merges, credentials. Session transitions (startup,
    // refresh, and logout) must never retain a token from an earlier session.
    setSession: (state, action) => {
      const { accessToken = null, refreshToken = null, user = null } = action.payload ?? {};
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
    forcedSignOut: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setCredentials, setSession, clearCredentials, forcedSignOut } = authSlice.actions;
export default authSlice.reducer;
