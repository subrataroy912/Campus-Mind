import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { apiBaseUrl } from "@/app/baseApi.js";
import { selectAccessToken } from "@/features/auth/authSelectors.js";

const HEARTBEAT_INTERVAL_MS = 30_000;
const MIN_PING_GAP_MS = 10_000;

/**
 * Periodically sends a lightweight presence heartbeat while the user is
 * authenticated and the browser tab is visible, keeping their online status
 * and lastActiveAt fresh across Space Chat, Members Tab, and Profile pages.
 */
export function usePresenceHeartbeat() {
  const accessToken = useSelector(selectAccessToken);
  const lastPingAtRef = useRef(0);

  useEffect(() => {
    if (!accessToken) return undefined;

    const sendPing = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        return;
      }
      const now = Date.now();
      if (now - lastPingAtRef.current < MIN_PING_GAP_MS) {
        return;
      }
      lastPingAtRef.current = now;

      const base = apiBaseUrl.replace(/\/+$/, "");
      fetch(`${base}/v1/presence/heartbeat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        keepalive: true,
      }).catch(() => {});
    };

    sendPing();

    const intervalId = setInterval(sendPing, HEARTBEAT_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        sendPing();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [accessToken]);
}
