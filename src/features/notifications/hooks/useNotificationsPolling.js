import { useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ReactReduxContext } from "react-redux";
import { toast } from "@/components/ui/toast";
import { apiBaseUrl } from "@/app/baseApi.js";
import {
  selectAccessToken,
  selectCurrentUserId,
} from "@/features/auth/authSelectors.js";
import {
  notificationsApi,
  prependNotificationToCache,
  syncNotificationReadInCache,
  useListNotificationsQuery,
} from "../api/notificationsApi.js";
import { resolveNotificationTargetLink } from "../components/NotificationsMenu.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

function resolveWsBrokerUrl() {
  const base = (apiBaseUrl || "").replace(/\/+$/, "");
  const wsBase = base
    .replace(/^http:\/\//i, "ws://")
    .replace(/^https:\/\//i, "wss://");
  return `${wsBase}/ws`;
}

export function useNotificationsPolling({
  interval = 30000,
  onNavigate,
} = {}) {
  const { isAuthenticated, user } = useAuth();
  const reduxContext = useContext(ReactReduxContext);
  const store = reduxContext?.store ?? null;
  const dispatch = store?.dispatch ?? null;

  const state = store?.getState?.();
  const accessToken = state ? selectAccessToken(state) : null;
  const currentUserId =
    (state ? selectCurrentUserId(state) : null) ||
    user?.id ||
    user?._id ||
    user?.userId ||
    null;

  const [isVisible, setIsVisible] = useState(
    typeof document !== "undefined"
      ? document.visibilityState === "visible"
      : true,
  );
  const [wsConnected, setWsConnected] = useState(false);

  const isWsActive =
    wsConnected && isAuthenticated && Boolean(accessToken && currentUserId);

  const onNavigateRef = useRef(onNavigate);
  useEffect(() => {
    onNavigateRef.current = onNavigate;
  }, [onNavigate]);

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

  const queryResult = useListNotificationsQuery(
    { unreadOnly: true, page: 0, size: 10 },
    {
      skip: !isAuthenticated,
      pollingInterval: isVisible && !isWsActive ? interval : 0,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const refetchRef = useRef(queryResult?.refetch);
  useEffect(() => {
    refetchRef.current = queryResult?.refetch;
  }, [queryResult?.refetch]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !isAuthenticated ||
      !accessToken ||
      !currentUserId ||
      !dispatch
    ) {
      return undefined;
    }

    let subscription = null;
    let hadDisconnected = false;

    const client = new Client({
      brokerURL: resolveWsBrokerUrl(),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 4000,
      heartbeatIncoming: 15000,
      heartbeatOutgoing: 15000,
      onConnect: () => {
        setWsConnected(true);
        if (hadDisconnected) {
          hadDisconnected = false;
          refetchRef.current?.();
        }
        subscription = client.subscribe(
          `/topic/users/${currentUserId}/notifications`,
          (frame) => {
            try {
              const payload = JSON.parse(frame.body);
              const eventType = payload?.eventType;

              if (eventType === "NOTIFICATION_CREATED" && payload.notification) {
                const notif = payload.notification;
                prependNotificationToCache(dispatch, notif);

                if (payload.pushEnabled !== false && toast?.add) {
                  const targetLink = resolveNotificationTargetLink(notif);
                  const notifId = notif.id || notif._id;
                  toast.add({
                    title: notif.title || "New Notification",
                    description: notif.message || undefined,
                    type: "info",
                    actionProps: targetLink
                      ? {
                          children: "Open",
                          onClick: () => {
                            if (notifId) {
                              dispatch(
                                notificationsApi.endpoints.markNotificationRead.initiate(
                                  notifId,
                                ),
                              );
                            }
                            onNavigateRef.current?.(targetLink);
                          },
                        }
                      : undefined,
                  });
                }
                return;
              }

              if (eventType === "NOTIFICATION_READ" && payload.notificationId) {
                syncNotificationReadInCache(dispatch, {
                  notificationId: payload.notificationId,
                });
                return;
              }

              if (eventType === "NOTIFICATIONS_READ_ALL") {
                syncNotificationReadInCache(dispatch, { all: true });
              }
            } catch {
              // Ignore malformed frames
            }
          },
        );
      },
      onWebSocketClose: () => {
        hadDisconnected = true;
        setWsConnected(false);
      },
      onStompError: () => {
        setWsConnected(false);
      },
    });

    client.activate();

    return () => {
      try {
        subscription?.unsubscribe();
      } catch {
        // Ignore unsubscribe error
      }
      client.deactivate();
      setWsConnected(false);
    };
  }, [isAuthenticated, accessToken, currentUserId, dispatch]);

  return queryResult;
}
