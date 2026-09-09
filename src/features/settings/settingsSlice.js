import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_NOTIFICATIONS = {
  emailEnabled: true,
  pushEnabled: true,
  inAppEnabled: true,
};

const initialState = {
  notifications: DEFAULT_NOTIFICATIONS,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleNotification: (state, action) => {
      const key = action.payload;
      if (key in state.notifications) {
        state.notifications[key] = !state.notifications[key];
      }
    },
    setNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    clearSettingsState: () => initialState,
  },
});

export const { toggleNotification, setNotifications, clearSettingsState } =
  settingsSlice.actions;

export default settingsSlice.reducer;
