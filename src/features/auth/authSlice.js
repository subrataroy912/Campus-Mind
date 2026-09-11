import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
    user: null,
  },
  reducers: {
    setAccessToken: (state, action) => {
      const accessToken =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.accessToken ?? null;
      state.accessToken = accessToken;
    },
    setSession: (state, action) => {
      const { accessToken = null, user = null } = action.payload ?? {};
      state.accessToken = accessToken;
      state.user = user;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.user = null;
    },
    forcedSignOut: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

export const { setAccessToken, setSession, clearCredentials, forcedSignOut } =
  authSlice.actions;
export default authSlice.reducer;
