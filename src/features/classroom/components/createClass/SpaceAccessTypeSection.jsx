import { ACCESS_OPTIONS } from "../../model/createSpaceForm.js";
import { SpaceSelect } from "./SpaceSelect.jsx";

export function SpaceAccessTypeSection({ form, update }) {
  const currentAccess = (form.accessType || "CODE").toUpperCase();

  return (
    <div className="space-y-1">
      <label
        htmlFor="create-space-access"
        className="block text-xs font-semibold text-text-heading"
      >
        Access Type
      </label>
      <SpaceSelect
        id="create-space-access"
        value={currentAccess}
        onChange={(val) => update("accessType", val)}
        options={ACCESS_OPTIONS}
      />
    </div>
  );
}

export const ClassAccessTypeSection = SpaceAccessTypeSection;
export default SpaceAccessTypeSection;
