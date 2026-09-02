export function ProfileStats({
    stats = {
        createdCount: 5,
        enrolledCount: 8,
        discussionsCount: 21,
        isOnline: true,
        department: "Computer Science",
        batchYear: "2026",
        joinedDate: "Aug 2023",
    },
}) {
    return (
        <div className="px-4 sm:px-6 py-3.5 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            {/* Metrics Row / Pills */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs sm:text-sm">
                <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-700 whitespace-nowrap transition">
                    <span className="font-semibold text-gray-900">{stats.createdCount}</span>
                    <span className="text-gray-500">Classes Created</span>
                </button>

                <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-700 whitespace-nowrap transition">
                    <span className="font-semibold text-gray-900">{stats.enrolledCount}</span>
                    <span className="text-gray-500">Classes Joined</span>
                </button>

                <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-700 whitespace-nowrap transition">
                    <span className="font-semibold text-gray-900">{stats.discussionsCount}</span>
                    <span className="text-gray-500">Discussions</span>
                </button>
            </div>

            {/* Metadata & Presence Info */}
            <div className="flex overflow-auto scrollbar-none items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                {/* Presence Badge */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <span className="relative flex h-2 w-2">
                        {stats.isOnline && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${stats.isOnline ? "bg-emerald-500" : "bg-gray-300"
                                }`}
                        ></span>
                    </span>
                    <span className={stats.isOnline ? "font-medium text-emerald-700" : "text-gray-400"}>
                        {stats.isOnline ? "Online" : "Offline"}
                    </span>
                </div>

                {/* Major / Department */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <span className="text-gray-700 font-medium truncate max-w-35 sm:max-w-none">
                        {stats.department}
                    </span>
                    <span className="text-gray-400">('{stats.batchYear})</span>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Joined {stats.joinedDate}</span>
                </div>
            </div>
        </div>
    );
}