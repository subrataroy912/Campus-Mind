import { createSlice } from "@reduxjs/toolkit";
import { safeParseStorageJson } from "@/utils/storage.js";

const storedSession = safeParseStorageJson("campus-mind.session");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken:
      storedSession?.accessToken ??
      storedSession?.token ??
      safeParseStorageJson("accessToken") ??
      null,
    refreshToken:
      storedSession?.refreshToken ??
      safeParseStorageJson("refreshToken") ??
      null,
    user: storedSession?.user ?? storedSession ?? null,
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
