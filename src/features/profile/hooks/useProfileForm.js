import { useMemo, useState } from "react";
import ValidateField from "@/utils/ValidateField.jsx";

const FORM_FIELDS = [
  "name",
  "handle",
  "bio",
  "department",
  "batchYear",
  "avatar",
  "banner",
];

function getInitialFormData(profile) {
  return {
    name: profile?.name || "",
    handle: profile?.handle || "",
    bio: profile?.bio || "",
    department: profile?.department || "",
    batchYear: profile?.batchYear || "",
    avatar: profile?.avatar || "",
    banner: profile?.banner || "",
  };
}

export function useProfileForm({ profile, isOpen, onClose, onSave }) {
  const initialFormData = useMemo(() => getInitialFormData(profile), [profile]);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activeTab, setActiveTab] = useState("profile");

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
      FORM_FIELDS.map((field) => [field, ValidateField(field, formData[field])]).filter(
        ([, error]) => error,
      ),
    );
    setErrors(nextErrors);
    setTouched(Object.fromEntries(FORM_FIELDS.map((field) => [field, true])));
    if (Object.keys(nextErrors).length > 0) return;
    await onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    if (
      JSON.stringify(formData) !== JSON.stringify(initialFormData) &&
      !window.confirm("You have unsaved changes. Are you sure you want to cancel?")
    ) {
      return;
    }
    onClose();
  };

  return {
    activeTab,
    setActiveTab,
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
