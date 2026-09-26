import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { routes } from "@/routes/paths";
import { cn } from "@/lib/utils";

export function SpaceAvatar({
  avatar,
  name,
  userId,
  to = "#",
  size = "h-9 w-9",
  className,
  ...props
}) {
  const safeAvatar =
    typeof avatar === "string" && avatar.trim() ? avatar : null;
  const targetLink = to !== "#" ? to : userId ? routes.user(userId) : "#";

  const avatarEl = (
    <Avatar
      className={cn(
        "shrink-0 bg-canvas text-xs font-medium text-text-main",
        size,
        className,
      )}
      {...props}
    >
      <AvatarImage
        src={safeAvatar}
        alt={name || "User"}
        loading="lazy"
        decoding="async"
        className="h-full w-full rounded-full object-cover"
      />
      <AvatarFallback className="bg-canvas text-[10px] font-bold uppercase tracking-wide text-text-main">
        {name?.slice(0, 2) || "U"}
      </AvatarFallback>
    </Avatar>
  );

  if (targetLink !== "#") {
    return (
      <Link
        to={targetLink}
        className="inline-flex shrink-0 items-center justify-center transition-opacity hover:opacity-85"
      >
        {avatarEl}
      </Link>
    );
  }

  return avatarEl;
}
