import React from "react";
import { Button } from "@/components/ui/button.jsx";
import { useProfileForm } from "../../hooks/useProfileForm.js";
import {
  ProfileDetailsSection,
  ProfileIdentitySection,
  ProfileLinksSection,
  ProfileLocationSection,
  ProfileMediaSection,
  ProfilePersonalSection,
} from "./ProfileFormSections.jsx";

export {
  ProfileDetailsSection,
  ProfileIdentitySection,
  ProfileLinksSection,
  ProfileLocationSection,
  ProfileMediaSection,
  ProfilePersonalSection,
};

export default function ProfileForm({
  profile,
  onSave,
  onCancel,
  isSaving = false,
  showMedia = false,
  submitLabel = "Save changes",
  showCancel = true,
  className = "",
  isInitialSetup = false,
  onChangeHandleClick,
  // Optional controlled overrides if caller wants custom state
  formState,
}) {
  const defaultFormState = useProfileForm({
    profile,
    isOpen: true,
    onClose: onCancel,
    onSave,
    isInitialSetup,
  });

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleCancel,
    avatarPreview,
    bannerPreview,
    handleAvatarChange,
    handleBannerChange,
  } = formState || defaultFormState;

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {errors.general && (
        <div
          className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"
          role="alert"
        >
          {errors.general}
        </div>
      )}

      {showMedia && (
        <ProfileMediaSection
          avatarPreview={avatarPreview}
          bannerPreview={bannerPreview}
          onAvatarChange={handleAvatarChange}
          onBannerChange={handleBannerChange}
          disabled={isSaving}
        />
      )}

      <ProfileIdentitySection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabled={isSaving}
        isInitialSetup={isInitialSetup}
        onChangeHandleClick={onChangeHandleClick}
      />

      <ProfileDetailsSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabled={isSaving}
      />

      <ProfileLocationSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabled={isSaving}
      />

      <ProfilePersonalSection
        formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleBlur={handleBlur}
        disabled={isSaving}
      />

      <ProfileLinksSection
        formData={formData}
        handleChange={handleChange}
        disabled={isSaving}
      />

      {/* Form Action Buttons */}
      <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
        {showCancel && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
