import React from 'react';

function MaterialItem({
  material = {
    id: "mat-1",
    title: "Lecture 04 - Distributed Consensus & Raft Slides.pdf",
    classroomName: "Distributed Systems & Cloud",
    fileType: "pdf", // "pdf" | "code" | "archive" | "doc"
    fileSize: "4.2 MB",
    uploadedAt: "Yesterday",
    downloadCount: 28,
  },
}) {
  // Format icon & badge color by file extension
  const getFileBadge = (type) => {
    switch (type) {
      case 'pdf':
        return { label: 'PDF', bg: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' };
      case 'code':
        return { label: 'CODE', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
      case 'archive':
        return { label: 'ZIP', bg: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
      default:
        return { label: 'DOC', bg: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' };
    }
  };

  const badge = getFileBadge(material.fileType);

  return (
    <div className="group p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition flex items-center justify-between gap-4">
      {/* File Icon & Identity */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* File Type Pill */}
        <div className={`w-11 h-11 rounded-lg border ${badge.bg} flex flex-col items-center justify-center shrink-0 font-bold text-xs tracking-wider`}>
          {badge.label}
        </div>

        {/* Text Details */}
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition truncate">
            {material.title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span className="text-gray-700 font-medium truncate max-w-37.5 sm:max-w-none">
              {material.classroomName}
            </span>
            <span className="text-gray-300">•</span>
            <span>{material.fileSize}</span>
            <span className="text-gray-300">•</span>
            <span>{material.uploadedAt}</span>
          </div>
        </div>
      </div>

      {/* Download / View Button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => console.log('Downloading file:', material.id)}
          aria-label="Download material"
          className="p-2 text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MaterialItem;