import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "@/components/ui/toast.jsx";
import { routes } from "@/routes/paths.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useGetCurrentProfileQuery } from "../api/profileApi.js";
import ProfileForm from "../components/form/ProfileForm.jsx";

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { data: profileResponse } = useGetCurrentProfileQuery();
  const [isSaving, setIsSaving] = useState(false);

  const activeProfile = profileResponse?.data ?? profileResponse ?? user;

  const handleSave = async (profileData) => {
    setIsSaving(true);
    try {
      await updateProfile(profileData);
      const uid = activeProfile?.id || activeProfile?._id || user?.id;
      sessionStorage.setItem("show_welcome_after_profile_create", "true");
      if (uid) {
        sessionStorage.setItem(`just_created_profile_${uid}`, "true");
      }
      toast.add({
        title: "Profile created",
        description: "Your profile has been saved successfully.",
        type: "success",
      });
      navigate(routes.dashboard);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    setIsSaving(true);
    try {
      await updateProfile({});
    } catch {
      // Best-effort profile initialization on skip
    } finally {
      setIsSaving(false);
      navigate(routes.dashboard);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create Your Profile
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Set up your public presence, details, and avatar to get started.
          </p>
        </div>

        <ProfileForm
          profile={activeProfile}
          showMedia={true}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isSaving}
          submitLabel="Save Profile"
        />
      </div>
    </div>
  );
}
