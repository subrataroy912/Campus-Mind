import { useMemo, useState } from "react";
import {
  useDeleteSpaceMessageMutation,
  useGetSpaceChatHistoryQuery,
  useLazyGetSpaceChatHistoryQuery,
} from "../api/messagesApi.js";

export function useMessageHistory({
  spaceId,
  liveEvents = [],
  reactionPatches = {},
  deletedEventIds = [],
}) {
  const [olderMessages, setOlderMessages] = useState([]);
  const [olderCursor, setOlderCursor] = useState(null);
  const [hasOlderMore, setHasOlderMore] = useState(null);
  const [locallyDeletedIds, setLocallyDeletedIds] = useState(() => new Set());
  const [pendingMessages, setPendingMessages] = useState([]);

  const {
    data: initialHistory,
    isLoading: isHistoryLoading,
    error: historyError,
    refetch: refetchHistory,
  } = useGetSpaceChatHistoryQuery(
    { spaceId, limit: 30 },
    {
      skip: !spaceId,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    },
  );

  const [fetchOlderPage, { isFetching: isFetchingOlder }] =
    useLazyGetSpaceChatHistoryQuery();
  const [deleteSpaceMessage] = useDeleteSpaceMessageMutation();

  const effectiveCursor =
    olderCursor !== null ? olderCursor : (initialHistory?.nextCursor ?? null);
  const effectiveHasMore =
    hasOlderMore !== null
      ? hasOlderMore
      : Boolean(initialHistory?.hasMore && initialHistory?.nextCursor);

  const handleLoadOlder = async () => {
    if (!effectiveCursor || isFetchingOlder || !spaceId) return;
    try {
      const res = await fetchOlderPage({
        spaceId,
        before: effectiveCursor,
        limit: 30,
      }).unwrap();
      const fetched = Array.isArray(res?.items)
        ? res.items
        : Array.isArray(res?.messages)
          ? res.messages
          : [];
      setOlderMessages((prev) => [...fetched, ...prev]);
      setOlderCursor(res?.nextCursor ?? null);
      setHasOlderMore(Boolean(res?.hasMore && res?.nextCursor));
    } catch {
      // Ignore transient pagination error
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId || !spaceId) return;
    setLocallyDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(messageId);
      return next;
    });
    try {
      await deleteSpaceMessage({
        spaceId,
        messageId,
      }).unwrap();
    } catch {
      setLocallyDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(messageId);
        return next;
      });
    }
  };

  const mergedMessages = useMemo(() => {
    const baseHistory = Array.isArray(initialHistory?.items)
      ? initialHistory.items
      : Array.isArray(initialHistory?.messages)
        ? initialHistory.messages
        : [];
    const combined = [
      ...olderMessages,
      ...baseHistory,
      ...liveEvents,
      ...pendingMessages,
    ];
    const byId = new Map();

    for (const msg of combined) {
      if (
        !msg?.eventId ||
        locallyDeletedIds.has(msg.eventId) ||
        deletedEventIds.includes(msg.eventId)
      ) {
        continue;
      }
      const patchedReactions = reactionPatches[msg.eventId];
      byId.set(
        msg.eventId,
        patchedReactions ? { ...msg, reactions: patchedReactions } : msg,
      );
    }

    return Array.from(byId.values()).sort(
      (a, b) =>
        new Date(a.timestamp || 0).getTime() -
        new Date(b.timestamp || 0).getTime(),
    );
  }, [
    olderMessages,
    initialHistory,
    liveEvents,
    pendingMessages,
    locallyDeletedIds,
    deletedEventIds,
    reactionPatches,
  ]);

  return {
    initialHistory,
    mergedMessages,
    pendingMessages,
    setPendingMessages,
    isHistoryLoading,
    historyError,
    refetchHistory,
    hasOlderMore: effectiveHasMore,
    isFetchingOlder,
    handleLoadOlder,
    handleDeleteMessage,
  };
}
