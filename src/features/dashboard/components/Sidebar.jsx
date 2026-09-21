import { Link } from "react-router";
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
      } z-20 shrink-0 flex-col border-r border-border/70 bg-sidebar text-sidebar-foreground transition-all duration-200 ${
        compact ? "w-14 items-center" : "w-56"
      }`}
    >
      <div className="w-full flex-1 overflow-y-auto">
        <nav
          className={`flex-1 ${compact ? "p-1.5" : "p-2"}`}
          aria-label="Main navigation"
        >
          <ul className="space-y-0.5">
            {SIDEBAR_NAV_ITEMS.map(({ label, to, Icon }) => (
              <li key={to}>
                <SidebarLink
                  to={to}
                  label={label}
                  Icon={Icon}
                  compact={compact}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Spaces Actions Section */}
      <div
        className={`w-full space-y-1.5 border-t border-border/60 ${
          compact ? "p-1.5 text-center" : "p-2"
        }`}
      >
        <p
          className={`text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 transition-all ${
            compact ? "sr-only" : "px-1"
          }`}
        >
          Spaces
        </p>
        <Button
          to={routes.classes.join}
          variant="outline"
          size="sm"
          className={`w-full h-7 text-xs border-border/70 ${
            compact ? "justify-center px-0" : "justify-start"
          }`}
          title={compact ? "Join with code" : undefined}
        >
          <Ticket size={13} aria-hidden="true" />
          <span className={compact ? "hidden" : ""}>Join with code</span>
        </Button>
        {(user?.canCreateCourses || user?.isAdmin) && (
          <Button
            to={routes.spaces.new}
            size="sm"
            className={`w-full h-7 text-xs ${
              compact ? "justify-center px-0" : "justify-start"
            }`}
            title={compact ? "Create a space" : undefined}
          >
            <Plus size={13} aria-hidden="true" />
            <span className={compact ? "hidden" : ""}>Create a space</span>
          </Button>
        )}
      </div>

      {/* Settings Footer Section */}
      <div
        className={`w-full border-t border-border/60 ${compact ? "p-1.5" : "p-2"}`}
      >
        <Link
          to={routes.settings}
          className={`flex items-center rounded-md text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground ${
            compact ? "justify-center py-1.5 px-0" : "gap-2.5 px-2 py-1.5"
          }`}
          title={compact ? "Settings" : undefined}
        >
          <Settings size={15} />
          <span className={compact ? "hidden" : ""}>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
