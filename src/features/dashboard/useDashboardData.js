import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  fetchClassrooms,
  fetchExploreClassrooms,
} from "../../features/classroom/api/classroomService";

export function useDashboardData() {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [exploreClassrooms, setExploreClassrooms] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    Promise.all([fetchClassrooms(user?.id), fetchExploreClassrooms()])
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
  }, [user?.id]);

  // Return the data so your components can use it
  return { classrooms, exploreClassrooms, status };
}
