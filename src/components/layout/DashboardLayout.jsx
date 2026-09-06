import { Outlet } from "react-router";
import { useState } from "react";
import DashboardHeader from "../../pages/dashboard/components/DashboardHeader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "../../pages/dashboard/components/Sidebar";
function DashboardLayout() {
  const [isCompact, setIsCompact] = useState(true);
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-canvas">
      <DashboardHeader />
      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        {/* Container for sidebar and its floating toggle button */}
        <div className="relative flex shrink-0">
          <Sidebar compact={isCompact} />

          {/* 2. Floating Toggle Button */}
          <button
            onClick={() => setIsCompact(!isCompact)}
            className="absolute -right-3 top-6 z-30 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-text-muted shadow-sm hover:bg-canvas md:flex"
            aria-label={isCompact ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCompact ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className="z-10 bg-surface"></div>

        <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
