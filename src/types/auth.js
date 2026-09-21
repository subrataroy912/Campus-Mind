/**
 * Auth domain type definitions.
 * Used as JSDoc @typedef until TypeScript migration.
 *
 * @typedef {"hydrating" | "authenticated" | "unauthenticated"} AuthStatus
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} displayName
 * @property {string} [avatarUrl]
 * @property {boolean} canCreateCourses
 *
 * @typedef {"google" | "github"} OAuthProvider
 *
 * @typedef {Object} Session
 * @property {User} user
 * @property {AuthStatus} authStatus
 */

// No runtime exports — types only.
export {};
