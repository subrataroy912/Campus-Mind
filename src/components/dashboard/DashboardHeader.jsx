import { SearchIcon } from 'lucide-react';
import { FaAngleDown } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { useState } from 'react';

function DashboardHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <section className=" shadow-sm flex items-center justify-between rounded-lg bg-white px-6 py-2 text-gray-950">

      {/* SEARCH BAR */}
      <div
        className='flex justify-start items-center gap-2 bg-[#F1F3F4] rounded-md py-2 px-4 w-72 lg:w-96'
      >
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
          <li>
            <Link to="/notification" className="relative">
              <IoIosNotificationsOutline size={30} />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                1
              </span>
            </Link>
          </li>
          <li className='relative'>
            <div className="flex items-center gap-2">
              <img src="/src/assets/profile-image.jpg" alt="Profile" className="w-10 h-10 rounded-full object-cover" />
              <button onClick={() => { setIsDropdownOpen(!isDropdownOpen) }} className="flex items-center gap-1 cursor-pointer">
                <FaAngleDown className="text-gray-600" />
              </button>

            </div>
            {isDropdownOpen && (
              <div className='absolute right-0 mt-2 w-48 bg-white py-1 z-50 border border-gray-100 rounded-md shadow-lg'>
                <Link
                  to="/profile"
                  className='block px-4 py-2 text-gray-800 hover:bg-gray-100'
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                >Profile</Link>
                <Link
                  to="/settings"
                  className='block px-4 py-2 text-gray-800 hover:bg-gray-100'
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                >Settings</Link>
                <hr className="my-1 border-gray-200" />
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    setIsDropdownOpen(false);
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </section >
  )
}

export default DashboardHeader;