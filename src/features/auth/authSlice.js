import { createSlice } from "@reduxjs/toolkit";

const storedSession = (() => {
  try {
    return JSON.parse(window.localStorage.getItem("campus-mind.session") || "null");
  } catch {
    return null;
  }
})();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: storedSession?.accessToken ?? storedSession?.token ?? null,
    refreshToken: storedSession?.refreshToken ?? null,
    user: storedSession?.user ?? storedSession ?? null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken ?? state.refreshToken;
      state.user = user;
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