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
  return (
    <NavLink
      to={to}
      end={end ?? to === routes.dashboard}
      className={(navState) =>
        `${getNavLinkStyles(navState)} ${
          compact ? "justify-center px-0" : ""
        }`.trim()
      }
      onClick={onNavigate}
      title={compact ? label : undefined}
    >
      {Icon && <Icon size={18} className="shrink-0" />}
      <span className={compact ? "hidden" : ""}>{label}</span>
    </NavLink>
  );
}

const getNavLinkStyles = ({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
    isActive
      ? "bg-canvas text-primary"
      : "text-text-main hover:bg-canvas hover:text-text-heading"
  }`;
