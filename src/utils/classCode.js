export const CLASS_CODE_LENGTH = 8;

export function normalizeClassCode(value = "") {
  return value
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, CLASS_CODE_LENGTH);
}

export function formatClassCode(characters) {
  const normalized = normalizeClassCode(characters.join(""));
  return `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
}
