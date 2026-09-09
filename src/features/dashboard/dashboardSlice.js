import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  communityFilter: "all",
  draft: "",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setCommunityFilter: (state, action) => {
      state.communityFilter = action.payload ?? "all";
    },
    setCommunityDraft: (state, action) => {
      state.draft = action.payload ?? "";
    },
    clearDashboardState: () => initialState,
  },
});

export const {
  setCommunityFilter,
  setCommunityDraft,
  clearDashboardState,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
