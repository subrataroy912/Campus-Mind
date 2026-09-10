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
    clearCredentials: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
