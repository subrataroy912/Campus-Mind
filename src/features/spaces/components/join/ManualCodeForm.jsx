import { ClassCodeInput } from "./ClassCodeInput.jsx";
import { Button } from "@/components/ui/button.jsx";

export function ManualCodeForm({
  code,
  onChange,
  onSubmit,
  isLoading = false,
  status = "idle",
}) {
  const isIncomplete = status === "incomplete";

  return (
    <form onSubmit={onSubmit}>
      <label className="mb-2.5 block text-center text-xs font-medium text-text-main">
        Space code
      </label>

      <ClassCodeInput
        value={code}
        onChange={onChange}
        disabled={isLoading}
        hasError={isIncomplete}
      />

      {isIncomplete && (
        <p className="mt-2 text-center text-xs text-destructive">
          Enter all 8 characters of the space code.
        </p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="mt-4 h-9 w-full text-xs font-semibold shadow-xs"
      >
        {isLoading ? "Joining space…" : "Join space"}
      </Button>
    </form>
  );
}
