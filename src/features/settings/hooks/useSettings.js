import { useEffect, useState } from "react";
import { fetchTheme, updateTheme as saveTheme } from "../api/settingsService.js";
import { parseApiError } from "@/lib/errorUtils.js";
import { useTheme, THEMES } from "@/context/ThemeContext.jsx";

export function useSettings() {
  let themeContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    themeContext = useTheme();
  } catch {
    // Fallback when rendered outside ThemeProvider
  }

  const [localTheme, setLocalTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(!themeContext);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (themeContext) return;
    let active = true;

    fetchTheme()
      .then((nextTheme) => {
        if (active) {
          setLocalTheme(nextTheme);
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
  }, [themeContext]);

  const updateTheme = async (nextTheme) => {
    setIsSaving(true);
    setError(null);
    try {
      if (themeContext) {
        themeContext.setTheme(nextTheme);
      }
      const savedTheme = await saveTheme(nextTheme);
      setLocalTheme(savedTheme);
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
    theme: themeContext ? themeContext.theme : (localTheme || THEMES.SYSTEM),
    resolvedTheme: themeContext ? themeContext.resolvedTheme : undefined,
    isLoading: themeContext ? false : isLoading,
    isSaving,
    error,
    updateTheme,
  };
}

