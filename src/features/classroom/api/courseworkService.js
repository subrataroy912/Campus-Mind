import { store } from "@/app/store.js";
import { courseworkApi } from "./courseworkApi.js";

const unwrapResponse = (response) => response?.data ?? response;

export function mapCourseworkPayload(payload = {}) {
  return {
    title: payload.title ?? "",
    description: payload.description ?? "",
    type: payload.type ?? "assignment",
    dueAt: payload.dueAt ?? payload.dueDate ?? null,
    maximumPoints: payload.maximumPoints ?? payload.pointsPossible ?? null,
    published: payload.published ?? true,
  };
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

export async function fetchCoursework(courseId) {
  return unwrapResponse(
    await store.dispatch(courseworkApi.endpoints.getCourseworkList.initiate(courseId)).unwrap(),
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

export async function listSubmissions(courseId, courseworkId) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.getSubmissionList.initiate({ courseId, courseworkId }),
    ).unwrap(),
  );
}

export async function fetchMySubmission(courseId, courseworkId) {
  return unwrapResponse(
    await store.dispatch(
      courseworkApi.endpoints.getMySubmission.initiate({ courseId, courseworkId }),
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
