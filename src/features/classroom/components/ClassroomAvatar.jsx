import { Link } from "react-router";

export function ClassroomAvatar({ avatar, name, to = "#", size = "h-9 w-9" }) {
  const safeAvatar =
    typeof avatar === "string" && avatar.trim() ? avatar : null;

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-canvas text-xs font-medium text-text-main`}
    >
      <Link to={to} className="flex h-full w-full items-center justify-center">
        {safeAvatar ? (
          <img
            src={safeAvatar}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wide text-text-main">
            {name?.slice(0, 2) || "U"}
          </span>
        )}
      </Link>
    </div>
  );
}
