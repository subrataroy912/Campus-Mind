import React from 'react';
import { Link } from 'react-router-dom';
import { BsPeople, BsThreeDotsVertical } from 'react-icons/bs';

// Pass the whole class object as 'classItem'
export default function ClassCard({ classItem }) {
  // Destructure the exact keys from your JSON/Entity
  const { id, name, created_by_user_id, member_ids } = classItem;

  return (
    <div className="group w-full bg-white flex flex-col p-4 sm:p-5 rounded-xl border border-gray-200 border-l-4 border-l-blue-500 hover:border-blue-300 hover:border-l-blue-600 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out cursor-pointer">

      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col items-start gap-1.5 overflow-hidden">
          <h3 className="font-bold text-gray-800 text-lg sm:text-xl truncate w-full tracking-tight">
            {name}
          </h3>
          <span className="text-[11px] truncate tracking-tight font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
            by {created_by_user_id}
          </span>
        </div>

        <button className="text-gray-400 hover:text-gray-800 transition-colors p-1.5 -mr-2 -mt-1 rounded-full hover:bg-gray-100 shrink-0">
          <BsThreeDotsVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="grow"></div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 gap-3">
        <div className="flex items-center gap-2 text-gray-500 min-w-0">
          <BsPeople className="w-4.5 h-4.5 shrink-0" />

          <span className="font-medium text-sm tracking-tight truncate">
            {member_ids ? member_ids.length : 0}
          </span>
        </div>

        <Link
          to={`/dashboard/classes/${id}`}
          className="shrink-0 group/btn text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
        >
          Enter
        </Link>
      </div>

    </div>
  );
}