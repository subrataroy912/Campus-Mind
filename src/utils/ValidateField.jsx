export const MAX_BIO_LENGTH = 500;

function ValidateField(name, value) {
  const text = String(value || "");
  if (name === "name") {
    if (!text.trim()) return "Name is required.";
    if (text.trim().length < 2) return "Name must be at least 2 characters.";
    if (text.trim().length > 50) return "Name must be less than 50 characters.";
  }
  if (name === "handle") {
    if (!text.trim()) return "Username is required.";
    if (!/^[a-zA-Z0-9_]+$/.test(text.trim()))
      return "Use only letters, numbers, and underscores.";
    if (text.trim().length < 3)
      return "Username must be at least 3 characters.";
    if (text.trim().length > 30)
      return "Username must be less than 30 characters.";
  }
  if (name === "bio" && text.length > MAX_BIO_LENGTH) {
    return `Bio must be ${MAX_BIO_LENGTH} characters or less.`;
  }
  if (name === "department" && text.trim().length > 50) {
    return "Department must be less than 50 characters.";
  }
  if (name === "batchYear" && text.trim() && !/^\d{4}$/.test(text.trim())) {
    return "Batch year must be a 4-digit year.";
  }
  return null;
}

export default ValidateField;
