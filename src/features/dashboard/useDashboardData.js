import { useState, useEffect } from "react";
import {
  fetchClassrooms,
  fetchExploreClassrooms,
} from "../../features/classroom/api/classroomService";

export function useDashboardData() {
  const [classrooms, setClassrooms] = useState([]);
  const [exploreClassrooms, setExploreClassrooms] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    Promise.all([fetchClassrooms(), fetchExploreClassrooms()])
      .then(([joined, explore]) => {
        if (active) {
          setClassrooms(joined);
          setExploreClassrooms(explore);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  // Return the data so your components can use it
  return { classrooms, exploreClassrooms, status };
}
