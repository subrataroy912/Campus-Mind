import { useFindClassroomByIdQuery } from "../api/classroomApi.js";

export function useClassroom(classId) {
  const { data, error, isLoading } = useFindClassroomByIdQuery(classId, {
    skip: !classId,
  });

  return { classroom: data?.data ?? data, error, isLoading };
}
