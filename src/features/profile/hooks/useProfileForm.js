import { useEffect, useMemo, useRef, useState } from "react";
import ValidateField from "../utils/profileValidation.js";
import { mapErrorToFormFields } from "@/lib/errorUtils.js";

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
  let firstName = profile?.firstName || "";
  let lastName = profile?.lastName || "";
  if (!firstName && profile?.name) {
    const parts = profile.name.trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  } else if (!firstName && profile?.displayName) {
    const parts = profile.displayName.trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ") || "";
  }

  let handle = profile?.handle || "";
  if (!handle && (firstName || profile?.email)) {
    const base = (
      firstName
        ? `${firstName}${lastName}`
        : profile?.email?.split("@")[0] || ""
    )
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");
    if (base) {
      handle = base;
    }
  }

  return {
    firstName,
    lastName,
    handle,
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
            : { name: l.name || "", url: l.url || "" },
        )
      : [],
  };
}

export function useProfileForm({ profile, isOpen = true, onClose, onSave }) {
  const initialFormData = useMemo(() => getInitialFormData(profile), [profile]);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [avatarFile, setAvatarFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    profile?.avatarUrl || profile?.avatar || "",
  );
  const [bannerPreview, setBannerPreview] = useState(
    profile?.bannerUrl || profile?.banner || "",
  );

  const createdUrlsRef = useRef([]);

  const [prevProfile, setPrevProfile] = useState(profile);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (profile !== prevProfile || isOpen !== prevIsOpen) {
    setPrevProfile(profile);
    setPrevIsOpen(isOpen);
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
    setAvatarFile(null);
    setBannerFile(null);
    setAvatarPreview(profile?.avatarUrl || profile?.avatar || "");
    setBannerPreview(profile?.bannerUrl || profile?.banner || "");
  }

  // Clean up object URLs on unmount
  useEffect(() => {
    const urls = createdUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore cleanup errors
        }
      });
    };
  }, []);

  const handleAvatarChange = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    createdUrlsRef.current.push(url);
    setAvatarFile(file);
    setAvatarPreview(url);
  };

  const handleBannerChange = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    createdUrlsRef.current.push(url);
    setBannerFile(file);
    setBannerPreview(url);
  };

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
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    const nextErrors = Object.fromEntries(
      FORM_FIELDS.map((field) => [
        field,
        ValidateField(field, formData[field]),
      ]).filter(([, error]) => error),
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
      if (onSave) {
        const savePromise = onSave({
          ...formData,
          name: displayName,
          displayName,
          handle: (formData.handle || "").trim().replace(/^@+/, ""),
          links: cleanedLinks,
          ...(avatarFile ? { avatarFile } : {}),
          ...(bannerFile ? { bannerFile } : {}),
        });
        if (savePromise && typeof savePromise.unwrap === "function") {
          await savePromise.unwrap();
        } else {
          await savePromise;
        }
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      const fieldErrors = mapErrorToFormFields(
        error,
        {
          handle: [
            "handle",
            "username",
            "taken",
            "14-day",
            "twice",
            "limit",
            "period",
            "already exists",
            "already taken",
          ],
          firstName: ["first name", "firstname"],
          lastName: ["last name", "lastname"],
        },
        "general"
      );
      setErrors((current) => ({
        ...current,
        ...fieldErrors,
      }));
    }
  };

  const handleCancel = () => {
    const isDirty =
      JSON.stringify(formData) !== JSON.stringify(initialFormData) ||
      Boolean(avatarFile) ||
      Boolean(bannerFile);

    if (
      isDirty &&
      typeof window !== "undefined" &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?",
      )
    ) {
      return;
    }
    if (onClose) {
      onClose();
    }
  };

  return {
    formData,
    initialFormData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    handleCancel,
    avatarFile,
    bannerFile,
    avatarPreview,
    bannerPreview,
    handleAvatarChange,
    handleBannerChange,
    isOpen,
  };
}
