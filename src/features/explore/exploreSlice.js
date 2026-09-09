import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tab: "classes",
  searchQuery: "",
  classFilter: "all",
  personFilter: "all",
};

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.tab = action.payload ?? "classes";
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload ?? "";
    },
    setClassFilter: (state, action) => {
      state.classFilter = action.payload ?? "all";
    },
    setPersonFilter: (state, action) => {
      state.personFilter = action.payload ?? "all";
    },
    clearExploreState: () => initialState,
  },
});

export const {
  setTab,
  setSearchQuery,
  setClassFilter,
  setPersonFilter,
  clearExploreState,
} = exploreSlice.actions;

export default exploreSlice.reducer;
