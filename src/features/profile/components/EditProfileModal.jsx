import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
import { useProfileForm } from "../hooks/useProfileForm.js";
import ProfileForm from "./form/ProfileForm.jsx";

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  isSaving,
}) {
  const formState = useProfileForm({ profile, isOpen, onClose, onSave });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && formState.handleCancel()}>
      <DialogContent
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto bg-surface p-0 md:max-w-3xl"
        showCloseButton={false}
      >
        <DialogHeader className="border-b border-border px-4 py-5 sm:px-8">
          <DialogTitle className="text-xl font-semibold text-text-heading">
            Edit profile
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            Keep your profile and personal details current.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-4 sm:px-8 sm:pb-8 pt-4">
          <ProfileForm
            profile={profile}
            formState={formState}
            onCancel={formState.handleCancel}
            onSave={onSave}
            isSaving={isSaving}
            showMedia={false}
            submitLabel="Save changes"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
