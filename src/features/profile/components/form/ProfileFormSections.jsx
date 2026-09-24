import React from "react";
import { Camera, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field.jsx";
import { MAX_BIO_LENGTH } from "../../utils/profileValidation.js";

/**
 * Media section for banner and avatar upload and live preview.
 */
export function ProfileMediaSection({
  avatarPreview,
  bannerPreview,
  onAvatarChange,
  onBannerChange,
  disabled = false,
}) {
  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  const handleBannerFile = (e) => {
    const file = e.target.files?.[0];
    if (file && onBannerChange) {
      onBannerChange(file);
    }
  };

  return (
    <FieldSet className="overflow-hidden rounded-xl border border-border/70 bg-card p-0 shadow-none mb-6">
      {/* Banner Preview Area */}
      <div className="relative w-full aspect-[4/1] max-h-[260px] bg-muted/40 flex items-center justify-center border-b border-border/60 overflow-hidden group">
        {bannerPreview ? (
          <img
            src={bannerPreview}
            alt="Banner preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-muted-foreground gap-1">
            <Upload className="w-6 h-6 stroke-1" />
            <span className="text-xs font-medium">
              Upload banner (recommended 1200x300)
            </span>
          </div>
        )}
        <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/0 group-hover:bg-black/25 transition-colors">
          <span className="bg-background/90 text-foreground px-3 py-1.5 rounded-md text-xs font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" /> Change Banner
          </span>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled}
            onChange={handleBannerFile}
          />
        </label>
      </div>

      {/* Avatar Preview Area */}
      <div className="px-6 flex items-end -mt-10 sm:-mt-14 mb-3 relative z-10">
        <div className="relative group">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-muted border-4 border-background shadow-sm flex items-center justify-center overflow-hidden">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-xs font-medium">
                Avatar
              </span>
            )}
          </div>
          <label className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-full bg-black/0 group-hover:bg-black/30 transition-colors">
            <span className="bg-black/75 text-white px-2.5 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Edit
            </span>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={disabled}
              onChange={handleAvatarFile}
            />
          </label>
        </div>
      </div>

      <div className="px-6 pb-4">
        <p className="text-xs text-muted-foreground">
          PNG, JPG or WebP. Max 2MB recommended.
        </p>
      </div>
    </FieldSet>
  );
}

/**
 * Basic identity fields: First Name, Last Name, and Handle.
 */
