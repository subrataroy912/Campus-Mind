import { NavLink } from "react-router";
import { routes } from "@/routes/paths.js";

export function SidebarLink({
  to,
  label,
  Icon,
  compact = false,
  onNavigate,
  end,
}) {
  const isEnd = end ?? to === routes.dashboard;

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
