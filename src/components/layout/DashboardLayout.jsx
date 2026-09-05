import { Link, Outlet } from 'react-router';
import DashboardHeader from '../dashboard/DashboardHeader';
import SidebarNav from '../common/SidebarNav';
import BrandLogo from "../common/BrandLogo";
import { Settings } from 'lucide-react'

function DashboardLayout() {
  return (

    <div className="flex h-screen w-full overflow-hidden bg-canvas">


      <aside className="z-20 hidden w-56 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <BrandLogo />
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <SidebarNav />
        </div>
        <div className="border-t border-border p-3">
          <Link
            to={"/dashboard/settings"}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-text-main hover:bg-canvas">
            <Settings size={19} />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">

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

export default DashboardLayout;
