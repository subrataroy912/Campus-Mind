const unwrapResponse = (response) => response?.data ?? response;

export function normalizeComment(comment = {}) {
  return {
    ...comment,
    id: comment.id ?? comment.commentId,
    content: comment.content ?? comment.message ?? "",
    author: comment.author ?? { name: comment.authorName ?? "User" },
    createdAt: comment.createdAt ?? comment.created_at ?? null,
  };
}

export async function fetchCourseworkComments(_courseId, _courseworkId) {
  return unwrapResponse({ data: [] });
}

export async function addCourseworkComment(_courseId, _courseworkId, payload = {}) {
  return unwrapResponse(payload);
}

export async function fetchSubmissionComments(_submissionId) {
  return unwrapResponse({ data: [] });
}

export async function addSubmissionComment(_submissionId, payload = {}) {
  return unwrapResponse(payload);
}