export function ProfileIdentitySection({
  formData,
  errors,
  handleChange,
  handleBlur,
  disabled = false,
}) {
  return (
    <FieldSet className="space-y-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
      <FieldLegend className="text-sm font-semibold text-foreground">
        Identity
      </FieldLegend>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Field data-invalid={Boolean(errors.firstName)}>
          <FieldLabel htmlFor="profile-first-name">First name</FieldLabel>
          <Input
            id="profile-first-name"
            value={formData.firstName}
            disabled={disabled}
            onChange={(e) => handleChange("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
            placeholder="e.g. Jane"
            maxLength={100}
          />
          <FieldError id="profile-first-name-error">
            {errors.firstName}
          </FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.lastName)}>
          <FieldLabel htmlFor="profile-last-name">Last name</FieldLabel>
          <Input
            id="profile-last-name"
            value={formData.lastName}
            disabled={disabled}
            onChange={(e) => handleChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            placeholder="e.g. Doe"
            maxLength={100}
          />
          <FieldError id="profile-last-name-error">
            {errors.lastName}
          </FieldError>
        </Field>

        <Field
          data-invalid={Boolean(errors.handle)}
          className="sm:col-span-2 lg:col-span-1"
        >
          <FieldLabel htmlFor="profile-handle">Username / Handle</FieldLabel>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-sm text-muted-foreground select-none">
              @
            </span>
            <Input
              id="profile-handle"
              className="pl-7"
              value={formData.handle}
              disabled={disabled}
              onChange={(e) => {
                const raw = e.target.value.replace(/^@+/, "");
                handleChange("handle", raw);
              }}
              onBlur={() => handleBlur("handle")}
              placeholder="username"
              maxLength={30}
            />
          </div>
          <FieldError id="profile-handle-error">{errors.handle}</FieldError>
        </Field>
      </div>
      <p className="text-xs text-muted-foreground">
        Your handle is unique and used across discussions and spaces. Note:
        handles can only be updated twice within 14 days.
      </p>
    </FieldSet>
  );
}

/**
 * Details fields: Headline and About/Bio.
 */
export function ProfileDetailsSection({
  formData,
  errors,
  handleChange,
  handleBlur,
  disabled = false,
}) {
  const currentBioLength = (formData.bio || "").length;

  return (
    <FieldSet className="space-y-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
      <FieldLegend className="text-sm font-semibold text-foreground">
        About & Bio
      </FieldLegend>

      <Field data-invalid={Boolean(errors.headline)}>
        <FieldLabel htmlFor="profile-headline">Headline</FieldLabel>
        <Input
          id="profile-headline"
          value={formData.headline}
          disabled={disabled}
          onChange={(e) => handleChange("headline", e.target.value)}
          onBlur={() => handleBlur("headline")}
          placeholder="e.g. Computer Science Student | Open Source Contributor"
          maxLength={200}
        />
        <FieldDescription>
          A brief summary shown below your name.
        </FieldDescription>
        <FieldError id="profile-headline-error">{errors.headline}</FieldError>
      </Field>

      <Field data-invalid={Boolean(errors.bio)}>
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
          <span className="text-xs text-muted-foreground">
            {currentBioLength} / {MAX_BIO_LENGTH}
          </span>
        </div>
        <textarea
          id="profile-bio"
          value={formData.bio}
          disabled={disabled}
          onChange={(e) => handleChange("bio", e.target.value)}
          onBlur={() => handleBlur("bio")}
          className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Share your interests, goals, or background..."
          maxLength={MAX_BIO_LENGTH}
        />
        <FieldError id="profile-bio-error">{errors.bio}</FieldError>
      </Field>
    </FieldSet>
  );
}

/**
 * Location and visibility settings.
 */
export function ProfileLocationSection({
  formData,
  errors,
  handleChange,
  handleBlur,
  disabled = false,
}) {
  return (
    <FieldSet className="space-y-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
      <FieldLegend className="text-sm font-semibold text-foreground">
        Location & Visibility
      </FieldLegend>

      <Field data-invalid={Boolean(errors.address)}>
        <FieldLabel htmlFor="profile-address">Address</FieldLabel>
        <Input
          id="profile-address"
          value={formData.address}
          disabled={disabled}
          onChange={(e) => handleChange("address", e.target.value)}
          onBlur={() => handleBlur("address")}
          placeholder="Street or neighborhood"
          maxLength={250}
        />
        <FieldError id="profile-address-error">{errors.address}</FieldError>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={Boolean(errors.city)}>
          <FieldLabel htmlFor="profile-city">City</FieldLabel>
          <Input
            id="profile-city"
            value={formData.city}
            disabled={disabled}
            onChange={(e) => handleChange("city", e.target.value)}
            onBlur={() => handleBlur("city")}
            placeholder="e.g. Siliguri"
            maxLength={100}
          />
          <FieldError id="profile-city-error">{errors.city}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.country)}>
          <FieldLabel htmlFor="profile-country">Country</FieldLabel>
          <Input
            id="profile-country"
            value={formData.country}
            disabled={disabled}
            onChange={(e) => handleChange("country", e.target.value)}
            onBlur={() => handleBlur("country")}
            placeholder="e.g. India"
            maxLength={100}
          />
          <FieldError id="profile-country-error">{errors.country}</FieldError>
        </Field>
      </div>

      <Field data-invalid={Boolean(errors.profileVisibility)}>
        <FieldLabel htmlFor="profile-visibility">Profile visibility</FieldLabel>
        <select
          id="profile-visibility"
          value={formData.profileVisibility}
          disabled={disabled}
          onChange={(e) => handleChange("profileVisibility", e.target.value)}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="PUBLIC" className="bg-background text-foreground">
            Public - Anyone can view your profile
          </option>
          <option value="PRIVATE" className="bg-background text-foreground">
            Private - Only you can view full details
          </option>
        </select>
        <FieldError id="profile-visibility-error">
          {errors.profileVisibility}
        </FieldError>
      </Field>
    </FieldSet>
  );
}

