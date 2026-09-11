import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi.js";
import authReducer from "@/features/auth/authSlice.js";
import uiReducer from "@/features/ui/uiSlice.js";
import { clearCredentials, forcedSignOut } from "@/features/auth/authSlice.js";
import {
  persistApiState,
  readPersistedApiState,
} from "./apiCachePersistence.js";
import { getPersistedUserId } from "@/utils/sessionStorage.js";

const preloadedApiState = readPersistedApiState({
  user: { id: getPersistedUserId() },
});

const appReducer = {
  auth: authReducer,
  ui: uiReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
const combinedReducer = combineReducers(appReducer);

function rootReducer(state, action) {
  if (
    action.type !== forcedSignOut.type &&
    action.type !== clearCredentials.type
  ) {
    return combinedReducer(state, action);
  }

  // UI is intentionally retained because its preferences are device-scoped.
  return combinedReducer(state, action);
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
      store.getState().auth
    );
  }, 200);
});
