import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function SpaceBasicInfoSection({ form, errors, update }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Basic Details
        </Label>
        <p className="text-[12px] text-text-muted">
          Identify your space with a clear title and brief description.
        </p>
      </div>

      {/* Space Name + Section in a responsive row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Label
            htmlFor="className"
            className="mb-1.5 block text-xs font-medium text-text-main"
          >
            Space name <span className="text-secondary">*</span>
          </Label>
          <Input
            id="className"
            type="text"
            value={form.className}
            onChange={(e) => update("className", e.target.value)}
            placeholder="e.g. Advanced Algorithms, AI Study Group"
            aria-invalid={!!errors.className}
            className={cn(
              "h-9 text-sm",
              errors.className &&
                "border-secondary focus-visible:ring-secondary/20"
            )}
          />
          {errors.className && (
            <p className="mt-1 text-xs font-medium text-secondary">
              {errors.className}
            </p>
          )}
        </div>

        <div>
          <Label
            htmlFor="section"
            className="mb-1.5 block text-xs font-medium text-text-main"
          >
            Section / Cohort
          </Label>
          <Input
            id="section"
            type="text"
            value={form.section}
            onChange={(e) => update("section", e.target.value)}
            placeholder="e.g. Batch '26, Pod B"
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label
          htmlFor="description"
          className="mb-1.5 block text-xs font-medium text-text-main"
        >
          Description & Goals
        </Label>
        <Textarea
          id="description"
          rows={2}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Brief overview or welcoming note for new members..."
          className="min-h-15 resize-y text-sm max-h-90"
        />
      </div>
    </div>
  );
}
