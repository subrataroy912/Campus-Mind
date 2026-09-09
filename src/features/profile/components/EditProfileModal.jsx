import { Image, UserRound } from "lucide-react";
import { Button } from "../../../components/ui/button.jsx";
import { Input } from "../../../components/ui/input.jsx";
import ValidateField, { MAX_BIO_LENGTH } from "@/utils/ValidateField.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.jsx";
import {
  CoverImageUploader,
  ProfileImageUploader,
} from "./ProfileImageUploader.jsx";
import { useProfileForm } from "../hooks/useProfileForm.js";

function FieldError({ id, message }) {
  return message ? (
    <p id={id} className="mt-1.5 text-sm text-destructive" role="alert">
      {message}
    </p>
  ) : null;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  isSaving,
}) {
  const {
    activeTab,
    setActiveTab,
    formData,
    initialFormData,
    errors,
    handleChange,
    handleBlur,
    handleImageFileChange,
    handleSubmit,
    handleCancel,
  } = useProfileForm({ profile, isOpen, onClose, onSave });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto bg-surface p-0 md:max-w-4xl"
        showCloseButton={false}
      >
        <DialogHeader className="border-b border-border px-4 py-5 sm:px-8">
          <DialogTitle className="text-xl font-semibold text-text-heading">
            Edit profile
          </DialogTitle>
          <DialogDescription className="text-text-muted">
            Keep your learning profile current for classmates and teachers.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 px-4 pb-4 sm:px-8 sm:pb-8"
        >
          <div
            className="flex gap-1 rounded-lg bg-canvas p-1"
            role="tablist"
            aria-label="Edit profile sections"
          >
            {[
              ["profile", UserRound, "Profile"],
              ["images", Image, "Photos"],
            ].map(([tab, Icon, label]) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? "bg-surface text-primary shadow-sm"
                    : "text-text-muted hover:bg-surface/70 hover:text-text-main"
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {activeTab === "profile" && (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Full name
                </label>
                <Input
                  id="profile-name"
                  value={formData.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  onBlur={() => handleBlur("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "profile-name-error" : undefined
                  }
                  placeholder="Enter your full name"
                />
                <FieldError id="profile-name-error" message={errors.name} />
              </div>

              <div>
                <label
                  htmlFor="profile-handle"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted">
                    @
                  </span>
                  <Input
                    id="profile-handle"
                    className="pl-8"
                    value={formData.handle}
                    onChange={(event) =>
                      handleChange("handle", event.target.value)
                    }
                    onBlur={() => handleBlur("handle")}
                    aria-invalid={Boolean(errors.handle)}
                    aria-describedby={
                      errors.handle ? "profile-handle-error" : undefined
                    }
                    placeholder="your_username"
                  />
                </div>
                <FieldError id="profile-handle-error" message={errors.handle} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-first-name"
                    className="mb-1.5 block text-sm font-medium text-text-main"
                  >
                    First name
                  </label>
                  <Input
                    id="profile-first-name"
                    value={formData.firstName}
                    onChange={(event) =>
                      handleChange("firstName", event.target.value)
                    }
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="profile-last-name"
                    className="mb-1.5 block text-sm font-medium text-text-main"
                  >
                    Last name
                  </label>
                  <Input
                    id="profile-last-name"
                    value={formData.lastName}
                    onChange={(event) =>
                      handleChange("lastName", event.target.value)
                    }
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="profile-headline"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Headline
                </label>
                <Input
                  id="profile-headline"
                  value={formData.headline}
                  onChange={(event) =>
                    handleChange("headline", event.target.value)
                  }
                  placeholder="e.g. Computer science student"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="profile-bio"
                    className="text-sm font-medium text-text-main"
                  >
                    Bio
                  </label>
                  <span className="text-xs text-text-muted">
                    {formData.bio.length}/{MAX_BIO_LENGTH}
                  </span>
                </div>
                <textarea
                  id="profile-bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(event) => handleChange("bio", event.target.value)}
                  onBlur={() => handleBlur("bio")}
                  maxLength={MAX_BIO_LENGTH}
                  aria-invalid={Boolean(errors.bio)}
                  aria-describedby={
                    errors.bio ? "profile-bio-error" : undefined
                  }
                  placeholder="Tell the community about yourself"
                  className="flex min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <FieldError id="profile-bio-error" message={errors.bio} />
              </div>

              <div className="border-t border-border pt-5">
                <p className="mb-4 text-sm font-semibold text-text-heading">
                  Academic information
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="profile-city"
                      className="mb-1.5 block text-sm font-medium text-text-main"
                    >
                      City
                    </label>
                    <Input
                      id="profile-city"
                      value={formData.city}
                      onChange={(event) =>
                        handleChange("city", event.target.value)
                      }
                      onBlur={() => handleBlur("city")}
                      aria-invalid={Boolean(errors.city)}
                      placeholder="e.g. Dhaka"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profile-batch-year"
                      className="mb-1.5 block text-sm font-medium text-text-main"
                    >
                      Country
                    </label>
                    <Input
                      id="profile-country"
                      value={formData.country}
                      onChange={(event) =>
                        handleChange("country", event.target.value)
                      }
                      onBlur={() => handleBlur("country")}
                      aria-invalid={Boolean(errors.country)}
                      placeholder="e.g. India"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="profile-batch-year"
                    className="mb-1.5 block text-sm font-medium text-text-main"
                  >
                    Grade or batch
                  </label>
                  <Input
                    id="profile-batch-year"
                    value={formData.batchYear}
                    onChange={(event) =>
                      handleChange("batchYear", event.target.value)
                    }
                    onBlur={() => handleBlur("batchYear")}
                    placeholder="e.g. 2026"
                  />
                  <FieldError
                    id="profile-batch-year-error"
                    message={errors.batchYear}
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="profile-visibility"
                    className="mb-1.5 block text-sm font-medium text-text-main"
                  >
                    Profile visibility
                  </label>
                  <select
                    id="profile-visibility"
                    value={formData.profileVisibility}
                    onChange={(event) =>
                      handleChange("profileVisibility", event.target.value)
                    }
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="COURSE_MEMBERS">Course members</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <div className="space-y-7">
              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-text-heading">
                    Profile picture
                  </h2>
                  <span className="text-xs text-text-muted">
                    JPG or PNG up to 5MB
                  </span>
                </div>
                <ProfileImageUploader
                  currentImage={initialFormData.avatar}
                  onChange={(url, file) => {
                    handleChange("avatar", url);
                    handleImageFileChange("avatar", file);
                  }}
                />
              </section>
              <section className="border-t border-border pt-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-text-heading">
                    Cover photo
                  </h2>
                  <span className="text-xs text-text-muted">
                    JPG or PNG up to 10MB
                  </span>
                </div>
                <CoverImageUploader
                  currentImage={initialFormData.banner}
                  onChange={(url, file) => {
                    handleChange("banner", url);
                    handleImageFileChange("banner", file);
                  }}
                />
              </section>
            </div>
          )}

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
