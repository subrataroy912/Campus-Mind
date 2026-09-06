import { Link } from "react-router";

export function ClassroomAvatar({ avatar, name, to = "#", size = "h-9 w-9" }) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-medium text-text-main`}
    >
      <Link to={to}>
        <img src={avatar} alt={name} className="rounded-full" />
      </Link>
    </div>
  );
}
