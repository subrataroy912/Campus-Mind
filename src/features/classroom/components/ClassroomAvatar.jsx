import { Link } from "react-router";

export function ClassroomAvatar({
  avatar,
  name,
  userId,
  to = "#",
  size = "h-9 w-9",
}) {
  const safeAvatar =
    typeof avatar === "string" && avatar.trim() ? avatar : null;

  const targetLink =
    to !== "#"
      ? to
      : userId
      ? `/dashboard/profile/${userId}`
      : "#";

  const content = (
    <>
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
    </>
  );

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-canvas text-xs font-medium text-text-main`}
    >
      {targetLink !== "#" ? (
        <Link
          to={targetLink}
          className="flex h-full w-full items-center justify-center transition-opacity hover:opacity-85"
        >
          {content}
        </Link>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {content}
        </div>
      )}
    </div>
  );
}
