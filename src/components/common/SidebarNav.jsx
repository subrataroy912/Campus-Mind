import { NavLink } from 'react-router'
import { SIDEBAR_NAV_ITEMS } from '../../config/navigation'
import { getNavLinkStyles } from '../../utils/routeHelpers'

export default function SidebarNav({ compact = false, onNavigate }) {
  return (
    <nav className="flex-1 p-3" aria-label="Main navigation">
      <ul className="space-y-1">
        {SIDEBAR_NAV_ITEMS.map(({ label, to, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/dashboard"}
              className={getNavLinkStyles}
              onClick={onNavigate}
              title={compact ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              <span className={compact ? "sr-only" : undefined}>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
