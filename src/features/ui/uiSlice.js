import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: true,
  isMobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = Boolean(action.payload);
    },
    setMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = Boolean(action.payload);
    },
    clearUIState: () => initialState,
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setMobileMenuOpen,
  clearUIState,
} = uiSlice.actions;

export default uiSlice.reducer;
