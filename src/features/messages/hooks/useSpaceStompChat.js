import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useSelector } from "react-redux";
import { apiBaseUrl } from "@/app/baseApi.js";
import { selectAccessToken, selectCurrentUserId } from "@/features/auth/authSelectors.js";
import {
  useSendSpaceMessageRestMutation,
  useToggleSpaceReactionRestMutation,
} from "../api/messagesApi.js";

function resolveWsBrokerUrl() {
  const base = apiBaseUrl.replace(/\/+$/, "");
  const wsBase = base
    .replace(/^http:\/\//i, "ws://")
    .replace(/^https:\/\//i, "wss://");
  return `${wsBase}/ws`;
}

export function useSpaceStompChat(spaceIdOrOptions) {
  const spaceId =
    typeof spaceIdOrOptions === "string"
      ? spaceIdOrOptions
      : spaceIdOrOptions?.spaceId;

  const accessToken = useSelector(selectAccessToken);
  const currentUserId = useSelector(selectCurrentUserId);

  const [connected, setConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  const [reactionPatches, setReactionPatches] = useState({});
  const [deletedEventIds, setDeletedEventIds] = useState([]);
  const [typingUsersMap, setTypingUsersMap] = useState({});

  const clientRef = useRef(null);
  const lastTypingSentAtRef = useRef(0);
  const typingTimersRef = useRef({});

  const [sendRest] = useSendSpaceMessageRestMutation();
  const [toggleReactionRest] = useToggleSpaceReactionRestMutation();

  const handleIncomingEvent = useCallback(
    (payload) => {
      if (!payload || !payload.type) return;

      if (payload.type === "TYPING_STATUS") {
        const typerId = payload.userId || payload.sender?.userId;
        const typerName =
          payload.username || payload.sender?.username || "Member";
        if (!typerId || String(typerId) === String(currentUserId)) {
          return;
        }
        if (payload.isTyping !== false) {
          setTypingUsersMap((prev) => ({
            ...prev,
            [typerId]: { userId: typerId, username: typerName },
          }));
          if (typingTimersRef.current[typerId]) {
            clearTimeout(typingTimersRef.current[typerId]);
          }
          typingTimersRef.current[typerId] = setTimeout(() => {
            setTypingUsersMap((prev) => {
              const next = { ...prev };
              delete next[typerId];
              return next;
            });
          }, 5000);
        } else {
          setTypingUsersMap((prev) => {
            const next = { ...prev };
            delete next[typerId];
            return next;
          });
        }
        return;
      }

      if (
        payload.type === "TEXT_MESSAGE" ||
        payload.type === "MEDIA_MESSAGE"
      ) {
        const senderId = payload.sender?.userId;
        if (senderId) {
          setTypingUsersMap((prev) => {
            if (!prev[senderId]) return prev;
            const next = { ...prev };
            delete next[senderId];
            return next;
          });
        }
        setLiveEvents((prev) => {
          if (prev.some((m) => m.eventId === payload.eventId)) {
            return prev.map((m) =>
              m.eventId === payload.eventId ? payload : m,
            );
          }
          return [...prev, payload];
        });
        return;
      }

      if (
        payload.type === "REACTION_ADDED" ||
        payload.type === "REACTION_REMOVED"
      ) {
        const targetId = payload.targetMessageId || payload.eventId;
        if (targetId && payload.reactions) {
          setReactionPatches((prev) => ({
            ...prev,
            [targetId]: payload.reactions,
          }));
          setLiveEvents((prev) =>
            prev.map((m) =>
              m.eventId === targetId
                ? { ...m, reactions: payload.reactions }
                : m,
            ),
          );
        }
        return;
      }

      if (payload.type === "MESSAGE_DELETED") {
        const targetId = payload.targetMessageId || payload.eventId;
        if (targetId) {
          setDeletedEventIds((prev) =>
            prev.includes(targetId) ? prev : [...prev, targetId],
          );
          setLiveEvents((prev) =>
            prev.filter((m) => m.eventId !== targetId),
          );
        }
      }
    },
    [currentUserId],
  );

  useEffect(() => {
    if (!spaceId || !accessToken) {
      return undefined;
    }

    const brokerURL = resolveWsBrokerUrl();
    const timersSnapshot = typingTimersRef.current;

    const client = new Client({
      brokerURL,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 4000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/spaces/${spaceId}`, (frame) => {
          try {
            const payload = JSON.parse(frame.body);
            handleIncomingEvent(payload);
          } catch {
            // Ignore malformed STOMP frame
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onWebSocketClose: () => {
        setConnected(false);
      },
      onStompError: () => {
        setConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      setConnected(false);
      Object.values(timersSnapshot).forEach(clearTimeout);
      clientRef.current = null;
      client.deactivate();
    };
  }, [spaceId, accessToken, handleIncomingEvent]);

  // Debounced TYPING_STATUS publisher (fires at most once every 3.5 seconds while typing)
  const notifyTyping = useCallback(() => {
    if (!spaceId || !clientRef.current?.connected) return;
    const now = Date.now();
    if (now - lastTypingSentAtRef.current < 3500) {
      return;
    }
    lastTypingSentAtRef.current = now;
    try {
      clientRef.current.publish({
        destination: `/app/spaces/${spaceId}.typing`,
        body: JSON.stringify({ isTyping: true }),
      });
    } catch {
      // Best-effort transient typing signal
    }
  }, [spaceId]);

  const sendMessage = useCallback(
    ({ content, attachments = [] }) => {
      if (!spaceId) return false;
      lastTypingSentAtRef.current = 0;
      sendRest({ spaceId, content, attachments })
        .unwrap()
        .then((eventDto) => {
          handleIncomingEvent(eventDto);
        })
        .catch(() => {
          // Fallback to direct STOMP publish if REST request encountered transient error
          if (clientRef.current?.connected) {
            clientRef.current.publish({
              destination: `/app/spaces/${spaceId}.send`,
              body: JSON.stringify({ content, attachments }),
            });
          }
        });
      return true;
    },
    [spaceId, sendRest, handleIncomingEvent],
  );

  const toggleReaction = useCallback(
    (targetOrObj, maybeEmoji) => {
      const targetMessageId =
        typeof targetOrObj === "string"
          ? targetOrObj
          : targetOrObj?.targetMessageId;
      const emoji =
        typeof targetOrObj === "string" ? maybeEmoji : targetOrObj?.emoji;

      if (!spaceId || !targetMessageId || !emoji) return;
      toggleReactionRest({
        spaceId,
        targetMessageId,
        emoji,
      })
        .unwrap()
        .then((patchDto) => {
          handleIncomingEvent(patchDto);
        })
        .catch(() => {
          if (clientRef.current?.connected) {
            clientRef.current.publish({
              destination: `/app/spaces/${spaceId}.reaction`,
              body: JSON.stringify({ targetMessageId, emoji }),
            });
          }
        });
    },
    [spaceId, toggleReactionRest, handleIncomingEvent],
  );

  const typingUsers = useMemo(
    () => Object.values(typingUsersMap),
    [typingUsersMap],
  );

  const isConnected = connected && Boolean(spaceId && accessToken);

  return {
    isConnected,
    connected: isConnected,
    liveEvents,
    reactionPatches,
    deletedEventIds,
    typingUsers,
    notifyTyping,
    sendMessage,
    toggleReaction,
  };
}

