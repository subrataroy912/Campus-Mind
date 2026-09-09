import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_NOTIFICATIONS = {
  classAnnouncements: true,
  directMessages: true,
  assignmentReminders: true,
  weeklyDigest: false,
};

const DEFAULT_PRIVACY = {
  discoverable: true,
  showOnlineStatus: true,
};

const initialState = {
  notifications: DEFAULT_NOTIFICATIONS,
  privacy: DEFAULT_PRIVACY,
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
    togglePrivacy: (state, action) => {
      const key = action.payload;
      if (key in state.privacy) {
        state.privacy[key] = !state.privacy[key];
      }
    },
    setNotifications: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    setPrivacy: (state, action) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    clearSettingsState: () => initialState,
  },
});

export const {
  toggleNotification,
  togglePrivacy,
  setNotifications,
  setPrivacy,
  clearSettingsState,
} = settingsSlice.actions;

export default settingsSlice.reducer;
