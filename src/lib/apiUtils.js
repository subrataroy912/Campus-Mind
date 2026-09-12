/**
 * Unwraps API responses that might be structured as { data: ... } or raw payload.
 *
 * @param {any} response
 * @returns {any}
 */
export const unwrapResponse = (response) => response?.data ?? response;