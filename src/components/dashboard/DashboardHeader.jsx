import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import avatarImage from "../../assets/avatar.png";
import { BsGear } from 'react-icons/bs';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { MenuIcon, Plus, SearchIcon } from 'lucide-react';
import { SIDEBAR_NAV_ITEMS } from "../../config/navigation"
import { getNavLinkStyles } from "../../utils/routeHelpers"
import NotificationCard from '../notification/NotificationCard';
function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuBarOpen, setIsMenuBarOpen] = useState(false);
  const [isNotificationCard, setIsNotificationCard] = useState(false);
  return (
    <section className="relative shadow-sm flex items-center justify-between gap-5 rounded-lg bg-white px-2 py-2 text-gray-950">

      {/* MOBILE HAMBURGER MENU */}
      <div className='md:hidden flex items-center'>
        <button className='cursor-pointer text-gray-700 hover:text-gray-900 transition-colors' onClick={() => setIsMenuBarOpen(!isMenuBarOpen)}>
          <MenuIcon size={24} />
        </button>
        {/* TODO: useClickOutsideHide */}

        <div
          className={`absolute top-16 left-0 z-50 flex h-[calc(100vh-4.5rem)] w-64 flex-col justify-between border-r border-gray-200 bg-white shadow-xl transition-all duration-300 ease-in-out ${isMenuBarOpen
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 pointer-events-none'
            }`}
        >
          <div>
            <ul className="p-2 space-y-1">
              {SIDEBAR_NAV_ITEMS.map(({ label, to, Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === "/dashboard"}
                    className={({ isActive }) => getNavLinkStyles(isActive)}
                    onClick={() => setIsMenuBarOpen(false)} // Fixed toggle bug
                  >
                    <Icon size={20} className="shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-zinc-200 p-3">
            <Link
              to="/dashboard/settings"
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <BsGear className="text-xl" />
              <span>Settings</span>
            </Link>
          </div>
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
      <div className=''>
        <ul className="flex justify-center items-center gap-2">
          {/* Upload */}
          <li>
            <Link
              to="#"
              className="relative flex items-center justify-center p-1 text-gray-700 hover:text-gray-900 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Upload"
            >
              <Plus size={30} />
            </Link>
          </li>

          {/* Notifications */}
          <li className=''>
            <button
              className="relative flex items-center justify-center p-1 text-gray-700 hover:text-gray-900 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Notifications"
              onClick={() => setIsNotificationCard(true)}
            >
              <IoIosNotificationsOutline size={30} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border border-white">
                1
              </span>
            </button>

          </li>

          {/* Profile Dropdown */}
          <li className="relative flex items-center w-10 shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className=" rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              aria-label="Open profile menu"
            >
              <img
                src={avatarImage}
                alt="Profile"
                className="w-8 h-8  rounded-full object-cover border border-gray-200 hover:border-gray-400 transition-colors"
              />
            </button>



          </li>
        </ul>
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white py-1 z-50 border border-gray-100 rounded-md shadow-lg">
            <Link
              to="/dashboard/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/dashboard/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Settings
            </Link>
            <hr className="my-1 border-gray-200" />
            <button
              className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50"
              onClick={() => setIsDropdownOpen(false)}
            >
              Log out
            </button>
          </div>
        )}
        {
          isNotificationCard && (
            <NotificationCard onClose={() => setIsNotificationCard(false)} />
          )
        }
      </div>

    </section >
  );
}

export default DashboardHeader;
