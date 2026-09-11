import { store } from "@/app/store.js";
import { classroomApi } from "./classroomApi.js";

const unwrapResponse = (response) => response?.data ?? response;

export function mapCreateClassPayload(details = {}) {
  return {
    title: details.title ?? details.name ?? details.className ?? "",
    section: details.section ?? "",
    subject: details.subject ?? "",
    description: details.description ?? "",
    visibility:
      details.visibility ??
      (details.accessType === "open" ? "PUBLIC" : "PRIVATE"),
  };
}

export function mapJoinClassPayload({ courseId, code, classCode } = {}) {
  const normalizedCode = formatClassCodeFromInput(code ?? classCode ?? "");
  const payload = { code: normalizedCode };
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

export async function updateClassroom(courseId, changes) {
  return unwrapResponse(
    await store
      .dispatch(classroomApi.endpoints.updateClassroom.initiate({ courseId, changes }))
      .unwrap()
  );
}

export async function joinClassroom(_userId, courseIdOrCode, maybeCode) {
  let courseId = courseIdOrCode;
  let code = maybeCode;
  if (maybeCode === undefined) {
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
