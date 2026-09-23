/**
 * Classroom domain type definitions.
 * Used as JSDoc @typedef until TypeScript migration.
 *
 * @typedef {"ACADEMIC_CLASS" | "STUDY_GROUP" | "CLUB_SOCIETY" | "PROJECT_TEAM" | "DEPARTMENT_COHORT" | "COMMUNITY_HUB"} SpaceType
 *
 * @typedef {"invite" | "code" | "open"} AccessType
 *
 * @typedef {"OWNER" | "ADMIN" | "MEMBER" | "VIEWER"} MemberRole
 *
 * @typedef {Object} Space
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {SpaceType} spaceType
 * @property {AccessType} accessType
 * @property {string} [coverImage]
 * @property {string} [logoImage]
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
 * @typedef {"ASSIGNMENT" | "QUIZ" | "MATERIAL" | "QUESTION"} CourseworkType
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
