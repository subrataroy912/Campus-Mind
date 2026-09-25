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
    status: submission.status ?? submission.state ?? "DRAFT",
    submittedAt: submission.submittedAt ?? submission.submitted_on ?? null,
    score: submission.score ?? submission.grade ?? null,
    submitted:
      submission.submitted ??
      Boolean(submission.submittedAt || submission.submitted_on),
  };
}
