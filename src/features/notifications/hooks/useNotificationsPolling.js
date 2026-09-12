import { useEffect, useState } from "react";
import { useListNotificationsQuery } from "../api/notificationsApi.js";
import { useAuth } from "@/context/AuthContext.jsx";

export function useNotificationsPolling({ interval = 30000 } = {}) {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(
    typeof document !== "undefined" ? document.visibilityState === "visible" : true
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return useListNotificationsQuery(
    { unreadOnly: true, page: 0, size: 10 },
    {
      skip: !isAuthenticated,
      pollingInterval: isVisible ? interval : 0,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );
}
