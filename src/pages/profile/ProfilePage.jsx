import React, { useState } from 'react'
import { ProfileHeader } from './components/ProfileHeader'
import { ProfileStats } from './components/ProfileStats'
import { ProfileTabs } from './components/ProfileTabs';
import ProfileContentGrid from './components/ProfileContentGrid';
import { ProfileFooterUtility } from './components/ProfileFooterUtility';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('classes');
  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-white text-gray-900 border-x border-gray-200">
      <ProfileHeader />
      <ProfileStats />
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <ProfileContentGrid activeTab={activeTab} />
      <ProfileFooterUtility />
    </div>
  );
}