import React from 'react';
import Classes from '../../utils/data.js';
import ClassCard from '../../components/dashboard/ClassCard';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';

function DashboardClasses() {
  const navigate = useNavigate();

  const handleRedirect = (classId) => {
    navigate(`/dashboard/classes/${classId}`);
  };
  return (
    <div className="min-h-screen bg-canvas/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6 lg:gap-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-heading tracking-tight">
              All Classes
            </h1>
            <p className="text-sm sm:text-base text-text-muted mt-1">
              View and manage all your active courses.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-text-main px-4 py-2 rounded-lg hover:bg-canvas transition-colors shadow-sm text-sm font-medium w-full sm:w-auto">
            <BookOpen className="w-4 h-4" />
            Browse Catalog
          </button>
        </div>

        {Classes && Classes.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 sm:gap-6">
            {Classes.map((item, index) => (
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
                onOpen={()=>handleRedirect(item.id)}
                onAction={() => { }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface border-2 border-dashed border-border rounded-2xl text-center">
            <div className="bg-canvas p-4 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text-heading mb-1">No classes found</h3>
            <p className="text-text-muted max-w-sm">
              You haven't joined or created any classes yet. Get started by creating a new one!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default DashboardClasses;