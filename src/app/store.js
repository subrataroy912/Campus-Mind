import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi.js";
import authReducer from "@/features/auth/authSlice.js";
import classroomReducer from "@/features/classroom/classroomSlice.js";
import dashboardReducer from "@/features/dashboard/dashboardSlice.js";
import exploreReducer from "@/features/explore/exploreSlice.js";
import profileReducer from "@/features/profile/profileSlice.js";
import settingsReducer from "@/features/settings/settingsSlice.js";
import uiReducer from "@/features/ui/uiSlice.js";
import { forcedSignOut } from "@/features/auth/authSlice.js";
import { clearClassroomState } from "@/features/classroom/classroomSlice.js";
import { clearDashboardState } from "@/features/dashboard/dashboardSlice.js";
import { clearExploreState } from "@/features/explore/exploreSlice.js";
import { clearProfileState } from "@/features/profile/profileSlice.js";
import { clearSettingsState } from "@/features/settings/settingsSlice.js";
import { safeParseStorageJson } from "@/utils/storage.js";
import {
  persistApiState,
  readPersistedApiState,
} from "./apiCachePersistence.js";

const storedSession = safeParseStorageJson("campus-mind.session");

const preloadedApiState = readPersistedApiState({
  user: storedSession?.user ?? storedSession ?? null,
});

const appReducer = {
  auth: authReducer,
  classroom: classroomReducer,
  dashboard: dashboardReducer,
  explore: exploreReducer,
  profile: profileReducer,
  settings: settingsReducer,
  ui: uiReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
const combinedReducer = combineReducers(appReducer);

function rootReducer(state, action) {
  if (action.type !== forcedSignOut.type) {
    return combinedReducer(state, action);
  }

  // UI is intentionally retained because its preferences are device-scoped.
  // Every other listed slice is user-scoped and receives its own clear action.
  return [
    action,
    clearClassroomState(),
    clearDashboardState(),
    clearExploreState(),
    clearProfileState(),
    clearSettingsState(),
  ].reduce((nextState, resetAction) => combinedReducer(nextState, resetAction), state);
}

export const store = configureStore({
  preloadedState: preloadedApiState
    ? { [baseApi.reducerPath]: preloadedApiState }
    : undefined,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

setupListeners(store.dispatch);

let persistenceTimer;
store.subscribe(() => {
  clearTimeout(persistenceTimer);
  persistenceTimer = setTimeout(() => {
    persistApiState(
      store.getState()[baseApi.reducerPath],
      store.getState().auth,
    );
  }, 200);
});
