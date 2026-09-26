import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SearchInput({
  value: controlledValue,
  defaultValue = "",
  onChange, // Fires after debounce
  onImmediateChange, // Optional: fires on every keystroke
  placeholder = "Search...",
  debounceMs = 250,
  className,
  inputClassName,
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

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const timerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Handle debouncing without triggering immediate cascading state changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onChangeRef.current?.(currentValue.trim());
      timerRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentValue, debounceMs]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onImmediateChange?.(val);
  };

  const handleClear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!isControlled) {
      setUncontrolledValue("");
    }
    onChangeRef.current?.("");
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

      <Input
        type="text"
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "w-full rounded-md bg-background pr-7 text-base sm:text-xs",
          isSmall ? "h-8 pl-8" : "h-9 pl-9 sm:text-sm",
          inputClassName,
        )}
        {...props}
      />

      {currentValue && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 -translate-y-1/2 min-h-8 min-w-8 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
