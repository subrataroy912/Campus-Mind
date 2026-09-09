import { store } from "@/app/store.js";
import { classroomApi } from "./classroomApi.js";

const unwrapResponse = (response) => response?.data ?? response;

export function mapCreateClassPayload(details = {}) {
  return {
    name: details.name ?? details.className ?? "",
    section: details.section ?? "",
    subject: details.subject ?? "",
    gradeLevel: details.gradeLevel ?? details.grade ?? "",
    room: details.room ?? "",
    description: details.description ?? "",
    visibility: details.visibility ?? (details.accessType === "open" ? "PUBLIC" : "PRIVATE"),
  };
}

export function mapJoinClassPayload({ courseId, code, classCode } = {}) {
  const normalizedCode = formatClassCodeFromInput(code ?? classCode ?? "");
  return {
    courseId: courseId ?? "",
    code: normalizedCode,
  };
}

function formatClassCodeFromInput(value) {
  const normalized = String(value ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return normalized.length === 8 ? `${normalized.slice(0, 4)}-${normalized.slice(4)}` : normalized;
}

export async function fetchClassrooms() {
  return unwrapResponse(
    await store.dispatch(classroomApi.endpoints.fetchClassrooms.initiate()).unwrap(),
  );
}

export async function fetchExploreClassrooms() {
  return unwrapResponse(
    await store.dispatch(classroomApi.endpoints.fetchExploreClassrooms.initiate()).unwrap(),
  );
}

export async function findClassroomById(_userId, classId) {
  return unwrapResponse(
    await store.dispatch(classroomApi.endpoints.findClassroomById.initiate(classId)).unwrap(),
  );
}

export async function findClassroomByCode(_userId, courseId, code) {
  const payload = mapJoinClassPayload({ courseId, code });

  if (!payload.courseId && !payload.code) {
    return null;
  }

  if (payload.courseId) {
    return findClassroomById(_userId, payload.courseId);
  }

  return unwrapResponse(
    await store.dispatch(classroomApi.endpoints.findClassroomById.initiate(payload.code)).unwrap(),
  );
}

export async function createClassroom(_userId, details) {
  const payload = mapCreateClassPayload(details);

  return unwrapResponse(
    await store.dispatch(classroomApi.endpoints.createClassroom.initiate(payload)).unwrap(),
  );
}

export async function joinClassroom(_userId, courseId, code) {
  const payload = mapJoinClassPayload({ courseId, code });

  return unwrapResponse(
    await store.dispatch(classroomApi.endpoints.joinClassroom.initiate(payload)).unwrap(),
  );
}
