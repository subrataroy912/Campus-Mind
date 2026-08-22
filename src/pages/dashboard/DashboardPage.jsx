// src/layouts/DashboardLayout.jsx
import { Link, NavLink } from 'react-router-dom';
import { IoBookOutline, IoHomeOutline } from 'react-icons/io5';
import { BsChat } from 'react-icons/bs';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

import { getNavLinkStyles } from '../../utils/routeHelpers';

function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <aside className="w-64 min-w-[256px] border-r border-indigo-100 bg-white flex flex-col">
        <Link to="/" className="flex p-4 gap-3 items-center border-b border-slate-100">
          <img src="/src/assets/profile-image.jpg" alt="Campus Mind Logo" className="w-10 h-10 rounded-lg object-cover" />
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">Campus Mind</h1>
        </Link>

        <nav className="p-3 flex-1">
          <ul className="space-y-1">
            <li>
              <NavLink to="/dashboard" className={getNavLinkStyles}>
                <IoHomeOutline size={20} className="shrink-0" />
                <span>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/classes" className={getNavLinkStyles}>
                <IoBookOutline size={20} className="shrink-0" />
                <span>Classes</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/chat" className={getNavLinkStyles}>
                <BsChat size={20} className="shrink-0" />
                <span>Chat</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-6 md:p-8 overflow-y-auto flex-1">

        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
