import { NavLink } from "react-router";

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
      end={end ?? to === "/dashboard"}
      className={(navState) =>
        `${getNavLinkStyles(navState)} ${
          compact ? "justify-center px-0" : ""
        }`.trim()
      }
      onClick={onNavigate}
      title={compact ? label : undefined}
    >
      {Icon && <Icon size={20} className="shrink-0" />}
      <span className={compact ? "hidden" : ""}>{label}</span>
    </NavLink>
  );
}

const getNavLinkStyles = ({ isActive }) =>
  `flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-canvas text-primary"
      : "text-text-main hover:bg-canvas hover:text-text-heading"
  }`;
