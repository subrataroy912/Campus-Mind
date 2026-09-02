import React from 'react';

function DiscussionRow({
    discussion = {
        id: "disc-1",
        title: "How to handle consensus timeouts in Raft replication?",
        preview:
            "When a follower node misses two consecutive heartbeats, should it trigger an immediate election or wait for the randomized backoff period?",
        classroomName: "Distributed Systems & Cloud",
        classroomId: "cls-1",
        repliesCount: 8,
        upvotes: 14,
        hasAcceptedAnswer: true,
        createdAt: "2h ago",
    },
}) {
    return (
        <div className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left Details */}
            <div className="space-y-1.5 flex-1 min-w-0">
                {/* Class Badge & Status Row */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-100">
                        {discussion.classroomName}
                    </span>

                    {discussion.hasAcceptedAnswer && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                            Solved
                        </span>
                    )}

                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">{discussion.createdAt}</span>
                </div>

                {/* Discussion Title */}
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">
                    {discussion.title}
                </h4>

                {/* Short Preview */}
                <p className="text-xs text-gray-500 line-clamp-1">
                    {discussion.preview}
                </p>
            </div>

            {/* Right Metrics & CTA */}
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                    {/* Upvotes */}
                    <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                        {discussion.upvotes}
                    </span>

                    {/* Reply / Comment Count */}
                    <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {discussion.repliesCount}
                    </span>
                </div>

                {/* View Thread Action */}
                <button
                    onClick={() => console.log("Open discussion:", discussion.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                    View Thread
                </button>
            </div>
        </div>
    );
}

export default DiscussionRow;