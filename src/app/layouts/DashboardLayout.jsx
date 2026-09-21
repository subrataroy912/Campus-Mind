import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DashboardHeader from "../../features/dashboard/components/DashboardHeader";
import Sidebar from "../../features/dashboard/components/Sidebar";
import { selectIsSidebarOpen } from "../../features/ui/uiSelectors.js";
import { toggleSidebar } from "../../features/ui/uiSlice.js";

function DashboardLayout() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const isCompact = !isSidebarOpen;

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-background text-foreground">
      <DashboardHeader />

      {/* Main App Workspace */}
      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        {/* Sidebar Container with Smooth Collapse/Expand */}
        <aside className="relative flex shrink-0 transition-[width] duration-200 ease-in-out">
          <Sidebar compact={isCompact} />

          {/* Floating Edge Toggle Button */}
          <button
            type="button"
            onClick={() => dispatch(toggleSidebar())}
            className="absolute -right-3 top-5 z-30 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-xs transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:flex"
            aria-label={isCompact ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCompact ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </aside>

        {/* Primary Scrollable Viewport */}
        <main
          id="main-content"
          className="flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
