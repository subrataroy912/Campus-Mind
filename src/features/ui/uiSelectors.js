import { createSelector } from "@reduxjs/toolkit";

export const selectUiState = (state) => state.ui;

export const selectIsSidebarOpen = createSelector(
  [selectUiState],
  (ui) => Boolean(ui?.isSidebarOpen)
);

export const selectIsMobileMenuOpen = createSelector(
  [selectUiState],
  (ui) => Boolean(ui?.isMobileMenuOpen)
);
