import { Outlet } from 'react-router-dom'; // 1. Import Outlet
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import SidebarNav from '../../components/common/SidebarNav';
import BrandLogo from "../../components/common/BrandLogo";

function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <aside className="w-64 min-w-[256px] border-r border-indigo-100 bg-white flex flex-col">
        <BrandLogo/>
        <SidebarNav/>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className=" overflow-y-auto flex-1">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
