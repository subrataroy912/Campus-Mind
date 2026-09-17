import { Link } from "react-router"; // or "react-router-dom"
import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import { SIDEBAR_NAV_ITEMS } from "@/config/navigation.js";
import { Plus, Settings, Ticket } from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import { routes } from "@/routes/paths";

export default function Sidebar({
  compact = false,
  onNavigate,
  isAbsolute = "",
}) {
  const { user } = useAuth();

  return (
    <aside
      className={`${
        isAbsolute ? `${isAbsolute} flex` : "hidden md:flex"
      } z-20 shrink-0 flex-col border-border bg-surface transition-all md:border-r duration-200 ${
        compact ? "w-16 items-center" : "w-64"
      }`}
    >
      <div className="w-full flex-1 overflow-y-auto">
        <nav
          className={`flex-1 ${compact ? "p-2" : "p-3"}`}
          aria-label="Main navigation"
        >
          <ul className="space-y-1">
            {SIDEBAR_NAV_ITEMS.map(({ label, to, Icon, end }) => (
              <li key={to}>
                <SidebarLink
                  to={to}
                  label={label}
                  Icon={Icon}
                  compact={compact}
                  onNavigate={onNavigate}
                  end={end}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

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
          Spaces
        </p>

        <Button
          variant="outline"
          className={`w-full ${
            compact ? "justify-center p-0" : "justify-start gap-3 px-3"
          }`}
          title={compact ? "Join with code" : undefined}
        >
          <Link
            to={routes.classes.join}
            onClick={onNavigate}
            className="flex items-center justify-center gap-2"
          >
            <Ticket size={17} aria-hidden="true" />
            <span className={compact ? "hidden" : ""}>Join with code</span>
          </Link>
        </Button>

        {(user?.canCreateCourses || user?.isAdmin) && (
          <Button
            className={`w-full ${
              compact ? "justify-center p-0" : "justify-start gap-3 px-3"
            }`}
            title={compact ? "Create a space" : undefined}
          >
            <Link
              to={routes.spaces.new}
              onClick={onNavigate}
              className="flex items-center justify-center gap-2"
            >
              <Plus size={17} aria-hidden="true" />
              <span className={compact ? "hidden" : ""}>Create a space</span>
            </Link>
          </Button>
        )}
      </div>

      <div
        className={`w-full border-t border-border ${compact ? "p-2" : "p-3"}`}
      >
        <Button
          variant="ghost"
          className={`w-full text-text-main hover:bg-canvas ${
            compact ? "justify-center p-0" : "justify-start gap-3 px-3"
          }`}
          title={compact ? "Settings" : undefined}
        >
          <Link
            to={routes.settings}
            onClick={onNavigate}
            className="flex items-center justify-center gap-2"
          >
            <Settings size={19} aria-hidden="true" />
            <span className={compact ? "hidden" : ""}>Settings</span>
          </Link>
        </Button>
      </div>
    </aside>
  );
}
