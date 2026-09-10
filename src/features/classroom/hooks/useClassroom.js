import { useFindClassroomByIdQuery } from "../api/classroomApi.js";
import { useAuth } from "@/context/AuthContext.jsx";

export function useClassroom(classId) {
  const { authStatus } = useAuth();
  const { data, error, isLoading } = useFindClassroomByIdQuery(classId, {
    skip: authStatus === "hydrating" || !classId,
  });

  return { classroom: data?.data ?? data, error, isLoading };
}
