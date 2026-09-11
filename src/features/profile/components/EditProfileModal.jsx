import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { MAX_BIO_LENGTH } from "@/utils/ValidateField.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.jsx";
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
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleCancel,
  } = useProfileForm({ profile, isOpen, onClose, onSave });

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
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

        <form
          onSubmit={handleSubmit}
          className="space-y-6 px-4 pb-4 sm:px-8 sm:pb-8"
        >
          {errors.general && (
            <div
              className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive"
              role="alert"
            >
              {errors.general}
            </div>
          )}

          {/* Basic Identity: First name & Last name */}
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
                onBlur={() => handleBlur("firstName")}
                placeholder="First name"
              />
              <FieldError id="profile-first-name-error" message={errors.firstName} />
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
                onBlur={() => handleBlur("lastName")}
                placeholder="Last name"
              />
              <FieldError id="profile-last-name-error" message={errors.lastName} />
            </div>
          </div>

          {/* Username / Handle */}
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
                className={`pl-8 ${errors.handle ? "border-destructive focus-visible:ring-destructive" : ""}`}
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
            <p className="mt-1.5 text-xs text-text-muted">
              Your handle is unique and helps people find you. You can change it at most twice within a 14-day period.
            </p>
            <FieldError id="profile-handle-error" message={errors.handle} />
          </div>

          {/* Headline */}
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
              onBlur={() => handleBlur("headline")}
              placeholder="e.g. Computer Science Student | Open Source Enthusiast"
            />
          </div>

          {/* Bio */}
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
              rows={3}
              value={formData.bio}
              onChange={(event) => handleChange("bio", event.target.value)}
              onBlur={() => handleBlur("bio")}
              maxLength={MAX_BIO_LENGTH}
              aria-invalid={Boolean(errors.bio)}
              aria-describedby={
                errors.bio ? "profile-bio-error" : undefined
              }
              placeholder="Tell the community about yourself"
              className="flex min-h-20 w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <FieldError id="profile-bio-error" message={errors.bio} />
          </div>

          {/* Personal Information Section */}
          <div className="border-t border-border pt-5">
            <p className="mb-4 text-sm font-semibold text-text-heading">
              Personal information
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="profile-phone"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Phone number
                </label>
                <Input
                  id="profile-phone"
                  value={formData.phone}
                  onChange={(event) =>
                    handleChange("phone", event.target.value)
                  }
                  onBlur={() => handleBlur("phone")}
                  placeholder="e.g. +91 9876543210"
                />
                <FieldError id="profile-phone-error" message={errors.phone} />
              </div>
              <div>
                <label
                  htmlFor="profile-gender"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Gender
                </label>
                <select
                  id="profile-gender"
                  value={formData.gender}
                  onChange={(event) =>
                    handleChange("gender", event.target.value)
                  }
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="profile-dob"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Date of birth
                </label>
                <Input
                  id="profile-dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(event) =>
                    handleChange("dateOfBirth", event.target.value)
                  }
                  onBlur={() => handleBlur("dateOfBirth")}
                />
              </div>
              <div>
                <label
                  htmlFor="profile-address"
                  className="mb-1.5 block text-sm font-medium text-text-main"
                >
                  Address
                </label>
                <Input
                  id="profile-address"
                  value={formData.address}
                  onChange={(event) =>
                    handleChange("address", event.target.value)
                  }
                  onBlur={() => handleBlur("address")}
                  placeholder="Street address"
                />
                <FieldError id="profile-address-error" message={errors.address} />
              </div>
            </div>
          </div>

          {/* Location & Visibility Section */}
          <div className="border-t border-border pt-5">
            <p className="mb-4 text-sm font-semibold text-text-heading">
              Location & Visibility
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
                  placeholder="e.g. Siliguri"
                />
              </div>
              <div>
                <label
                  htmlFor="profile-country"
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
                  placeholder="e.g. India"
                />
              </div>
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
                <option value="PUBLIC">Public — Anyone can find and view your profile</option>
                <option value="PRIVATE">Private — Only members in shared classes can see you</option>
              </select>
            </div>
          </div>

          {/* Social & Web Links */}
          <div className="border-t border-border pt-5">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-text-heading">
                  Social & Web Links
                </p>
                <p className="text-xs text-text-muted">
                  Add links to your portfolio, GitHub, LinkedIn, or personal website with custom names.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = Array.isArray(formData.links) ? formData.links : [];
                  if (current.length < 5) {
                    handleChange("links", [...current, { name: "", url: "" }]);
                  }
                }}
                disabled={(formData.links || []).length >= 5}
                className="gap-1.5"
              >
                <Plus size={14} /> Add link
              </Button>
            </div>

            {(!formData.links || formData.links.length === 0) ? (
              <p className="py-2 text-xs italic text-text-muted">
                No links added yet. Click &quot;Add link&quot; to share your profiles.
              </p>
            ) : (
              <div className="space-y-3 mt-3">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Input
                      placeholder="Label (e.g. GitHub)"
                      value={link?.name || ""}
                      onChange={(e) => {
                        const updated = [...formData.links];
                        updated[index] = { ...updated[index], name: e.target.value };
                        handleChange("links", updated);
                      }}
                      className="w-full sm:w-1/3 text-sm"
                    />
                    <Input
                      placeholder="https://..."
                      value={link?.url || ""}
                      onChange={(e) => {
                        const updated = [...formData.links];
                        updated[index] = { ...updated[index], url: e.target.value };
                        handleChange("links", updated);
                      }}
                      className="w-full sm:flex-1 text-sm"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-text-muted hover:text-destructive self-end sm:self-center"
                      onClick={() => {
                        const updated = formData.links.filter((_, i) => i !== index);
                        handleChange("links", updated);
                      }}
                      aria-label={`Remove link ${index + 1}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
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
