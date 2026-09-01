import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function KebabMenu({ onAction }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    { id: "mute", label: "Mute notifications" },
    { id: "copy", label: "Copy invite link" },
    { id: "leave", label: "Leave class", danger: true },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="Quick actions"
        aria-haspopup="true"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full text-white/90 transition hover:bg-white/20"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.75" />
          <circle cx="12" cy="12" r="1.75" />
          <circle cx="12" cy="19" r="1.75" />
        </svg>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-9 z-10 w-48 overflow-hidden rounded-lg bg-white py-1 shadow-lg ring-1 ring-slate-200"
        >
          {actions.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                onAction?.(a.id);
                setOpen(false);
              }}
              className={`block w-full px-3.5 py-2 text-left text-sm transition hover:bg-slate-50 ${a.danger ? "text-rose-600" : "text-slate-700"
                }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClassCard({
  title = "Algebra II",
  subtitle = "Period 3",
  theme = "bg-indigo-500",
  coverImage = null,
  teacher = { name: "Ms. Patel", avatar: null, initials: "MP" },
  unreadCount = 0,
  deadline = null,
  memberCount = 0,
  onlineCount = 0,
  onAction,
  onOpen,
}) {
  return (
      <div
        onClick={onOpen}
        className="group flex w-full max-w-sm cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
      >
        {/* Cover / theme banner */}
        <div
          className={`relative flex h-24 items-start justify-between p-3 sm:h-28 ${coverImage ? "" : theme
            }`}
          style={
            coverImage
              ? {
                backgroundImage: `url(${coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
              : undefined
          }
        >
          {/* Notification badge */}
          {unreadCount > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white ring-2 ring-white/80">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : (
            <span />
          )}

          {/* Kebab menu */}
          <KebabMenu onAction={(action) => onAction?.(action)} />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title + subtitle */}
          <h3 className="truncate text-lg font-semibold leading-tight text-slate-900 sm:text-xl">
            {title}
          </h3>
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>

          {/* Teacher info */}
          <div className="mt-3 flex items-center gap-2">
            {teacher.avatar ? (
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="h-6 w-6 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                {teacher.initials}
              </div>
            )}
            <span className="text-sm text-slate-600">{teacher.name}</span>
          </div>

          {/* Deadline alert */}
          {deadline && (
            <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700">
              <svg
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78a1.5 1.5 0 001.29-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z"
                />
              </svg>
              <span className="line-clamp-1">{deadline}</span>
            </div>
          )}

          {/* Footer: member count + online */}
          <div className="mt-auto flex items-center justify-between pt-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.09 9.09 0 003.741-.479 3 3 0 00-4.682-2.72M18 18.72a8.986 8.986 0 01-6 0m6 0v-.234a3.75 3.75 0 00-1.5-3.01m-5.5 3.244a8.986 8.986 0 01-6 0m6 0v-.234a3.75 3.75 0 011.5-3.01m-7 3.235a3 3 0 013.742-2.72M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              <span>{memberCount} students</span>
            </div>

            {onlineCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>{onlineCount} online</span>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
