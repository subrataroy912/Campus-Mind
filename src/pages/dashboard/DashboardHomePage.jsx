import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightCircle } from 'lucide-react';
import ClassCard from "../../components/dashboard/ClassCard";

function DashboardHome() {
  return (
    <div className="min-h-screen  bg-gray-50/30">


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-[1600px] mx-auto">

        <div className="flex flex-col gap-8 lg:col-span-8 xl:col-span-9">

          <div>
            <h1 className="font-semibold text-xl sm:text-2xl text-gray-800">
              Welcome back, Subrata Roy
            </h1>
            <p className="font-light text-sm sm:text-base text-gray-500 mt-1">
              Here's what's happening in your classes today.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
              <button className="bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm sm:text-base px-4 py-2.5 rounded-lg shadow-sm transition-colors text-center">
                + Create New Class
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm sm:text-base px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm transition-colors text-center">
                Join with class code
              </button>
            </div>
          </div>

          {/* Classes Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg sm:text-xl text-gray-800">My Classes</h2>
              <Link
                to="/dashboard/classes"
                className="flex items-center justify-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
              >
                {/* Short text for mobile, full text for tablet+ */}
                <span className="hidden sm:inline">View all classes</span>
                <span className="sm:hidden">View all</span>
                <ArrowRightCircle size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
              <ClassCard />
              <ClassCard />
              <ClassCard />
              <ClassCard />
            </div>
          </div>

          {/* Bottom Modules Grid (1 col mobile, 2 col tablet+) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm min-h-50">
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Upcoming Assignments</h2>
              {/* Assignment content */}
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm min-h-50">
              <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Global Announcements</h2>
              {/* Announcement content */}
            </div>
          </div>

        </div>

        {/* Right Sidebar Area (Spans 4 cols on medium desktops, 3 on large) */}
        <div className="flex flex-col gap-4 sm:gap-6 lg:col-span-4 xl:col-span-3 mt-2 lg:mt-0">

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm min-h-50 sm:min-h-60">
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Recent Activities</h2>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm min-h-50 sm:min-h-60">
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base">Online Classmates (10)</h2>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardHome;