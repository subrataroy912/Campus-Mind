import { store } from "@/app/store.js";
import { classroomApi } from "./classroomApi.js";

const unwrapResponse = (response) => response?.data ?? response;

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

export async function findClassroomByCode(_userId, courseId) {
  return findClassroomById(_userId, courseId);
}

export async function createClassroom(_userId, details) {
  return unwrapResponse(
    await store.dispatch(classroomApi.endpoints.createClassroom.initiate({
      title: details.className,
      section: details.section,
      subject: details.subject,
      description: details.description,
      visibility: details.accessType === "open" ? "PUBLIC" : "PRIVATE",
    })).unwrap(),
  );
}

export async function joinClassroom(_userId, courseId, code) {
  return unwrapResponse(
    await store.dispatch(classroomApi.endpoints.joinClassroom.initiate({ courseId, code })).unwrap(),
  );
}
