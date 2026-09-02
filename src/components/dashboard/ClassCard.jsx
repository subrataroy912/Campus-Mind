import React from 'react';
import { useNavigate } from 'react-router';

function ClassCard({ classroom }) {
  const isCreatedByMe = classroom.role === "Created";
  // TODO: 
  // HAVE TO ADJUST PROPS TO MATCH THE MOCK DATA/REAL ENTITY STRUCTURE.
  const navigate = useNavigate();

  return (
    <div className="group flex flex-col justify-between bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition duration-200 overflow-hidden">
      {/* Card Header & Banner */}
      <div>
        <div
          className={`h-24 w-full bg-linear-to-r ${classroom.theme || 'from-gray-700 to-gray-900'} p-3.5 flex justify-between items-start relative`}
        >
          {/* Role Badge */}
          <span
            className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded shadow-sm ${isCreatedByMe
              ? 'bg-black/40 text-white backdrop-blur-md border border-white/20'
              : 'bg-white/90 text-gray-800'
              }`}
          >
            {classroom.role || 'Member'}
          </span>

          {/* Real-time Online Indicator */}
          {classroom.onlineCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-black/40 text-emerald-300 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {classroom.onlineCount} online
            </span>
          )}
        </div>

        {/* Classroom Info */}
        <div className="p-4 pb-3">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition truncate text-base">
            {classroom.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {classroom.section}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
            <span>By <span className="font-medium text-gray-800">{classroom.instructor.name}</span></span>
            <span>{classroom.memberCount} members</span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-2">
        {/* Unread badge indicator */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {classroom.unreadMessages > 0 ? (
            <span className="text-blue-600 font-semibold">{classroom.unreadMessages} new</span>
          ) : (
            <span>No new msgs</span>
          )}
        </div>

        {/* Enter Room Action */}
        <button
          onClick={() => navigate(`/dashboard/classes/${classroom.id}`)}
          className="px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-95"
        >
          Enter Room
        </button>
      </div>
    </div>
  );
}

export default ClassCard;