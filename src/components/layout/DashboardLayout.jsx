import { Link, Outlet } from 'react-router';
import DashboardHeader from '../dashboard/DashboardHeader';
import SidebarNav from '../common/SidebarNav';
import BrandLogo from "../common/BrandLogo";
import { BsGear } from 'react-icons/bs';

function DashboardLayout() {
  return (

    <div className="flex h-screen w-full bg-slate-50/50 overflow-hidden">


      <aside className="hidden md:flex w-46 lg:w-54 flex-col border-r border-indigo-100 bg-white shadow-sm z-20 shrink-0">
        <BrandLogo />
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <SidebarNav />
        </div>
        <div className='border-t border-zinc-300/50 p-2 sm:p-3'>
          <Link
            to={"/dashboard/settings"}
            className='flex items-center justify-center sm:justify-start space-x-0 sm:space-x-2 px-2 sm:px-4 pb-2'>
            <BsGear className="text-xl sm:text-base" />
            <span className='hidden sm:inline-block'>Settings</span>
          </Link>
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