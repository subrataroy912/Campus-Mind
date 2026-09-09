import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi.js";
import authReducer from "@/features/auth/authSlice.js";
import classroomReducer from "@/features/classroom/classroomSlice.js";
import dashboardReducer from "@/features/dashboard/dashboardSlice.js";
import exploreReducer from "@/features/explore/exploreSlice.js";
import profileReducer from "@/features/profile/profileSlice.js";
import settingsReducer from "@/features/settings/settingsSlice.js";
import uiReducer from "@/features/ui/uiSlice.js";
import { safeParseStorageJson } from "@/utils/storage.js";
import {
  persistApiState,
  readPersistedApiState,
} from "./apiCachePersistence.js";

const storedSession = safeParseStorageJson("campus-mind.session");

const preloadedApiState = readPersistedApiState({
  user: storedSession?.user ?? storedSession ?? null,
});

export const store = configureStore({
  preloadedState: preloadedApiState
    ? { [baseApi.reducerPath]: preloadedApiState }
    : undefined,
  reducer: {
    auth: authReducer,
    classroom: classroomReducer,
    dashboard: dashboardReducer,
    explore: exploreReducer,
    profile: profileReducer,
    settings: settingsReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
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
