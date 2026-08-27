import { MenuIcon, SearchIcon } from 'lucide-react';
import { FaAngleDown } from "react-icons/fa";
import { Link, NavLink } from 'react-router-dom';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { useState } from 'react';
import avatarImage from "../../assets/avatar.png";
import { SIDEBAR_NAV_ITEMS } from "../../config/navigation"
import { getNavLinkStyles } from "../../utils/routeHelpers"
function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuBarOpen, setIsMenuBarOpen] = useState(false);

  return (
    <section className="relative shadow-sm flex items-center justify-between gap-5 rounded-lg bg-white px-6 py-2 text-gray-950">

      {/* MOBILE HAMBURGER MENU */}
      <div className='md:hidden flex items-center'>
        <button className='cursor-pointer text-gray-700 hover:text-gray-900 transition-colors' onClick={() => setIsMenuBarOpen(!isMenuBarOpen)}>
          <MenuIcon size={24} />
        </button>
        {/* TODO: useClickOutsideHide */}
        <div
          className={`absolute top-18 left-0 bg-white border-r border-gray-200 w-64 min-h-screen shadow-xl z-50 transform transition-all duration-300 ease-in-out ${isMenuBarOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 pointer-events-none'
            }`}
        >
          <ul className="p-3 space-y-1">
            {SIDEBAR_NAV_ITEMS.map(({ label, to, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === "/dashboard"}
                  className={({ isActive }) => getNavLinkStyles(isActive)}
                  onClick={() => setIsMenuBarOpen(!isMenuBarOpen)}>
                  <Icon size={20} className="shrink-0" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className='flex justify-start items-center gap-2 bg-[#F1F3F4] rounded-md py-2 px-4 w-72 lg:w-96'>
        <SearchIcon className="text-[#5F6368]" size={20} />
        <input
          className='outline-none bg-transparent placeholder:text-[#5F6368] w-full text-gray-800'
          type='search'
          placeholder='Search'
          aria-label='Search content'
        />
      </div>

      {/* RIGHT NAVIGATION */}
      <div>
        <ul className='flex justify-center items-center gap-5'>
          {/* Notifications */}
          <li>
            <Link to="/notification" className="relative block text-gray-700 hover:text-gray-900 transition-colors">
              <IoIosNotificationsOutline size={30} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                1
              </span>
            </Link>
          </li>

          {/* Profile Dropdown */}
          <li className='relative flex items-center gap-2'>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center justify-center w-full max-w-16">
                <img
                  src={avatarImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <span className="w-full text-center font-sans text-[10px] truncate tracking-tight text-gray-700">
                  Subrata Roy
                </span>
              </div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 cursor-pointer py-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-expanded={isDropdownOpen}
              >
                <FaAngleDown size={14} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {isDropdownOpen && (
              <div className='absolute right-0 top-full mt-2 w-48 bg-white py-1 z-50 border border-gray-100 rounded-md shadow-lg'>
                <Link
                  to="/profile"
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                  onClick={() => setIsDropdownOpen(false)}
                >Profile</Link>
                <Link
                  to="/dashboard/settings"
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'
                  onClick={() => setIsDropdownOpen(false)}
                >Settings</Link>
                <hr className="my-1 border-gray-200" />
                <button
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Log out
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </section >
  );
}

export default DashboardHeader;
