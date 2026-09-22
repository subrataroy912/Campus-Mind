/**
 * Defensive error parsing and form field mapping utility for RTK Query
 * and async mutation error handling.
 */

const STATUS_DEFAULT_MESSAGES = Object.freeze({
  400: "Invalid request. Please check the entered information and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource could not be found.",
  409: "A conflict occurred. The resource may already exist or has been modified.",
  422: "Unable to process the requested data. Please verify your input.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "An internal server error occurred. Please try again later.",
  502: "Bad gateway. The server is temporarily unavailable.",
  503: "Service unavailable. Please try again later.",
  504: "Gateway timeout. The server took too long to respond.",
});

/**
 * Safely extracts a string from any arbitrary value.
 *
 * @param {any} value
 * @returns {string|null}
 */
function extractString(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (Array.isArray(value)) {
    const strings = value.map(extractString).filter(Boolean);
    return strings.length > 0 ? strings.join(", ") : null;
  }
  if (value && typeof value === "object") {
    // If it's a Spring Boot / typical field error map { field: "message" }
    const entries = Object.entries(value);
    const messages = entries
      .map(([k, v]) => (typeof v === "string" ? `${k}: ${v}` : extractString(v)))
      .filter(Boolean);
    return messages.length > 0 ? messages.join(", ") : null;
  }
  return null;
}

/**
 * Parses any error into a standardized object with a human-readable message.
 * Inspects the full payload hierarchy:
 *  1. error?.data?.message
 *  2. error?.data?.error
 *  3. error?.response?.data?.message
 *  4. error?.response?.data?.error
 *  5. Status code fallback (400, 401, 403, 404, 409, 429, 500+)
 *  6. error?.message
 *  7. defaultMessage fallback
 *
 * @param {any} error - The caught rejection or error object.
 * @param {string} [defaultMessage="An unexpected error occurred. Please try again."]
 * @returns {{ message: string, status: number|null, raw: any }}
 */
export function parseApiError(
  error,
  defaultMessage = "An unexpected error occurred. Please try again."
) {
  if (!error) {
    return { message: defaultMessage, status: null, raw: error };
  }

  // If already a raw string
  if (typeof error === "string") {
    const trimmed = error.trim();
    return {
      message: trimmed.length > 0 ? trimmed : defaultMessage,
      status: null,
      raw: error,
    };
  }

  const status =
    typeof error.status === "number"
      ? error.status
      : typeof error?.response?.status === "number"
      ? error.response.status
      : null;

  // 1. error?.data?.message
  const dataMessage = extractString(error?.data?.message);
  if (dataMessage) {
    return { message: dataMessage, status, raw: error };
  }

  // 2. error?.data?.error
  const dataError = extractString(error?.data?.error);
  if (dataError) {
    return { message: dataError, status, raw: error };
  }

  // 3. error?.response?.data?.message
  const responseDataMessage = extractString(error?.response?.data?.message);
  if (responseDataMessage) {
    return { message: responseDataMessage, status, raw: error };
  }

  // 4. error?.response?.data?.error
  const responseDataError = extractString(error?.response?.data?.error);
  if (responseDataError) {
    return { message: responseDataError, status, raw: error };
  }

  // 5. Status code lookup
  if (status && STATUS_DEFAULT_MESSAGES[status]) {
    return { message: STATUS_DEFAULT_MESSAGES[status], status, raw: error };
  }
  if (typeof status === "number" && status >= 500) {
    return {
      message: STATUS_DEFAULT_MESSAGES[500],
      status,
      raw: error,
    };
  }

  // 6. error?.message (ignoring generic technical messages if status gives better info)
  const genericMessage = extractString(error?.message);
  if (genericMessage && !genericMessage.toLowerCase().includes("object object")) {
    return { message: genericMessage, status, raw: error };
  }

  // 7. Fallback
  return { message: defaultMessage, status, raw: error };
}

/**
 * Matches an extracted error message against field-specific keywords (case-insensitive)
 * and assigns unmapped errors to a default fallback key (e.g. 'general').
 *
 * @param {any} error - The caught rejection / error.
 * @param {Record<string, string[]|RegExp>} [fieldRules={}] - Mapping of fieldName -> list of keyword tokens or Regex.
 * @param {string} [fallbackKey="general"] - The key to assign if no field match occurs.
 * @returns {Record<string, string> & { _isFieldSpecific: boolean, _rawMessage: string }}
 */
export function mapErrorToFormFields(
  error,
  fieldRules = {},
  fallbackKey = "general"
) {
  const { message } = parseApiError(error);
  const lowerMessage = message.toLowerCase();

  for (const [field, rule] of Object.entries(fieldRules)) {
    if (Array.isArray(rule)) {
      const hasMatch = rule.some((keyword) =>
        lowerMessage.includes(String(keyword).toLowerCase())
      );
      if (hasMatch) {
        return {
          [field]: message,
          _isFieldSpecific: true,
          _rawMessage: message,
        };
      }
    } else if (rule instanceof RegExp) {
      if (rule.test(message)) {
        return {
          [field]: message,
          _isFieldSpecific: true,
          _rawMessage: message,
        };
      }
    } else if (typeof rule === "function") {
      if (rule(message, lowerMessage, error)) {
        return {
          [field]: message,
          _isFieldSpecific: true,
          _rawMessage: message,
        };
      }
    }
  }

  // Unmapped fallback: assign to global form-wide error state
  return {
    [fallbackKey]: message,
    _isFieldSpecific: false,
    _rawMessage: message,
  };
}
