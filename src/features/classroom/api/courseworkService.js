import { store } from "@/app/store.js";
import { courseworkApi } from "./courseworkApi.js";

const unwrapResponse = (response) => response?.data ?? response;

export function mapCourseworkPayload(payload = {}) {
  const type = String(payload.type ?? "ASSIGNMENT").toUpperCase();
  const request = {
    title: payload.title ?? "",
    description: payload.description ?? "",
    type,
  };
  if (type === "ASSIGNMENT") {
    request.dueAt = payload.dueAt ?? payload.dueDate;
    request.maximumPoints = payload.maximumPoints ?? payload.pointsPossible;
  }
  return request;
}

export function normalizeSubmission(submission = {}) {
  return {
    ...submission,
    id: submission.id ?? submission.submissionId,
    status: submission.status ?? submission.state ?? "new",
    submittedAt: submission.submittedAt ?? submission.submitted_on ?? null,
    score: submission.score ?? submission.grade ?? null,
    submitted: submission.submitted ?? Boolean(submission.submittedAt || submission.submitted_on),
  };
}

export async function fetchCoursework(courseId, page = 0, size = 20) {
  return unwrapResponse(
    await store.dispatch(courseworkApi.endpoints.getCourseworkList.initiate({ courseId, page, size })).unwrap(),
  );
}

export async function fetchCourseworkById(courseId, courseworkId) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.getCourseworkById.initiate({ courseId, courseworkId }),
    ).unwrap(),
  );
}

export async function createCoursework(courseId, payload) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.createCoursework.initiate({ courseId, payload: mapCourseworkPayload(payload) }),
    ).unwrap(),
  );
}

export async function listSubmissions(_courseId, courseworkId, page = 0, size = 20) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.getSubmissionList.initiate({ courseworkId, page, size }),
    ).unwrap(),
  );
}

export async function fetchMySubmission(courseId, courseworkId) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.getMySubmission.initiate({ courseworkId }),
    ).unwrap(),
  );
}

export async function startSubmission(courseworkId, payload = {}) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.startSubmission.initiate({ courseworkId, payload }),
    ).unwrap(),
  );
}

export async function saveSubmission(courseworkId, payload = {}) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.saveSubmission.initiate({ courseworkId, payload }),
    ).unwrap(),
  );
}

export async function gradeSubmission(courseworkId, submissionId, payload = {}) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.gradeSubmission.initiate({ courseworkId, submissionId, payload }),
    ).unwrap(),
  );
}
