import { Link, NavLink } from "react-router";
import {Button} from "@/components/ui/button.jsx";
import { SIDEBAR_NAV_ITEMS } from "../../../config/navigation";
import { getNavLinkStyles } from "../../../utils/routeHelpers";
import { Plus, Settings, Ticket } from "lucide-react";

export default function Sidebar({
  compact = false,
  onNavigate,
  isAbsolute = "",
}) {
  return (
    <aside
      className={`${
        isAbsolute ? `${isAbsolute} flex` : "hidden md:flex"
      } z-20 shrink-0 flex-col border-r border-border bg-surface transition-all duration-200 ${
        compact ? "w-16 items-center" : "w-64"
      }`}
    >
      <div className="w-full flex-1 overflow-y-auto">
        <nav
          className={`flex-1 ${compact ? "p-2" : "p-3"}`}
          aria-label="Main navigation"
        >
          <ul className="space-y-1">
            {SIDEBAR_NAV_ITEMS.map(({ label, to, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/dashboard"}
                  className={(navState) =>
                    `${getNavLinkStyles(navState)} ${
                      compact ? "justify-center px-0" : ""
                    }`
                  }
                  onClick={onNavigate}
                  title={compact ? label : undefined}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className={compact ? "hidden" : ""}>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Classroom Actions Section */}
      <div
        className={`w-full space-y-2 border-t border-border ${
          compact ? "p-2 text-center" : "p-3"
        }`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-wide text-text-muted transition-all ${
            compact ? "sr-only" : "px-2"
          }`}
        >
          Classroom
        </p>
        <Button
          to="/dashboard/class/join"
          variant="outline"
          className={`w-full ${compact ? "justify-center p-0" : "justify-start"}`}
          title={compact ? "Join with code" : undefined}
        >
          <Ticket size={17} aria-hidden="true" />
          <span className={compact ? "hidden" : ""}>Join with code</span>
        </Button>
        <Button
          to="/dashboard/class/create"
          className={`w-full ${compact ? "justify-center p-0" : "justify-start"}`}
          title={compact ? "Create a class" : undefined}
        >
          <Plus size={17} aria-hidden="true" />
          <span className={compact ? "hidden" : ""}>Create a class</span>
        </Button>
      </div>

      {/* Settings Footer Section */}
      <div
        className={`w-full border-t border-border ${compact ? "p-2" : "p-3"}`}
      >
        <Link
          to="/dashboard/settings"
          className={`flex items-center rounded-md text-sm font-medium text-text-main transition-colors hover:bg-canvas ${
            compact ? "justify-center py-2 px-0" : "gap-3 px-3 py-2"
          }`}
          title={compact ? "Settings" : undefined}
        >
          <Settings size={19} />
          <span className={compact ? "hidden" : ""}>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
