import React from 'react';
import { Link } from 'react-router-dom';
import { BsPeople, BsThreeDotsVertical } from 'react-icons/bs';
import classPage from "../../assets/classes-page.png";

export default function ClassCard() {
  return (
    <div className="group w-full h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer overflow-hidden">
      
      {/* Banner Image Area - Scales height based on device size */}
      <div className="h-24 sm:h-28 md:h-32 w-full bg-blue-50 relative overflow-hidden shrink-0">
        <img 
          src={classPage} 
          alt="Class Banner" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.style.display = 'none' }} 
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Card Content - Dynamic padding for mobile vs desktop */}
      <div className="p-4 sm:p-5 flex flex-col grow gap-3">
        
        {/* Header: Title & Menu */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex flex-col items-start gap-1 w-[85%]">
            <h3 className="font-semibold text-gray-800 text-base sm:text-lg truncate w-full">
              Physics-1
            </h3>
            <span className="text-[10px] sm:text-[11px] font-medium bg-emerald-100 text-emerald-700 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200">
              Created by Subrata
            </span>
          </div>
          
          <button className="p-1 sm:p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors shrink-0">
            <BsThreeDotsVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Spacer to push footer to the bottom if cards are different heights */}
        <div className="grow"></div>

        {/* Footer: Stats & Action */}
        <div className="flex items-center justify-between mt-1 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-500 font-medium text-xs sm:text-sm">
            <BsPeople className="text-blue-500 w-4 h-4 sm:w-4 sm:h-4" />
            <span>32</span>
          </div>
          
          <Link 
            to="#" 
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Enter Class &rarr;
          </Link>
        </div>
        
      </div>
    </div>
  );
}