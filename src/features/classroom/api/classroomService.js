import { store } from "@/app/store.js";
import { classroomApi } from "./classroomApi.js";

const unwrapResponse = (response) => response?.data ?? response;

export function mapCreateClassPayload(details = {}) {
  const rawAccessType = (details.accessType || "").toUpperCase();
  const accessType = ["INVITE", "CODE", "OPEN"].includes(rawAccessType)
    ? rawAccessType
    : details.visibility === "PUBLIC"
    ? "OPEN"
    : "CODE";

  return {
    title: details.title ?? details.name ?? details.className ?? "",
    section: details.section ?? "",
    subject: details.subject ?? "",
    description: details.description ?? "",
    coverUrl: details.coverUrl ?? null,
    logoUrl: details.logoUrl ?? null,
    theme: details.theme ?? null,
    accessType,
    visibility:
      details.visibility ??
      (accessType === "OPEN" ? "PUBLIC" : "PRIVATE"),
  };
}

export function mapJoinClassPayload({ courseId, code, classCode } = {}) {
  const normalizedCode = formatClassCodeFromInput(code ?? classCode ?? "");
  const payload = {};
  if (normalizedCode) {
    payload.code = normalizedCode;
  }
  if (courseId) {
    payload.courseId = courseId;
  }
  return payload;
}

function formatClassCodeFromInput(value) {
  return String(value ?? "")
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase();
}

export async function fetchClassrooms() {
  return unwrapResponse(
    await store
      .dispatch(classroomApi.endpoints.fetchClassrooms.initiate())
      .unwrap()
  );
}

export async function findClassroomById(_userId, classId) {
  return unwrapResponse(
    await store
      .dispatch(classroomApi.endpoints.findClassroomById.initiate(classId))
      .unwrap()
  );
}

export async function createClassroom(_userId, details) {
  const payload = mapCreateClassPayload(details);

  return unwrapResponse(
    await store
      .dispatch(classroomApi.endpoints.createClassroom.initiate(payload))
      .unwrap()
  );
}

export async function requestCourseCoverUpload() {
  return unwrapResponse(
    await store
      .dispatch(classroomApi.endpoints.requestCourseCoverUpload.initiate())
      .unwrap()
  );
}

export async function requestCourseLogoUpload() {
  return unwrapResponse(
    await store
      .dispatch(classroomApi.endpoints.requestCourseLogoUpload.initiate())
      .unwrap()
  );
}

export async function updateClassroom(courseId, changes) {
  return unwrapResponse(
    await store
      .dispatch(classroomApi.endpoints.updateClassroom.initiate({ courseId, changes }))
      .unwrap()
  );
}

export async function joinClassroom(_userId, courseIdOrCode, maybeCode) {
  let courseId;
  let code;

  if (courseIdOrCode && typeof courseIdOrCode === "object") {
    courseId = courseIdOrCode.courseId;
    code = courseIdOrCode.code ?? courseIdOrCode.classCode;
  } else if (maybeCode !== undefined) {
    courseId = courseIdOrCode;
    code = maybeCode;
  } else if (
    typeof courseIdOrCode === "string" &&
    (/^[0-9a-fA-F]{24}$/.test(courseIdOrCode.trim()) ||
      /^[0-9a-fA-F-]{36}$/.test(courseIdOrCode.trim()) ||
      courseIdOrCode.trim().length > 16)
  ) {
    courseId = courseIdOrCode.trim();
    code = undefined;
  } else {
    code = courseIdOrCode;
    courseId = undefined;
  }
  const payload = mapJoinClassPayload({ courseId, code });

  return unwrapResponse(
    await store
      .dispatch(classroomApi.endpoints.joinClassroom.initiate(payload))
      .unwrap()
  );
}
