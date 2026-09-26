import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useBlocker, useBeforeUnload } from "react-router";
import { toast } from "@/components/ui/toast.jsx";
import { routes } from "@/routes/paths.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { useGetCurrentProfileQuery } from "../api/profileApi.js";
import ProfileForm from "../components/form/ProfileForm.jsx";
import { OnboardingDiscardDialog } from "../components/OnboardingDiscardDialog.jsx";

export default function CreateProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, updateHandle, completeOnboarding, cancelOnboarding, logout } = useAuth();
  const { data: profileResponse } = useGetCurrentProfileQuery();
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);

  const activeProfile = profileResponse?.data ?? profileResponse ?? user;

  // Intercept client-side SPA navigations (such as browser Back button)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !isSaving &&
      !isDiscarding &&
      user?.profileCompleted !== true &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setIsDiscardDialogOpen(true);
    }
  }, [blocker.state]);

  // Tab close or reload warning
  const beforeUnloadHandler = useCallback(
    (e) => {
      if (!isSaving && !isDiscarding && user?.profileCompleted !== true) {
        e.preventDefault();
        return (e.returnValue = "Leaving now will cancel your registration.");
      }
    },
    [isSaving, isDiscarding, user?.profileCompleted],
  );
  useBeforeUnload(beforeUnloadHandler);

  const handleSave = async (profileData) => {
    setIsSaving(true);
    try {
      if (completeOnboarding) {
        await completeOnboarding(profileData);
      } else {
        const { handle, ...profilePatch } = profileData || {};
        await updateProfile(profilePatch);
        if (handle) {
          await updateHandle({ handle });
        }
      }
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
      navigate(routes.dashboard, { replace: true });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsDiscardDialogOpen(true);
  };

  const handleConfirmDiscard = async () => {
    setIsDiscarding(true);
    try {
      if (cancelOnboarding) {
        await cancelOnboarding();
      } else if (logout) {
        await logout();
      }
      toast.add({
        title: "Registration cancelled",
        description: "Your registration was cancelled.",
        type: "info",
      });
      if (blocker.state === "blocked") {
        blocker.proceed();
      } else {
        navigate(routes.home, { replace: true });
      }
    } catch {
      navigate(routes.home, { replace: true });
    } finally {
      setIsDiscarding(false);
      setIsDiscardDialogOpen(false);
    }
  };

  const handleCancelDiscard = () => {
    setIsDiscardDialogOpen(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  return (
    <div className="min-h-dvh bg-background py-8 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
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
          onCancel={handleCancelClick}
          isSaving={isSaving}
          submitLabel="Save Profile"
          isInitialSetup={true}
        />

        <OnboardingDiscardDialog
          open={isDiscardDialogOpen}
          onOpenChange={(open) => {
            if (!open) handleCancelDiscard();
          }}
          onConfirm={handleConfirmDiscard}
          onCancel={handleCancelDiscard}
          isDiscarding={isDiscarding}
        />
      </div>
    </div>
  );
}
