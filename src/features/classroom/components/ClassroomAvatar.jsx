export function ClassroomAvatar({ name, size = "h-9 w-9" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-medium text-text-main`}>
      {initials}
    </div>
  );
}
