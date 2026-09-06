import { useEffect, useState } from "react";
import { findClassroomById } from "../api/classroomService.js";

export function useClassroom(classId) {
  const [classroom, setClassroom] = useState(undefined);

  useEffect(() => {
    let active = true;

    findClassroomById(classId).then((result) => {
      if (active) setClassroom(result);
    });

    return () => {
      active = false;
    };
  }, [classId]);

  return classroom;
}
