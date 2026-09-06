import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { Card } from "../../components/ui/card.jsx";
import ProfileHeader from "./components/ProfileHeader.jsx";
import { EditProfileModal } from "./components/EditProfileModal.jsx";
import { Button } from "@/components/ui/button.jsx";
import RenderTabContent from "../../utils/RenderTabContent.jsx";
import { useDashboardData } from "../../features/dashboard/useDashboardData.js";

function getProfile(user) {
  return {
    ...user,
    name: user?.name || "CampusMind member",
    role: user?.role || "student",
  };
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const profile = useMemo(() => getProfile(user), [user]);
  const { classrooms = [] } = useDashboardData();
  const tabsData = [{ label: "Classes" }, { label: "Messages" }];

  const handleSaveProfile = async (formData) => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-1 sm:px-6 lg:py-3 min-h-screen">
      <div className="space-y-6">
        <ProfileHeader profile={profile} onEdit={() => setIsEditing(true)} />

        {/* Main Responsive Grid Container */}
        <div className="">
          {/* Main Content Column */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="flex border-b border-gray-200 px-2 sm:px-4 pt-2">
                {tabsData.map((tab, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setActiveTab(index)}
                    className={`${activeTab === index ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>

              <div className="p-4 sm:p-5">
                <RenderTabContent
                  activeTab={activeTab}
                  classrooms={classrooms}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <EditProfileModal
        key={`${isEditing}-${profile.id || "profile"}`}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        profile={profile}
        onSave={handleSaveProfile}
        isSaving={isSaving}
      />
    </div>
  );
}
