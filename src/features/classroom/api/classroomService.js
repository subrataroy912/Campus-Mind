import { store } from "@/app/store.js";
import { classroomApi } from "./classroomApi.js";
import { unwrapResponse } from "@/lib/apiUtils.js";

export function mapCreateClassPayload(details = {}) {
  const rawAccessType = (details.accessType || "").toUpperCase();
  const accessType = ["INVITE", "CODE", "OPEN"].includes(rawAccessType)
    ? rawAccessType
    : details.visibility === "PUBLIC"
    ? "OPEN"
    : "CODE";

  const rawVisibility = (details.visibility || "").toUpperCase();
  const visibility = ["PUBLIC", "PRIVATE"].includes(rawVisibility)
    ? rawVisibility
    : accessType === "OPEN"
    ? "PUBLIC"
    : "PRIVATE";

  const rawMeetingType = (details.meetingType || "").toUpperCase();
  const meetingType = ["ONLINE", "IN_PERSON", "HYBRID"].includes(rawMeetingType)
    ? rawMeetingType
    : "IN_PERSON";

  const rawSpaceType = (details.spaceType || "").toUpperCase();
  const spaceType = [
    "ACADEMIC_CLASS",
    "STUDY_GROUP",
    "CLUB_SOCIETY",
    "PROJECT_TEAM",
    "DEPARTMENT_COHORT",
    "COMMUNITY_HUB",
  ].includes(rawSpaceType)
    ? rawSpaceType
    : "ACADEMIC_CLASS";

  const title = (details.title ?? details.name ?? details.className ?? "").trim();
  const section = (details.section ?? "").trim();
  const subject = (details.subject ?? "").trim();
  const description = (details.description ?? "").trim();
  const location = (details.location ?? details.room ?? "").trim();

  const tags = Array.isArray(details.tags)
    ? details.tags.map((t) => String(t).trim()).filter(Boolean)
    : typeof details.tags === "string"
    ? details.tags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean)
    : [];

  const links = Array.isArray(details.links) ? details.links : [];

  return {
    title,
    spaceType,
    section,
    subject,
    description,
    visibility,
    accessType,
    meetingType,
    location,
    tags,
    links,
    coverUrl: details.coverUrl ?? null,
    logoUrl: details.logoUrl ?? null,
    theme: details.theme ?? null,
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

export async function uploadSpaceMedia(file, type = "cover") {
  if (!file) return null;
  const upload =
    type === "logo"
      ? await requestCourseLogoUpload()
      : await requestCourseCoverUpload();

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", upload.uploadApiKey);
  body.append("timestamp", String(upload.uploadTimestamp));
  body.append("signature", upload.uploadSignature);
  body.append("public_id", upload.publicId);

  const response = await fetch(upload.uploadUrl, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    throw new Error(`Unable to upload the space ${type}.`);
  }

  const result = await response.json();
  return result.secure_url;
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

export const createSpace = createClassroom;
export const updateSpace = updateClassroom;
export const joinSpace = joinClassroom;
export const fetchSpaces = fetchClassrooms;
export const findSpaceById = findClassroomById;
export const mapCreateSpacePayload = mapCreateClassPayload;
export const mapJoinSpacePayload = mapJoinClassPayload;

