/**
 * API layer type definitions.
 * Used as JSDoc @typedef until TypeScript migration.
 *
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T} data
 * @property {string} [message]
 *
 * @template T
 * @typedef {Object} PaginatedResponse
 * @property {T[]} content
 * @property {number} totalElements
 * @property {number} totalPages
 * @property {number} page
 * @property {number} size
 *
 * @typedef {Object} ApiError
 * @property {number} status
 * @property {{ error: string, message?: string }} data
 *
 * @typedef {"loading" | "ready" | "error"} QueryStatus
 */

// No runtime exports — types only.
export {};
