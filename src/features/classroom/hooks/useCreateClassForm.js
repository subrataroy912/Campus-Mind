import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext.jsx";
import { createClassroom } from "../api/classroomService.js";
import { INITIAL_CLASS_FORM } from "../model/createClassForm.js";

export function useCreateClassForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(INITIAL_CLASS_FORM);
  const [preview, setPreview] = useState(null);
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

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    update("coverImage", file);
    const reader = new FileReader();
    reader.onload = (result) => setPreview(result.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.className.trim()) nextErrors.className = "Class name is required.";
    if (!form.subject) nextErrors.subject = "Select a subject.";
    if (!form.gradeLevel) nextErrors.gradeLevel = "Select a grade level.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const reset = () => {
    setForm(INITIAL_CLASS_FORM);
    setPreview(null);
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
      const classroom = await createClassroom(user?.id, {
        ...form,
        coverImage: preview,
      });
      setSubmitted(true);
      navigate(`/dashboard/classes/${classroom.id}`);
    } catch (error) {
      setSubmissionError(error.message || "Unable to create this class.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    preview,
    errors,
    submitted,
    submissionError,
    isSubmitting,
    update,
    toggleDay,
    handleImageUpload,
    reset,
    submit,
  };
}
