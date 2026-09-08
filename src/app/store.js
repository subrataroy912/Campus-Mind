import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi.js";
import authReducer from "@/features/auth/authSlice.js";
import { persistApiState, readPersistedApiState } from "./apiCachePersistence.js";

const storedSession = (() => {
  try {
    return JSON.parse(window.localStorage.getItem("campus-mind.session") || "null");
  } catch {
    return null;
  }
})();

const preloadedApiState = readPersistedApiState({
  user: storedSession?.user ?? storedSession ?? null,
});

export const store = configureStore({
  preloadedState: preloadedApiState
    ? { [baseApi.reducerPath]: preloadedApiState }
    : undefined,
  reducer: {
    auth: authReducer,
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
    persistApiState(store.getState()[baseApi.reducerPath], store.getState().auth);
  }, 200);
});
