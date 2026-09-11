import { useMemo, useState } from "react";
import ValidateField from "@/utils/ValidateField.jsx";

const FORM_FIELDS = [
  "firstName",
  "lastName",
  "handle",
  "headline",
  "bio",
  "city",
  "country",
  "phone",
  "gender",
  "dateOfBirth",
  "address",
  "profileVisibility",
];

function getInitialFormData(profile) {
  return {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    handle: profile?.handle || "",
    headline: profile?.headline || "",
    bio: profile?.bio || profile?.about || "",
    city: profile?.city || "",
    country: profile?.country || "",
    phone: profile?.phone || "",
    gender: profile?.gender || "",
    dateOfBirth: profile?.dateOfBirth || "",
    address: profile?.address || "",
    profileVisibility: profile?.profileVisibility || "PUBLIC",
    links: Array.isArray(profile?.links)
      ? profile.links.map((l) =>
          typeof l === "string"
            ? { name: "", url: l }
            : { name: l.name || "", url: l.url || "" }
        )
      : [],
  };
}

export function useProfileForm({ profile, isOpen, onClose, onSave }) {
  const initialFormData = useMemo(() => getInitialFormData(profile), [profile]);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }));
    if (touched[name]) {
      setErrors((current) => ({
        ...current,
        [name]: ValidateField(name, value),
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({
      ...current,
      [name]: ValidateField(name, formData[name]),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      FORM_FIELDS.map((field) => [
        field,
        ValidateField(field, formData[field]),
      ]).filter(([, error]) => error)
    );
    setErrors(nextErrors);
    setTouched(Object.fromEntries(FORM_FIELDS.map((field) => [field, true])));
    if (Object.keys(nextErrors).length > 0) return;

    const displayName = [formData.firstName, formData.lastName]
      .filter(Boolean)
      .join(" ");

    const cleanedLinks = (formData.links || [])
      .map((l) => ({
        name: (l.name || "").trim(),
        url: (l.url || "").trim(),
      }))
      .filter((l) => l.url.length > 0);

    try {
      await onSave({
        ...formData,
        name: displayName,
        displayName,
        links: cleanedLinks,
      });
      onClose();
    } catch (error) {
      const message =
        error?.data?.error ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update profile";
      if (
        message.toLowerCase().includes("handle") ||
        message.toLowerCase().includes("username") ||
        message.toLowerCase().includes("taken")
      ) {
        setErrors((current) => ({ ...current, handle: message }));
      } else {
        setErrors((current) => ({ ...current, general: message }));
      }
    }
  };

  const handleCancel = () => {
    if (
      JSON.stringify(formData) !== JSON.stringify(initialFormData) &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?"
      )
    ) {
      return;
    }
    onClose();
  };

  return {
    formData,
    initialFormData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    handleCancel,
    isOpen,
  };
}
