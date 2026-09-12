import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import { triggerLifecycleRefresh } from "@/features/events/refreshEvents.js";
import {
  createClassroom,
  requestCourseCoverUpload,
  requestCourseLogoUpload,
  updateClassroom,
} from "../api/classroomService.js";
import { INITIAL_CLASS_FORM } from "../model/createClassForm.js";
import { optimizeImage } from "@/utils/optimizeImage.js";

export function useCreateClassForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [form, setForm] = useState(INITIAL_CLASS_FORM);
  const [preview, setPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const toggleDay = (day) => {
    setForm((previous) => ({
      ...previous,
      days: previous.days.includes(day)
        ? previous.days.filter((item) => item !== day)
        : [...previous.days, day],
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const optimizedFile = await optimizeImage(file, 1600);
    update("coverImage", optimizedFile);
    setPreview(URL.createObjectURL(optimizedFile));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const optimizedFile = await optimizeImage(file, 600);
    update("logoImage", optimizedFile);
    setLogoPreview(URL.createObjectURL(optimizedFile));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.className.trim()) {
      nextErrors.className = "Class name is required.";
    }
    if (!form.subject) {
      nextErrors.subject = "Select a subject.";
    } else if (form.subject === "Other" && !form.customSubject?.trim()) {
      nextErrors.customSubject = "Please enter your custom subject.";
    }

    if (!form.gradeLevel) {
      nextErrors.gradeLevel = "Select a target grade.";
    } else if (form.gradeLevel === "Other" && !form.customGradeLevel?.trim()) {
      nextErrors.customGradeLevel = "Please enter your custom target grade.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const reset = () => {
    setForm(INITIAL_CLASS_FORM);
    setPreview(null);
    setLogoPreview(null);
    setErrors({});
    setSubmitted(false);
    setSubmissionError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      setSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");
    try {
      let coverUrl = null;
      let logoUrl = null;

      // Upload cover image if provided (optional)
      if (form.coverImage) {
        const upload = await requestCourseCoverUpload();
        const body = new FormData();
        body.append("file", form.coverImage);
        body.append("api_key", upload.uploadApiKey);
        body.append("timestamp", String(upload.uploadTimestamp));
        body.append("signature", upload.uploadSignature);
        body.append("public_id", upload.publicId);
        const response = await fetch(upload.uploadUrl, {
          method: "POST",
          body,
        });
        if (!response.ok) throw new Error("Unable to upload the class cover.");
        coverUrl = (await response.json()).secure_url;
      }

      // Upload logo image if provided (optional)
      if (form.logoImage) {
        const upload = await requestCourseLogoUpload();
        const body = new FormData();
        body.append("file", form.logoImage);
        body.append("api_key", upload.uploadApiKey);
        body.append("timestamp", String(upload.uploadTimestamp));
        body.append("signature", upload.uploadSignature);
        body.append("public_id", upload.publicId);
        const response = await fetch(upload.uploadUrl, {
          method: "POST",
          body,
        });
        if (!response.ok) throw new Error("Unable to upload the class logo.");
        logoUrl = (await response.json()).secure_url;
      }

      const effectiveSubject =
        form.subject === "Other" ? form.customSubject?.trim() : form.subject;
      const effectiveGradeLevel =
        form.gradeLevel === "Other"
          ? form.customGradeLevel?.trim()
          : form.gradeLevel;

      const classroom = await createClassroom(user?.id, {
        ...form,
        subject: effectiveSubject,
        gradeLevel: effectiveGradeLevel,
        targetGrade: effectiveGradeLevel,
        coverUrl,
        logoUrl,
      });

      const updates = {};
      if (coverUrl && !classroom.coverUrl) updates.coverUrl = coverUrl;
      if (logoUrl && !classroom.logoUrl) updates.logoUrl = logoUrl;

      const savedClassroom = Object.keys(updates).length > 0
        ? await updateClassroom(classroom.id, updates)
        : classroom;

      triggerLifecycleRefresh(dispatch, "course-created");
      setSubmitted(true);
      navigate(`/dashboard/classes/${savedClassroom.id}`, {
        state: { enrollmentCode: classroom.code },
      });
    } catch (error) {
      setSubmissionError(
        error?.data?.error || error?.message || "Unable to create this class."
      );
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
    update,
    toggleDay,
    handleImageUpload,
    handleLogoUpload,
    reset,
    submit,
  };
}
