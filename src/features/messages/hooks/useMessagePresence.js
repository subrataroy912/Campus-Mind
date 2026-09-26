import { useMemo } from "react";

export function useMessagePresence({
  currentUserId,
  room,
  spaceRoster = [],
  stompOnlineUserIds = [],
  userPresenceMap = {},
}) {
  const roomOnlineUserIds = room?.onlineUserIds;
  const roomOnlineCount = room?.onlineCount;

  const onlineUserIdsSet = useMemo(() => {
    const set = new Set();
    if (currentUserId) {
      set.add(String(currentUserId));
    }
    if (Array.isArray(roomOnlineUserIds)) {
      roomOnlineUserIds.forEach((id) => id && set.add(String(id)));
    }
    if (Array.isArray(stompOnlineUserIds)) {
      stompOnlineUserIds.forEach((id) => id && set.add(String(id)));
    }
    if (Array.isArray(spaceRoster)) {
      spaceRoster.forEach((m) => {
        const uid = m?.userId || m?.id;
        if (!uid) return;
        const liveOverride = userPresenceMap[String(uid)];
        if (liveOverride) {
          if (liveOverride.online) set.add(String(uid));
          else set.delete(String(uid));
        } else if (m.online) {
          set.add(String(uid));
        }
      });
    }
    Object.entries(userPresenceMap).forEach(([uid, state]) => {
      if (state?.online) set.add(String(uid));
      else if (String(uid) !== String(currentUserId)) set.delete(String(uid));
    });
    return set;
  }, [
    currentUserId,
    roomOnlineUserIds,
    stompOnlineUserIds,
    spaceRoster,
    userPresenceMap,
  ]);

  const { onlineMembers, offlineMembers, activeOnlineCount } = useMemo(() => {
    const list = Array.isArray(spaceRoster) ? spaceRoster : [];
    const on = [];
    const off = [];
    list.forEach((m) => {
      const uid = String(m?.userId || m?.id || "");
      if (!uid) return;
      const isUserOnline = onlineUserIdsSet.has(uid);
      const lastActive =
        userPresenceMap[uid]?.lastActiveAt || m?.lastActiveAt || m?.joinedAt;
      const enriched = {
        ...m,
        userId: uid,
        online: isUserOnline,
        lastActiveAt: lastActive,
      };
      if (isUserOnline) {
        on.push(enriched);
      } else {
        off.push(enriched);
      }
    });
    const count = Math.max(
      1,
      on.length,
      onlineUserIdsSet.size,
      Number(roomOnlineCount) || 1,
    );
    return {
      onlineMembers: on,
      offlineMembers: off,
      activeOnlineCount: count,
    };
  }, [spaceRoster, onlineUserIdsSet, userPresenceMap, roomOnlineCount]);

  return {
    onlineUserIdsSet,
    onlineMembers,
    offlineMembers,
    activeOnlineCount,
  };
}
