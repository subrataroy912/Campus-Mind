import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi.js";
import authReducer from "@/features/auth/authSlice.js";
import uiReducer from "@/features/ui/uiSlice.js";
import courseContextReducer from "@/features/classroom/courseContextSlice.js";
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
  courseContext: courseContextReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};
const combinedReducer = combineReducers(appReducer);

function rootReducer(state, action) {
  if (
    action.type === forcedSignOut.type ||
    action.type === clearCredentials.type
  ) {
    return combinedReducer({ ui: state?.ui }, action);
  }

  return combinedReducer(state, action);
}

const persistenceListener = createListenerMiddleware();
persistenceListener.startListening({
  predicate: () => true,
  effect: async (_action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(200);
    const state = listenerApi.getState();
    persistApiState(state[baseApi.reducerPath], state.auth);
  },
});

export const store = configureStore({
  preloadedState: preloadedApiState
    ? { [baseApi.reducerPath]: preloadedApiState }
    : undefined,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(persistenceListener.middleware),

  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers({ autoBatch: { type: "raf" } }),
});

setupListeners(store.dispatch);
