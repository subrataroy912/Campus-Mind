import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeTab: "classes",
  isEditing: false,
  isSaving: false,
  preview: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileTab: (state, action) => {
      state.activeTab = action.payload ?? "classes";
    },
    setProfileEditing: (state, action) => {
      state.isEditing = Boolean(action.payload);
    },
    setProfileSaving: (state, action) => {
      state.isSaving = Boolean(action.payload);
    },
    setProfilePreview: (state, action) => {
      state.preview = Boolean(action.payload);
    },
    clearProfileState: () => initialState,
  },
});

export const {
  setProfileTab,
  setProfileEditing,
  setProfileSaving,
  setProfilePreview,
  clearProfileState,
} = profileSlice.actions;

export default profileSlice.reducer;
