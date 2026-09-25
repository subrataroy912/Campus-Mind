import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { CLASS_CODE_LENGTH, normalizeClassCode } from "@/utils/classCode.js";

/**
 * Encapsulated 8-character space code grid input.
 * Handles single-character inputs, backspacing with previous focus,
 * full-string paste distribution, and formatting separator.
 */
export function ClassCodeInput({
  value,
  onChange,
  onComplete,
  disabled = false,
  autoFocus = true,
  hasError = false,
}) {
  const inputsRef = useRef([]);

  // Ensure value is always an array of characters
  const codeArray = Array.isArray(value)
    ? value
    : Array.from(
        { length: CLASS_CODE_LENGTH },
        (_, i) => (value || "")[i] || "",
      );

  useEffect(() => {
    if (autoFocus && !disabled) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus, disabled]);

  const updateCode = (newCode) => {
    onChange?.(newCode, newCode.join(""));
    if (newCode.every(Boolean)) {
      onComplete?.(newCode.join(""));
    }
  };

  const handleChange = (index, charValue) => {
    const clean = normalizeClassCode(charValue).slice(0, 1);
    const next = [...codeArray];
    next[index] = clean;
    updateCode(next);

    if (clean && index < CLASS_CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codeArray[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, CLASS_CODE_LENGTH)
      .split("");

    const next = [...codeArray];
    pasted.forEach((ch, i) => {
      next[i] = ch;
    });
    updateCode(next);

    const lastIndex = Math.min(pasted.length, CLASS_CODE_LENGTH) - 1;
    if (lastIndex >= 0) {
      inputsRef.current[lastIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5">
      {codeArray.map((char, i) => (
        <div key={i} className="flex items-center">
          <Input
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="text"
            maxLength={1}
            value={char}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`h-10 w-8 rounded-lg border px-0 text-center text-base font-semibold uppercase sm:h-11 sm:w-10 sm:text-lg ${
              hasError
                ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30 text-destructive"
                : "border-border text-text-heading"
            } ${disabled ? "opacity-50 cursor-not-allowed bg-muted/40" : "bg-background"}`}
            aria-label={`Code character ${i + 1}`}
          />
          {i === 3 && (
            <span className="mx-0.5 text-border sm:mx-1 font-bold select-none">
              –
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
