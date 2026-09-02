import React from 'react';
import ClassCard from '../../../components/dashboard/ClassCard';
import DiscussionRow from './DiscussionRow';
import MaterialItem from './MaterialItem';
import { mockClassrooms } from '../../../mock/mockClassrooms';
import { mockDiscussions } from '../../../mock/mockDiscussion';
import { mockMaterial } from '../../../mock/mockMaterial';

function ProfileContentGrid({ activeTab = 'classes' }) {
  const classesData = mockClassrooms || [];
  const discussionsData = mockDiscussions || [];
  const materialsData = mockMaterial || [];

  // 1. Classes Tab View (Grid layout)
  if (activeTab === 'classes') {
    if (classesData.length === 0) {
      return <EmptyState message="No classes found. Join or create one to get started!" />;
    }

    return (
      <div className="p-4 sm:p-6 bg-gray-50/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {classesData.map((classroom) => (
            <ClassCard key={classroom.id} classroom={classroom} />
          ))}
        </div>
      </div>
    );
  }

  // 2. Discussions Tab View (List layout)
  if (activeTab === 'discussions') {
    if (discussionsData.length === 0) {
      return <EmptyState message="No active discussion threads yet." />;
    }

    return (
      <div className="p-4 sm:p-6 bg-gray-50/50 space-y-3">
        {discussionsData.map((discussion) => (
          <DiscussionRow key={discussion.id} discussion={discussion} />
        ))}
      </div>
    );
  }

  // 3. Materials Tab View (Grid or 2-column layout)
  if (activeTab === 'materials') {
    if (materialsData.length === 0) {
      return <EmptyState message="No study resources or notes uploaded yet." />;
    }

    return (
      <div className="p-4 sm:p-6 bg-gray-50/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {materialsData.map((material) => (
            <MaterialItem key={material.id} material={material} />
          ))}
        </div>
      </div>
    );
  }

  // Fallback for unexpected or activity tab
  return <EmptyState message="No recent activity to display." />;
}

// Inline lightweight empty state helper
function EmptyState({ message }) {
  return (
    <div className="py-16 text-center px-4">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-600">{message}</p>
    </div>
  );
}

export default ProfileContentGrid;