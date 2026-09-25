import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  user: null,
};

const resetAuthState = () => initialState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken =
        typeof action.payload === "string"
          ? action.payload
          : action.payload?.accessToken ?? null;
    },
    setSession: (state, action) => {
      const { accessToken = null, user = null } = action.payload ?? {};
      state.accessToken = accessToken;
      state.user = user;
    },
    clearCredentials: resetAuthState,
    forcedSignOut: resetAuthState,
  },
});

export const { setAccessToken, setSession, clearCredentials, forcedSignOut } =
  authSlice.actions;
export default authSlice.reducer;
