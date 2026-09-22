import { useEffect, useState } from "react";
import {
  Camera,
  ImagePlus,
  Loader2,
  X,
  KeyRound,
  Globe,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { useUpdateClassroomMutation } from "../api/classroomApi.js";
import {
  requestCourseCoverUpload,
  requestCourseLogoUpload,
} from "../api/classroomService.js";
import { SUBJECTS, THEME_COLORS } from "../model/createSpaceForm.js";
import { getClassTheme } from "../utils/classTheme.js";
import { optimizeImage } from "@/utils/optimizeImage.js";
import { initials } from "@/utils/initials.js";
import { cn } from "@/lib/utils.js";
import { parseApiError } from "@/lib/errorUtils.js";

const ACCESS_OPTIONS = [
  {
    id: "CODE",
    title: "Class Code",
    description: "Protected by an 8-character code",
    icon: KeyRound,
  },
  {
    id: "OPEN",
    title: "Public / Open",
    description: "Anyone can view and join directly",
    icon: Globe,
  },
  {
    id: "INVITE",
    title: "Invite Only",
    description: "Only members you add can join",
    icon: Lock,
  },
];

export function EditSpaceModal({ isOpen, onClose, classroom }) {
  const [title, setTitle] = useState(
    () => classroom?.title || classroom?.name || "",
  );
  const [subject, setSubject] = useState(() => classroom?.subject || "");
  const [customSubject, setCustomSubject] = useState("");
  const [section, setSection] = useState(
    () => classroom?.section || classroom?.subtitle || "",
  );
  const [description, setDescription] = useState(
    () => classroom?.description || "",
  );
  const [accessType, setAccessType] = useState(() =>
    (classroom?.accessType || "CODE").toUpperCase(),
  );
  const [theme, setTheme] = useState(() => classroom?.theme || "indigo");

  // Media state
  const [coverPreview, setCoverPreview] = useState(
    () => classroom?.coverUrl || classroom?.cover || null,
  );
  const [coverFile, setCoverFile] = useState(null);
  const [coverRemoved, setCoverRemoved] = useState(false);

  const [logoPreview, setLogoPreview] = useState(
    () => classroom?.logoUrl || classroom?.logo || null,
  );
  const [logoFile, setLogoFile] = useState(null);
  const [logoRemoved, setLogoRemoved] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const [updateClassroom, { isLoading: isUpdating }] =
    useUpdateClassroomMutation();
  const isSaving = isUpdating || isUploadingMedia;

  // Sync state when classroom or open state changes
  useEffect(() => {
    if (isOpen && classroom) {
      setTitle(classroom.title || classroom.name || "");
      const existingSubject = classroom.subject || "";
      if (SUBJECTS.includes(existingSubject)) {
        setSubject(existingSubject);
        setCustomSubject("");
      } else if (existingSubject) {
        setSubject("Other");
        setCustomSubject(existingSubject);
      } else {
        setSubject("");
        setCustomSubject("");
      }
      setSection(classroom.section || classroom.subtitle || "");
      setDescription(classroom.description || "");
      setAccessType((classroom.accessType || "CODE").toUpperCase());
      setTheme(classroom.theme || "indigo");
      setCoverPreview(classroom.coverUrl || classroom.cover || null);
      setCoverFile(null);
      setCoverRemoved(false);
      setLogoPreview(classroom.logoUrl || classroom.logo || null);
      setLogoFile(null);
      setLogoRemoved(false);
      setErrorMsg("");
    }
  }, [isOpen, classroom]);

  const handleCoverSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const optimized = await optimizeImage(file, 1600);
    setCoverFile(optimized);
    setCoverRemoved(false);
    setCoverPreview(URL.createObjectURL(optimized));
  };

  const handleRemoveCover = () => {
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverRemoved(true);
    setCoverPreview(null);
  };

  const handleLogoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const optimized = await optimizeImage(file, 600);
    setLogoFile(optimized);
    setLogoRemoved(false);
    setLogoPreview(URL.createObjectURL(optimized));
  };

  const handleRemoveLogo = () => {
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoRemoved(true);
    setLogoPreview(null);
  };

  const currentTheme = getClassTheme({ theme });
  const logoInitials = title?.trim() ? initials(title) : "SP";
  const isCustomSubject = subject === "Other";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Space name is required");
      return;
    }

    const effectiveSubject = isCustomSubject
      ? customSubject?.trim()
      : subject?.trim();

    setErrorMsg("");
    setIsUploadingMedia(true);

    try {
      let coverUrl = classroom?.coverUrl || classroom?.cover || null;
      let logoUrl = classroom?.logoUrl || classroom?.logo || null;

      // Handle cover file upload
      if (coverFile) {
        const upload = await requestCourseCoverUpload();
        const body = new FormData();
        body.append("file", coverFile);
        body.append("api_key", upload.uploadApiKey);
        body.append("timestamp", String(upload.uploadTimestamp));
        body.append("signature", upload.uploadSignature);
        body.append("public_id", upload.publicId);
        const res = await fetch(upload.uploadUrl, { method: "POST", body });
        if (!res.ok) throw new Error("Failed to upload space banner");
        coverUrl = (await res.json()).secure_url;
      } else if (coverRemoved) {
        coverUrl = "";
      }

      // Handle logo file upload
      if (logoFile) {
        const upload = await requestCourseLogoUpload();
        const body = new FormData();
        body.append("file", logoFile);
        body.append("api_key", upload.uploadApiKey);
        body.append("timestamp", String(upload.uploadTimestamp));
        body.append("signature", upload.uploadSignature);
        body.append("public_id", upload.publicId);
        const res = await fetch(upload.uploadUrl, { method: "POST", body });
        if (!res.ok) throw new Error("Failed to upload space logo");
        logoUrl = (await res.json()).secure_url;
      } else if (logoRemoved) {
        logoUrl = "";
      }

      await updateClassroom({
        courseId: classroom.id,
        changes: {
          title: title.trim(),
          spaceType: classroom?.spaceType || "ACADEMIC_CLASS",
          subject: effectiveSubject || undefined,
          section: section.trim() || undefined,
          description: description.trim() || undefined,
          meetingType: classroom?.meetingType || "IN_PERSON",
          location: classroom?.location || undefined,
          tags: classroom?.tags || [],
          accessType,
          visibility: accessType === "OPEN" ? "PUBLIC" : "PRIVATE",
          theme,
          coverUrl: coverUrl !== undefined ? coverUrl : undefined,
          logoUrl: logoUrl !== undefined ? logoUrl : undefined,
        },
      }).unwrap();

      onClose();
    } catch (err) {
      setErrorMsg(
        parseApiError(err, "Failed to update space details.").message
      );
    } finally {
      setIsUploadingMedia(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Fixed Header */}
        <DialogHeader className="px-5 py-3.5 border-b border-border shrink-0">
          <DialogTitle className="text-base font-bold text-text-heading">
            Edit Space Details & Branding
          </DialogTitle>
          <DialogDescription className="text-xs text-text-muted">
            Update your space name, visual branding, domain, and access
            settings.
          </DialogDescription>
        </DialogHeader>

        {errorMsg && (
          <div className="mx-5 mt-3 rounded-lg bg-destructive/10 p-2.5 text-xs font-medium text-destructive shrink-0">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Visual Branding Card (Banner + Logo Preview) */}
            <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-2xs">
              {/* Banner Preview */}
              <div
                className={cn(
                  "group relative flex h-28 sm:h-36 w-full items-center justify-center overflow-hidden transition-all",
                  coverPreview ? "bg-canvas" : currentTheme.gradientClass,
                )}
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    decoding="async"
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <span className="px-4 text-center text-sm font-bold tracking-tight text-white/90 drop-shadow-xs">
                    {title?.trim() || "Space Banner"}
                  </span>
                )}

                {/* Upload/Change Banner Button */}
                <label
                  className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1.5 bg-black/0 text-xs font-medium text-transparent opacity-0 transition-all group-hover:bg-black/45 group-hover:text-white group-hover:opacity-100"
                  title="Change banner (Recommended: 1920 × 480px, 4:1 ratio · Keep important text centered)"
                >
                  <ImagePlus className="h-4 w-4" />
                  <span>
                    {coverPreview ? "Change banner image" : "Upload banner"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverSelect}
                    className="sr-only"
                  />
                </label>

                {/* Remove Banner */}
                {coverPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100 cursor-pointer"
                    title="Remove banner image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Size Badge */}
                <div className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs pointer-events-none">
                  Banner: 1920 × 480px (4:1) · Safe area centered
                </div>
              </div>

              {/* Identity Row (Logo + Theme Swatches) */}
              <div className="relative px-4 pb-3 pt-2">
                {/* Logo */}
                <div className="absolute -top-7 sm:-top-8 left-4">
                  <label
                    className="group/logo relative block h-14 w-14 sm:h-16 sm:w-16 cursor-pointer overflow-hidden rounded-2xl border-2 sm:border-[3px] border-surface bg-surface shadow-xs ring-1 ring-border"
                    title="Upload space logo (Recommended: 400 × 400px, 1:1 square · Max 2MB)"
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-primary/10 text-sm sm:text-base font-bold text-primary select-none">
                        {logoInitials}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover/logo:bg-black/45 group-hover/logo:opacity-100">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoSelect}
                      className="sr-only"
                    />
                  </label>

                  {/* Remove Logo */}
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90 cursor-pointer shadow-xs"
                      title="Remove logo"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>

                {/* Logo guidance and size label */}
                <div className="pl-18 sm:pl-20 min-h-10 flex flex-col justify-center">
                  <span className="text-xs font-semibold text-text-heading">
                    Space Logo & Theme
                  </span>
                  <span className="text-[11px] text-text-muted">
                    Logo: 400 × 400px (1:1 square) · Max 2MB
                  </span>
                </div>

                {/* Theme color swatches */}
                <div className="flex items-center gap-2 pt-2 mt-2 border-t border-border/40">
                  <span className="text-[11px] font-medium text-text-muted">
                    Theme color:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {THEME_COLORS.map((c) => {
                      const isSelected = theme === c.value || theme === c.id;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setTheme(c.value)}
                          className={cn(
                            "h-4 w-4 rounded-full transition-transform hover:scale-110 cursor-pointer",
                            c.swatchClass,
                            isSelected
                              ? "ring-2 ring-primary ring-offset-1 ring-offset-surface scale-110"
                              : "ring-1 ring-border/80 opacity-80 hover:opacity-100",
                          )}
                          style={
                            c.colorHex
                              ? { backgroundColor: c.colorHex }
                              : undefined
                          }
                          title={`${c.name} theme`}
                          aria-label={`Select ${c.name} theme`}
                          aria-pressed={isSelected}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Space Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">
                Space Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                placeholder="e.g. CS101 or AI Research Lab"
                required
              />
            </div>

            {/* Subject & Section in a responsive 2-column row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Subject / Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">
                  Subject / Category
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                >
                  <option value="">Select subject or domain</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {isCustomSubject && (
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Enter custom subject..."
                    className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden mt-1"
                  />
                )}
              </div>

              {/* Section / Cohort */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-heading">
                  Section / Cohort
                </label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden"
                  placeholder="e.g. Batch 2026, Section A"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-heading">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-hidden resize-none"
                placeholder="What this space is about, topics covered, and guidelines..."
              />
            </div>

            {/* Access & Privacy Options */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-heading">
                Access & Privacy
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ACCESS_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = accessType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAccessType(opt.id)}
                      className={cn(
                        "flex flex-col items-start rounded-xl border p-2 text-left transition-all cursor-pointer",
                        isSelected
                          ? "border-primary bg-primary/8 ring-1 ring-primary shadow-2xs"
                          : "border-border bg-canvas/40 hover:border-border/80 hover:bg-canvas",
                      )}
                    >
                      <div className="flex w-full items-center justify-between mb-1">
                        <div
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-md",
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          <Icon className="h-3 w-3" />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-text-heading">
                        {opt.title}
                      </span>
                      <span className="text-[10px] leading-tight text-text-muted mt-0.5 line-clamp-1">
                        {opt.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed Sticky Footer - Always Visible */}
          <div className="shrink-0 px-5 py-3 border-t border-border bg-surface flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
              className="h-8 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="h-8 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Saving changes…</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
