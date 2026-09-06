import { useEffect, useState } from "react";
import { fetchAssignments } from "../api/assignmentService.js";

export function useAssignments() {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    fetchAssignments()
      .then((data) => {
        if (active) setState({ data, isLoading: false, error: null });
      })
      .catch((error) => {
        if (active) setState({ data: null, isLoading: false, error });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
