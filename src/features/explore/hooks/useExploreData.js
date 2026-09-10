import { useEffect, useState } from "react";
import { fetchExploreClasses, fetchExploreUsers } from "../api/exploreService.js";
import { useAuth } from "@/context/AuthContext.jsx";

export function useExploreData(currentUserId) {
  const { authStatus } = useAuth();
  const [classes, setClasses] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (authStatus === "hydrating") return undefined;
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
  }, [authStatus, currentUserId]);

  return { classes, users, status };
}
