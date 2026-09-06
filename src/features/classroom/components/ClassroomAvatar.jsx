import { initials } from "../../../utils/initials.js";

export function ClassroomAvatar({ name, size = "h-9 w-9" }) {
  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-medium text-text-main`}>
      {initials(name)}
    </div>
  );
}
