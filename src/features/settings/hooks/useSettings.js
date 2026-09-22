import { useEffect, useState } from "react";
import { fetchTheme, updateTheme as saveTheme } from "../api/settingsService.js";
import { parseApiError } from "@/lib/errorUtils.js";

export function useSettings() {
  const [theme, setTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    fetchTheme()
      .then((nextTheme) => {
        if (active) {
          setTheme(nextTheme);
          setIsLoading(false);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(parseApiError(requestError, "Unable to load theme preference.").message);
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const updateTheme = async (nextTheme) => {
    setIsSaving(true);
    setError(null);
    try {
      const savedTheme = await saveTheme(nextTheme);
      setTheme(savedTheme);
      return savedTheme;
    } catch (requestError) {
      const message = parseApiError(requestError, "Unable to save theme preference.").message;
      setError(message);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    theme: theme || "light",
    isLoading,
    isSaving,
    error,
    updateTheme,
  };
}
