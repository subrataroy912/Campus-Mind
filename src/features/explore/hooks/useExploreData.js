import { useEffect, useState } from "react";
import { fetchExploreClasses, fetchExploreUsers } from "../api/exploreService.js";

export function useExploreData(currentUserId) {
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    Promise.all([fetchExploreClasses(), fetchExploreUsers(currentUserId)])
      .then(([nextClasses, nextUsers]) => {
        if (!active) return;
        setClasses(nextClasses.content);
        setUsers(nextUsers);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => { active = false; };
  }, [currentUserId]);

  return { classes, users, status };
}
