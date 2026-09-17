import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";
import {
  createClassroom,
  uploadSpaceMedia,
} from "../api/classroomService.js";
import { INITIAL_SPACE_FORM } from "../model/createSpaceForm.js";
import { optimizeImage } from "@/utils/optimizeImage.js";
import { routes } from "@/routes/paths.js";

export function useCreateSpaceForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [form, setForm] = useState(INITIAL_SPACE_FORM);
  const [preview, setPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const update = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Sync className and title for seamless compatibility
      if (field === "className") next.title = value;
      if (field === "title") next.className = value;
      // Auto-sync visibility when accessType changes
      if (field === "accessType") {
        next.visibility = value === "OPEN" ? "PUBLIC" : "PRIVATE";
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addTag = (tag) => {
    if (!tag) return;
    const clean = tag.trim().replace(/^#/, "").toLowerCase();
    if (!clean) return;
    setForm((prev) => {
      const existing = prev.tags || [];
      if (existing.includes(clean)) return prev;
      return { ...prev, tags: [...existing, clean] };
    });
  };

  const removeTag = (tagToRemove) => {
    setForm((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tagToRemove),
    }));
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: (prev.days || []).includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...(prev.days || []), day],
    }));
  };

  const handleImageUpload = async (eventOrFile) => {
    const file = eventOrFile?.target
      ? eventOrFile.target.files?.[0]
      : eventOrFile;
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const optimizedFile = await optimizeImage(file, 1600);
      update("coverImage", optimizedFile);
      setPreview(URL.createObjectURL(optimizedFile));
    } catch {
      update("coverImage", file);
      setPreview(URL.createObjectURL(file));
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleLogoUpload = async (eventOrFile) => {
    const file = eventOrFile?.target
      ? eventOrFile.target.files?.[0]
      : eventOrFile;
    if (!file) return;
    setIsUploadingLogo(true);
    try {
      const optimizedFile = await optimizeImage(file, 600);
      update("logoImage", optimizedFile);
      setLogoPreview(URL.createObjectURL(optimizedFile));
    } catch {
      update("logoImage", file);
      setLogoPreview(URL.createObjectURL(file));
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const removeCover = () => {
    update("coverImage", null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const removeLogo = () => {
    update("logoImage", null);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
  };

  const validate = () => {
    const nextErrors = {};
    const titleVal = (form.title || form.className || "").trim();

    if (!titleVal) {
      nextErrors.className = "Space name is required.";
      nextErrors.title = "Space name is required.";
    } else if (titleVal.length > 120) {
      nextErrors.className = "Space name cannot exceed 120 characters.";
    }

    if (!form.subject?.trim()) {
      nextErrors.subject = "Subject or domain category is required.";
    } else if (form.subject === "Other" && !form.customSubject?.trim()) {
      nextErrors.customSubject = "Please specify your custom subject.";
    }

    if (form.section && form.section.length > 80) {
      nextErrors.section = "Section cannot exceed 80 characters.";
    }

    if (form.description && form.description.length > 2000) {
      nextErrors.description = "Description cannot exceed 2000 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const reset = () => {
    setForm(INITIAL_SPACE_FORM);
    setPreview(null);
    setLogoPreview(null);
    setErrors({});
    setSubmitted(false);
    setSubmissionError("");
  };

  const submit = async (event) => {
    if (event) event.preventDefault();
    if (!validate()) {
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      let coverUrl = null;
      let logoUrl = null;

      // Upload banner & logo if user selected images
      if (form.coverImage) {
        coverUrl = await uploadSpaceMedia(form.coverImage, "cover");
      }
      if (form.logoImage) {
        logoUrl = await uploadSpaceMedia(form.logoImage, "logo");
      }

      const effectiveSubject =
        form.subject === "Other"
          ? form.customSubject?.trim()
          : form.subject?.trim();

      const finalTitle = (form.title || form.className || "").trim();

      // Single atomic course creation with all backend DTO fields
      const classroom = await createClassroom(user?.id, {
        title: finalTitle,
        className: finalTitle,
        spaceType: form.spaceType || "ACADEMIC_CLASS",
        section: form.section?.trim() || "",
        subject: effectiveSubject || "",
        description: form.description?.trim() || "",
        meetingType: form.meetingType || "IN_PERSON",
        location: (form.location || form.room || "").trim(),
        tags: form.tags || [],
        links: form.links || [],
        accessType: form.accessType || "CODE",
        visibility: form.visibility || (form.accessType === "OPEN" ? "PUBLIC" : "PRIVATE"),
        theme: form.theme || "indigo",
        coverUrl,
        logoUrl,
      });

      triggerLifecycleRefresh(dispatch, "course-created");
      setSubmitted(true);
      navigate(routes.spaces.detail(classroom.id), {
        state: { enrollmentCode: classroom.code },
      });
    } catch (error) {
      const errMsg =
        error?.data?.message ||
        error?.data?.error ||
        error?.message ||
        "Unable to create this space. Please check your connection and try again.";
      setSubmissionError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    preview,
    logoPreview,
    errors,
    submitted,
    submissionError,
    isSubmitting,
    isUploadingCover,
    isUploadingLogo,
    update,
    addTag,
    removeTag,
    toggleDay,
    handleImageUpload,
    handleLogoUpload,
    removeCover,
    removeLogo,
    reset,
    submit,
  };
}

export const useCreateClassForm = useCreateSpaceForm;

