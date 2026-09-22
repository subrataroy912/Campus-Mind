import { describe, expect, it } from "vitest";
import { mapErrorToFormFields, parseApiError } from "./errorUtils.js";

describe("errorUtils", () => {
  describe("parseApiError", () => {
    it("parses error?.data?.message correctly", () => {
      const err = { data: { message: "Invalid credentials provided." } };
      const parsed = parseApiError(err);
      expect(parsed.message).toBe("Invalid credentials provided.");
    });

    it("parses error?.data?.error correctly", () => {
      const err = { data: { error: "You can only change your handle twice within a 14-day period." } };
      const parsed = parseApiError(err);
      expect(parsed.message).toBe(
        "You can only change your handle twice within a 14-day period."
      );
    });

    it("parses error?.response?.data?.message correctly", () => {
      const err = {
        response: {
          status: 400,
          data: { message: "Classroom name is already taken." },
        },
      };
      const parsed = parseApiError(err);
      expect(parsed.message).toBe("Classroom name is already taken.");
      expect(parsed.status).toBe(400);
    });

    it("parses error?.response?.data?.error correctly", () => {
      const err = {
        response: {
          data: { error: "Account with email already exists." },
        },
      };
      const parsed = parseApiError(err);
      expect(parsed.message).toBe("Account with email already exists.");
    });

    it("falls back to status code messages when data has no explicit message", () => {
      expect(parseApiError({ status: 401 }).message).toContain("session has expired");
      expect(parseApiError({ status: 403 }).message).toContain("permission");
      expect(parseApiError({ status: 404 }).message).toContain("not be found");
      expect(parseApiError({ status: 429 }).message).toContain("Too many requests");
      expect(parseApiError({ status: 500 }).message).toContain("internal server error");
    });

    it("parses error?.message when no status or data payload is present", () => {
      const err = new Error("Network timeout");
      const parsed = parseApiError(err);
      expect(parsed.message).toBe("Network timeout");
    });

    it("safely falls back to defaultMessage when error is null or empty", () => {
      const parsed = parseApiError(null, "Custom fallback");
      expect(parsed.message).toBe("Custom fallback");
    });

    it("handles raw string errors", () => {
      const parsed = parseApiError("Something broke directly");
      expect(parsed.message).toBe("Something broke directly");
    });
  });

  describe("mapErrorToFormFields", () => {
    const rules = {
      handle: ["handle", "username", "taken", "14-day", "twice", "limit"],
      email: ["email", "already exists"],
      password: ["password", "length", "weak"],
    };

    it("intelligently matches handle keyword (case-insensitive)", () => {
      const error = {
        data: { error: "You can only change your HANDLE twice within a 14-day period." },
      };
      const result = mapErrorToFormFields(error, rules);
      expect(result.handle).toBe(
        "You can only change your HANDLE twice within a 14-day period."
      );
      expect(result._isFieldSpecific).toBe(true);
      expect(result.general).toBeUndefined();
    });

    it("matches email collision keyword", () => {
      const error = {
        data: { message: "This email address is already registered." },
      };
      const result = mapErrorToFormFields(error, rules);
      expect(result.email).toBe("This email address is already registered.");
      expect(result._isFieldSpecific).toBe(true);
    });

    it("falls back to general error key for unmapped server exceptions", () => {
      const error = {
        status: 500,
        data: { error: "Database transaction failed unexpectedly." },
      };
      const result = mapErrorToFormFields(error, rules);
      expect(result.general).toBe("Database transaction failed unexpectedly.");
      expect(result._isFieldSpecific).toBe(false);
      expect(result.handle).toBeUndefined();
    });

    it("customizes fallback key if specified", () => {
      const error = { status: 403 };
      const result = mapErrorToFormFields(error, rules, "bannerError");
      expect(result.bannerError).toBeDefined();
      expect(result._isFieldSpecific).toBe(false);
    });
  });
});
