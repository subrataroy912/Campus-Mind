import { Outlet } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import SidebarNav from '../common/SidebarNav';
import BrandLogo from "../common/BrandLogo";

function DashboardLayout() {
  return (

    <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden">


      <aside className="hidden md:flex w-46 lg:w-54 flex-col border-r border-indigo-100 bg-white shadow-sm z-20 shrink-0">
        <BrandLogo />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">

        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md">
          <DashboardHeader />
        </div>


        <main className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;