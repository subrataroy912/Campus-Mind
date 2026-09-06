import { useEffect, useState } from "react";
import { findClassroomById } from "../api/classroomService.js";
import { useAuth } from "../../../context/AuthContext.jsx";

export function useClassroom(classId) {
  const { user } = useAuth();
  const [classroom, setClassroom] = useState(undefined);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    findClassroomById(user?.id, classId)
      .then((result) => {
        if (active) setClassroom(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      });

    return () => {
      active = false;
    };
  }, [classId, user?.id]);

  return { classroom, error };
}
