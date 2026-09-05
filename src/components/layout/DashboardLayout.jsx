import { Link, Outlet } from "react-router";
import { Plus, Settings, Ticket } from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import SidebarNav from "../common/SidebarNav";
import BrandLogo from "../common/BrandLogo";
import { Button } from "../ui/button.jsx";

function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas">
      <aside className="z-20 hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="border-b border-border py-2">
          <BrandLogo />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="space-y-2 border-t border-border p-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Classroom
          </p>
          <Button
            to="/dashboard/class/join"
            variant="outline"
            className="w-full justify-start"
          >
            <Ticket size={17} aria-hidden="true" />
            Join with code
          </Button>
          <Button to="/dashboard/class/create" className="w-full justify-start">
            <Plus size={17} aria-hidden="true" />
            Create a class
          </Button>
        </div>
        <div className="border-t border-border p-3">
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-main transition-colors hover:bg-canvas"
          >
            <Settings size={19} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>
      <div className="relative flex h-full min-w-0 flex-1 flex-col">
        <div className="z-10 bg-surface">
          <DashboardHeader />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout
