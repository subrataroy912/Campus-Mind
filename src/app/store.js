import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./baseApi.js";
import authReducer from "@/features/auth/authSlice.js";
import uiReducer from "@/features/ui/uiSlice.js";
import courseContextReducer from "@/features/spaces/courseContextSlice.js";
import { clearCredentials, forcedSignOut } from "@/features/auth/authSlice.js";
import {
  persistApiState,
  readPersistedApiState,
} from "./apiCachePersistence.js";
import {
  getPersistedUserId,
  readPersistedAuthSession,
} from "@/utils/sessionStorage.js";

const preloadedAuthSession = readPersistedAuthSession();
const preloadedApiState = readPersistedApiState({
  user: { id: preloadedAuthSession?.user?.id ?? getPersistedUserId() },
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

const preloadedState = {
  ...(preloadedAuthSession ? { auth: preloadedAuthSession } : {}),
  ...(preloadedApiState ? { [baseApi.reducerPath]: preloadedApiState } : {}),
};

export const store = configureStore({
  preloadedState:
    Object.keys(preloadedState).length > 0 ? preloadedState : undefined,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(persistenceListener.middleware),

  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers({ autoBatch: { type: "raf" } }),
});

setupListeners(store.dispatch);
