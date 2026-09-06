import { useEffect, useState } from "react";
import { fetchTheme, updateTheme as saveTheme } from "../api/settingsService.js";

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
          setError(requestError);
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
      setError(requestError);
      throw requestError;
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
