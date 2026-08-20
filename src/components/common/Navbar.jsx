import React from 'react';
import BrandLogo from './BrandLogo';
import { 
  IoIosNotificationsOutline, 
  IoIosPerson, 
  IoIosLogOut 
} from "react-icons/io";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between w-full px-4 py-3 bg-gray-900 text-gray-100 shadow-md sm:px-6">
            
            {/* Left Section: Logo */}
            <div className="flex items-center flex-shrink-0 cursor-pointer">
                <BrandLogo />
            </div>

            {/* Right Section: Actions */}
            <ul className="flex items-center gap-2 sm:gap-4">
                <li>
                    <button 
                        aria-label="Notifications"
                        className="flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 rounded-lg hover:bg-gray-800 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <IoIosNotificationsOutline className="w-6 h-6" />
                        <span className="hidden md:block">Notifications</span>
                    </button>
                </li>
                <li>
                    <button 
                        aria-label="Profile"
                        className="flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 rounded-lg hover:bg-gray-800 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <IoIosPerson className="w-5 h-5" />
                        <span className="hidden md:block">Profile</span>
                    </button>
                </li>
                <li>
                    <button 
                        aria-label="Logout"
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-400 transition-all duration-200 rounded-lg hover:bg-red-950 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <IoIosLogOut className="w-5 h-5" />
                        <span className="hidden md:block">Logout</span>
                    </button>
                </li>
            </ul>
            
        </nav>
    );
}