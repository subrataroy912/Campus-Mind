// Dispatch is the stable identity shared by a store's API calls and teardown.
const invalidators = new WeakMap();

export function registerRefreshInvalidator(dispatch, invalidate) {
  if (typeof dispatch === "function" && typeof invalidate === "function") {
    invalidators.set(dispatch, invalidate);
  }
}

export function invalidateRefreshForDispatch(dispatch) {
  invalidators.get(dispatch)?.();
}
