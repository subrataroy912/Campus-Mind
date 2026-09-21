/**
 * Shared TypeScript-ready type definitions for Campus-Mind.
 *
 * These JSDoc @typedef declarations provide IDE IntelliSense and type-checking
 * even without a full TypeScript migration. When migrating to .ts files, replace
 * these with proper TypeScript interfaces.
 *
 * Re-exports all domain types for convenient single-import access:
 *   import { User, Space } from "@/types";
 */

export * from "./auth.js";
export * from "./classroom.js";
export * from "./api.js";
