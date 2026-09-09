import { useCallback, useState } from "react";

function readStoredValue(key, initialValue) {
  if (typeof window === "undefined") {
    return initialValue;
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? initialValue : JSON.parse(stored);
  } catch {
    return initialValue;
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue));
  const updateValue = useCallback(
    (nextValue) => {
      setValue((current) => {
        const resolved =
          typeof nextValue === "function" ? nextValue(current) : nextValue;

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          } catch {
            // Keep the in-memory state usable when storage is unavailable.
          }
        }

        return resolved;
      });
    },
    [key],
  );
  return [value, updateValue];
}
