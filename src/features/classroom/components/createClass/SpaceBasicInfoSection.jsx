import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SUBJECTS } from "../../model/createSpaceForm.js";
import { SpaceSelect } from "./SpaceSelect.jsx";

export function SpaceBasicInfoSection({ form, errors, update }) {
  const isCustomSubject = form.subject === "Other";

  return (
    <div className="space-y-3">
      {/* Space Name + Section in a responsive row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2 space-y-1">
          <Label
            htmlFor="className"
            className="block text-xs font-semibold text-text-heading"
          >
            Space name <span className="text-secondary">*</span>
          </Label>
          <Input
            id="className"
            type="text"
            value={form.className || form.title || ""}
            onChange={(e) => update("className", e.target.value)}
            placeholder="e.g. Data Structures & Algorithms, Robotics Club"
            aria-invalid={!!errors.className}
            className={cn(
              "h-9 text-xs",
              errors.className &&
                "border-secondary focus-visible:ring-secondary/20"
            )}
            maxLength={120}
          />
          {errors.className && (
            <p className="mt-0.5 text-xs font-medium text-secondary">
              {errors.className}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="section"
            className="block text-xs font-semibold text-text-heading"
          >
            Section / Cohort
          </Label>
          <Input
            id="section"
            type="text"
            value={form.section || ""}
            onChange={(e) => update("section", e.target.value)}
            placeholder="e.g. Section A, Fall 2026"
            className="h-9 text-xs"
            maxLength={80}
          />
        </div>
      </div>

      {/* Subject / Domain */}
      <div className="space-y-1">
        <Label
          htmlFor="subject"
          className="block text-xs font-semibold text-text-heading"
        >
          Subject / Domain <span className="text-secondary">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <SpaceSelect
            id="subject"
            value={form.subject || ""}
            onChange={(val) => update("subject", val)}
            options={SUBJECTS}
            placeholder="Select subject or domain…"
            error={!!errors.subject}
          />

          {isCustomSubject && (
            <Input
              type="text"
              value={form.customSubject || ""}
              onChange={(e) => update("customSubject", e.target.value)}
              placeholder="Specify custom domain…"
              className={cn(
                "h-9 text-xs",
                errors.customSubject &&
                  "border-secondary focus-visible:ring-secondary/20"
              )}
              autoFocus
              maxLength={80}
            />
          )}
        </div>
        {(errors.subject || errors.customSubject) && (
          <p className="text-xs font-medium text-secondary">
            {errors.subject || errors.customSubject}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label
          htmlFor="description"
          className="block text-xs font-semibold text-text-heading"
        >
          Description
        </Label>
        <Textarea
          id="description"
          rows={2}
          value={form.description || ""}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Briefly describe what this space is about, topics covered, or community guidelines..."
          className="min-h-16 resize-y text-xs max-h-60"
          maxLength={2000}
        />
      </div>
    </div>
  );
}

export const ClassBasicInfoSection = SpaceBasicInfoSection;
export default SpaceBasicInfoSection;
