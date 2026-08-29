import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightCircle } from 'lucide-react';
import ClassCard from "../../components/dashboard/ClassCard";
import Classes from "../../utils/data.js";
import { it } from 'date-fns/locale';

function DashboardHome() {
  return (
    <div className="min-h-screen bg-gray-50/30 p-4 sm:p-6">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-[1600px] mx-auto">

        {/* Main Content Area */}
        <div className="flex flex-col gap-8 lg:col-span-9">

          {/* Header Section */}
          <div>
            <h1 className="font-semibold text-xl sm:text-2xl text-gray-800 tracking-tight">
              Welcome back, Subrata Roy
            </h1>
            <p className="font-light text-sm sm:text-base text-gray-500 mt-1">
              Here's what's happening in your classes today.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
              <Link
                to={'/create-class'}
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium text-sm sm:text-base px-4 py-2.5 rounded-lg shadow-sm transition-colors text-center">
                + Create New Class
              </Link >
              <Link
                to={"/join-class"}
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm sm:text-base px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm transition-colors text-center">
                Join with class code
              </Link >
            </div>
          </div>

          {/* Classes Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg sm:text-xl text-gray-800 tracking-tight">My Classes</h2>
              <Link
                to="/dashboard/classes"
                className="flex items-center justify-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors group"
              >
                <span className="hidden sm:inline">View all classes</span>
                <span className="sm:hidden">View all</span>
                <ArrowRightCircle className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* title = "Algebra II",
            subtitle = "Period 3",
            theme = "bg-indigo-500",
            coverImage = null,
            teacher = {name: "Ms. Patel", avatar: null, initials: "MP" },
            unreadCount = 0,
            deadline = null,
            memberCount = 0,
            onlineCount = 0,
            onAction,
            onOpen, */}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 sm:gap-5">
              {Classes.slice(0, 4).map((item, index) => (
                <ClassCard
                  key={index}
                  title={item.title}
                  subtitle={item.subtitle}
                  theme={item.theme}
                  coverImage={item.coverImage}
                  teacher={item.teacher}
                  unreadCount={item.unreadCount}
                  deadline={item.deadline}
                  memberCount={item.memberCount}
                  onlineCount={item.onlineCount}
                  onAction={item.onAction}
                  onOpen={item.onOpen}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="hidden  md:flex flex-col gap-4 sm:gap-6 lg:col-span-3 mt-2 lg:mt-0">

          <div className="flex flex-col bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm min-h-52 sm:min-h-64">
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base mb-3">Recent Activities</h2>
            <div className="grow flex items-center justify-center text-gray-400 text-sm">No recent activity.</div>
          </div>

          <div className="flex flex-col bg-white p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm min-h-52 sm:min-h-64">
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base mb-3">Online Classmates (10)</h2>
            <div className="grow flex items-center justify-center text-gray-400 text-sm">List goes here...</div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardHome;