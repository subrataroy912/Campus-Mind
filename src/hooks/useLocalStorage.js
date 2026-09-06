import { useCallback, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const updateValue = useCallback(
    (nextValue) => {
      setValue((current) => {
        const resolved =
          typeof nextValue === "function" ? nextValue(current) : nextValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Keep the in-memory state usable when storage is unavailable.
        }
        return resolved;
      });
    },
    [key],
  );
  return [value, updateValue];
}
