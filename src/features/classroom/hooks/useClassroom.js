import { useEffect } from "react";
import { useFindClassroomByIdQuery } from "../api/classroomApi.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { clearPersistedApiState } from "@/app/apiCachePersistence.js";
import { getCourseNotFoundDetails } from "../api/classroomErrors.js";

export function useClassroom(classId) {
  const { authStatus } = useAuth();
  const { data, error, isLoading } = useFindClassroomByIdQuery(classId, {
    skip: authStatus === "hydrating" || !classId,
  });
  const notFoundDetails = getCourseNotFoundDetails(error, classId);

  useEffect(() => {
    const details = getCourseNotFoundDetails(error, classId);
    if (!details) return;
    clearPersistedApiState();
    console.error("[Campus-Mind] Course detail request returned 404", details);
  }, [classId, error]);

  return {
    classroom: data?.data ?? data,
    error,
    isLoading,
    notFound: Boolean(notFoundDetails),
  };
}
