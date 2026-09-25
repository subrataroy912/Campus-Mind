export const selectUiState = (state) => state.ui;

export const selectIsSidebarOpen = (state) => Boolean(state.ui?.isSidebarOpen);

export const selectIsMobileMenuOpen = (state) =>
  Boolean(state.ui?.isMobileMenuOpen);
