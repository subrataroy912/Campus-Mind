const invalidators = new WeakMap();

export function registerRefreshInvalidator(dispatch, invalidate) {
  if (typeof dispatch === "function" && typeof invalidate === "function") {
    invalidators.set(dispatch, invalidate);
  }
}

export function invalidateRefreshForDispatch(dispatch) {
  invalidators.get(dispatch)?.();
}
