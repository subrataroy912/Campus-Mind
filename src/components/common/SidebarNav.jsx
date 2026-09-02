import { NavLink } from "react-router";
import { SIDEBAR_NAV_ITEMS } from "../../config/navigation";
import { getNavLinkStyles } from "../../utils/routeHelpers";

export default function SidebarNav() {
  return (
    <nav className="p-3 flex-1">
      <ul className="space-y-1">
        {SIDEBAR_NAV_ITEMS.map(({ label, to, Icon }) => (
          <li key={to}>
            <NavLink 
              to={to} 
              end={to === '/dashboard'} 
              className={getNavLinkStyles}
            >
              <Icon size={20} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}