import { SPACE_TYPES } from "../../model/createSpaceForm.js";
import { SpaceSelect } from "./SpaceSelect.jsx";

export default function SpaceTypeSelector({ form, update }) {
  return (
    <div className="space-y-1">
      <label
        htmlFor="create-space-type"
        className="block text-xs font-semibold text-text-heading"
      >
        Space Type <span className="text-secondary">*</span>
      </label>
      <SpaceSelect
        id="create-space-type"
        value={form.spaceType || "ACADEMIC_CLASS"}
        onChange={(val) => update("spaceType", val)}
        options={SPACE_TYPES}
      />
    </div>
  );
}

export { SpaceTypeSelector };
