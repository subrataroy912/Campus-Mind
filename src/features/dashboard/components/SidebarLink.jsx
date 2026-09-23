import { NavLink } from "react-router";

export function SidebarLink({
  to,
  label,
  Icon,
  compact = false,
  onNavigate,
  end,
}) {
  // Default to exact-match (`end=true`) so a nav item is only highlighted when
  // the current path matches it exactly — not when it merely starts with the
  // same prefix. Without this, "/spaces" lights up on "/spaces/new" and
  // "/spaces/join" because NavLink uses a prefix match when end=false.
  // Callers can pass `end={false}` explicitly for items that should stay active
  // across a full sub-tree (e.g. a section that owns many nested pages).
  const isEnd = end ?? true;

  return (
    <NavLink
      to={to}
      end={isEnd}
      className={(navState) => {
        const isActive = typeof navState === "object" ? navState?.isActive : false;
        return `group relative flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
          compact ? "justify-center px-0" : ""
        } ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
        }`.trim();
      }}
      onClick={onNavigate}
      title={compact ? label : undefined}
    >
      {Icon && (
        <Icon
          size={15}
          className="shrink-0 transition-colors"
        />
      )}
      <span className={compact ? "hidden" : "truncate"}>{label}</span>
    </NavLink>
  );
}
