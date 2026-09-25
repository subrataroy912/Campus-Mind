import { apiBaseUrl } from "@/app/baseApi.js";

export function getCourseNotFoundDetails(error, courseId) {
  const status =
    error?.status ?? error?.originalStatus ?? error?.response?.status ?? null;
  if (status !== 404 || !courseId) return null;

  return {
    courseId,
    status,
    url: `${apiBaseUrl}/courses/${encodeURIComponent(courseId)}`,
  };
}