/**
 * Personal info: Phone, Gender, Date of Birth.
 */
export function ProfilePersonalSection({
  formData,
  errors,
  handleChange,
  handleBlur,
  disabled = false,
}) {
  return (
    <FieldSet className="space-y-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
      <FieldLegend className="text-sm font-semibold text-foreground">
        Personal Information
      </FieldLegend>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field data-invalid={Boolean(errors.phone)}>
          <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
          <Input
            id="profile-phone"
            type="tel"
            value={formData.phone}
            disabled={disabled}
            onChange={(e) => handleChange("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            placeholder="+1 555 000 0000"
            maxLength={20}
          />
          <FieldError id="profile-phone-error">{errors.phone}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.gender)}>
          <FieldLabel htmlFor="profile-gender">Gender</FieldLabel>
          <select
            id="profile-gender"
            value={formData.gender}
            disabled={disabled}
            onChange={(e) => handleChange("gender", e.target.value)}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" className="bg-background text-foreground">
              Select gender
            </option>
            <option value="Male" className="bg-background text-foreground">
              Male
            </option>
            <option value="Female" className="bg-background text-foreground">
              Female
            </option>
            <option value="Other" className="bg-background text-foreground">
              Other
            </option>
            <option
              value="Prefer not to say"
              className="bg-background text-foreground"
            >
              Prefer not to say
            </option>
          </select>
          <FieldError id="profile-gender-error">{errors.gender}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.dateOfBirth)}>
          <FieldLabel htmlFor="profile-dob">Date of birth</FieldLabel>
          <Input
            id="profile-dob"
            type="date"
            value={formData.dateOfBirth}
            disabled={disabled}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            onBlur={() => handleBlur("dateOfBirth")}
          />
          <FieldError id="profile-dob-error">{errors.dateOfBirth}</FieldError>
        </Field>
      </div>
    </FieldSet>
  );
}

/**
 * Dynamic links section supporting up to 5 custom links.
 */
export function ProfileLinksSection({
  formData,
  handleChange,
  disabled = false,
}) {
  const links = Array.isArray(formData.links) ? formData.links : [];

  const handleAddLink = () => {
    if (links.length < 5) {
      handleChange("links", [...links, { name: "", url: "" }]);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const nextLinks = [...links];
    nextLinks[index] = { ...nextLinks[index], [field]: value };
    handleChange("links", nextLinks);
  };

  const handleRemoveLink = (index) => {
    handleChange(
      "links",
      links.filter((_, i) => i !== index),
    );
  };

  return (
    <FieldSet className="space-y-4 rounded-xl border border-border/70 bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <FieldLegend className="text-sm font-semibold text-foreground">
            Social & Web Links
          </FieldLegend>
          <FieldDescription>
            Share links to your website, GitHub, LinkedIn, or portfolio (up to
            5).
          </FieldDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddLink}
          disabled={disabled || links.length >= 5}
          className="gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Add link
        </Button>
      </div>

      {links.length === 0 ? (
        <p className="py-2 text-xs italic text-muted-foreground">
          No links added yet. Click &quot;Add link&quot; to share your web
          presence.
        </p>
      ) : (
        <div className="space-y-3 pt-1">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
            >
              <Input
                placeholder="Label (e.g. GitHub)"
                value={link?.name || ""}
                disabled={disabled}
                onChange={(e) =>
                  handleLinkChange(index, "name", e.target.value)
                }
                className="w-full sm:w-1/3 text-sm"
                maxLength={50}
              />
              <Input
                placeholder="https://..."
                value={link?.url || ""}
                disabled={disabled}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                className="w-full sm:flex-1 text-sm"
                maxLength={2048}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive self-end sm:self-center"
                disabled={disabled}
                onClick={() => handleRemoveLink(index)}
                aria-label={`Remove link ${index + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </FieldSet>
  );
}
