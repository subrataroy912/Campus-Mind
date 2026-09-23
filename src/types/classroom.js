/**
 * Classroom domain type definitions.
 * Used as JSDoc @typedef until TypeScript migration.
 *
 * @typedef {"PUBLIC" | "PRIVATE" | "LINK_ONLY"} AccessType
 *
 * @typedef {"OWNER" | "ADMIN" | "MEMBER"} MemberRole
 *
 * @typedef {Object} Space
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {AccessType} accessType
 * @property {string} [coverUrl]
 * @property {string} [logoUrl]
 * @property {boolean} isEnrolled
 * @property {MemberRole} role
 * @property {string} ownerId
 *
 * @typedef {Object} Member
 * @property {string} id
 * @property {string} displayName
 * @property {string} [avatarUrl]
 * @property {MemberRole} role
 *
 * @typedef {"ASSIGNMENT" | "ANNOUNCEMENT" | "MATERIAL"} CourseworkType
 *
 * @typedef {Object} Coursework
 * @property {string} id
 * @property {string} title
 * @property {CourseworkType} type
 * @property {string} [dueDate]
 * @property {number} [maxPoints]
 *
 * @typedef {Object} Attachment
 * @property {string} id
 * @property {string} fileName
 * @property {string} fileUrl
 * @property {string} mimeType
 */

// No runtime exports — types only.
export {};
