import React from "react";
import { Check, Moon, Monitor, Sun } from "lucide-react";
import { useTheme, THEMES } from "@/context/ThemeContext.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";

export default function ThemeToggle({ className = "" }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={`min-h-9 min-w-9 sm:h-7 sm:w-7 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center ${className}`}
            aria-label={`Theme: ${theme}. Click to switch theme.`}
            title="Toggle theme"
          >
            {theme === THEMES.SYSTEM ? (
              <Monitor size={14} aria-hidden="true" />
            ) : resolvedTheme === "dark" ? (
              <Moon size={14} aria-hidden="true" />
            ) : (
              <Sun size={14} aria-hidden="true" />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem
          onClick={() => setTheme(THEMES.LIGHT)}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <span className="flex items-center gap-2">
            <Sun size={14} className="text-muted-foreground" aria-hidden="true" />
            <span>Light</span>
          </span>
          {theme === THEMES.LIGHT && <Check size={14} className="text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme(THEMES.DARK)}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <span className="flex items-center gap-2">
            <Moon size={14} className="text-muted-foreground" aria-hidden="true" />
            <span>Dark</span>
          </span>
          {theme === THEMES.DARK && <Check size={14} className="text-primary" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme(THEMES.SYSTEM)}
          className="flex items-center justify-between cursor-pointer text-xs"
        >
          <span className="flex items-center gap-2">
            <Monitor size={14} className="text-muted-foreground" aria-hidden="true" />
            <span>System</span>
          </span>
          {theme === THEMES.SYSTEM && <Check size={14} className="text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
