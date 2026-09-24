import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchInput({
  value: controlledValue,
  defaultValue = "",
  onChange, // Fires after debounce
  onImmediateChange, // Optional: fires on every keystroke
  placeholder = "Search...",
  debounceMs = 250,
  className,
  size = "sm",
  ...props
}) {
  const isControlled = controlledValue !== undefined;

  // Track internal state for uncontrolled usage or local input typing
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [prevControlledValue, setPrevControlledValue] =
    useState(controlledValue);

  // Sync state during render instead of inside useEffect
  if (isControlled && controlledValue !== prevControlledValue) {
    setPrevControlledValue(controlledValue);
    setUncontrolledValue(controlledValue);
  }

  const currentValue = isControlled ? controlledValue : uncontrolledValue;

  // Handle debouncing without triggering immediate cascading state changes
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange?.(currentValue.trim());
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [currentValue, debounceMs, onChange]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onImmediateChange?.(val);
  };

  const handleClear = () => {
    if (!isControlled) {
      setUncontrolledValue("");
    }
    onChange?.("");
    onImmediateChange?.("");
  };

  const isSmall = size === "sm";

  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className={cn(
          "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
          isSmall ? "h-3.5 w-3.5" : "h-4 w-4",
        )}
      />

      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "w-full rounded-md border border-input bg-background pr-7 text-base outline-none transition sm:text-xs",
          "placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring",
          isSmall ? "h-8 pl-8" : "h-9 pl-9 sm:text-sm",
        )}
        {...props}
      />

      {currentValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 -translate-y-1/2 flex min-h-8 min-w-8 items-center justify-center rounded p-1 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
