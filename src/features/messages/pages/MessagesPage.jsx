import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useSelector } from "react-redux";
import { classroomApi } from "@/features/spaces/api/classroomApi.js";
import { useGetSpaceChatRoomsQuery } from "@/features/messages/api/messagesApi.js";
import { selectCurrentUserId } from "@/features/auth/authSelectors.js";
import AsyncStateBoundary from "@/components/common/AsyncStateBoundary.jsx";
import ErrorState from "@/components/common/ErrorState.jsx";
import EmptyState from "@/components/common/EmptyState.jsx";
import { ChatLayoutSkeleton } from "@/components/common/LoadingState.jsx";
import { routes } from "@/routes/paths.js";
import { MessageRoomList } from "../components/MessageRoomList.jsx";
import { MessageThread } from "../components/MessageThread.jsx";

export default function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSpaceId = searchParams.get("space");
  const currentUserId = useSelector(selectCurrentUserId);

  const {
    data: fetchedRooms,
    isLoading,
    error,
  } = useGetSpaceChatRoomsQuery(undefined, {
    refetchOnFocus: false,
  });

  const { cachedClassrooms } =
    classroomApi.endpoints.fetchClassrooms.useQueryState(undefined, {
      selectFromResult: ({ data }) => ({
        cachedClassrooms: Array.isArray(data) ? data : undefined,
      }),
    });

  const rooms = useMemo(() => {
    if (Array.isArray(fetchedRooms) && fetchedRooms.length > 0) {
      return fetchedRooms;
    }
    if (Array.isArray(cachedClassrooms) && cachedClassrooms.length > 0) {
      return cachedClassrooms.map((c) => ({
        spaceId: c.id || c.courseId,
        title: c.title || c.name || "Space",
        subtitle: c.section || c.subtitle || "",
        avatarUrl: c.logoUrl || c.logo || null,
        memberCount: c.memberCount || 0,
        onlineCount: 0,
        onlineUserIds: [],
        unreadCount: 0,
      }));
    }
    return fetchedRooms ?? [];
  }, [fetchedRooms, cachedClassrooms]);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedSpaceId, setSelectedSpaceId] = useState(
    () => requestedSpaceId || null,
  );

  const effectiveSpaceId =
    requestedSpaceId ||
    selectedSpaceId ||
    (rooms.length > 0 &&
    typeof window !== "undefined" &&
    window.innerWidth >= 1024
      ? rooms[0].spaceId
      : null);

  const handleSelectSpace = (spaceId) => {
    setSelectedSpaceId(spaceId);
    if (spaceId) {
      setSearchParams({ space: spaceId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  const filteredRooms = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter(
      (room) =>
        (room.title || "").toLowerCase().includes(q) ||
        (room.subtitle || "").toLowerCase().includes(q),
    );
  }, [rooms, debouncedQuery]);

  const activeRoom = useMemo(
    () => rooms.find((room) => room.spaceId === effectiveSpaceId) || null,
    [rooms, effectiveSpaceId],
  );

  if (isLoading && rooms.length === 0) {
    return <ChatLayoutSkeleton />;
  }

  if (error && rooms.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-3 sm:p-4">
        <ErrorState
          error={error}
          title="We could not load your space chats"
          description="Please check your connection and try again."
        />
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex w-full flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 min-w-0">
        <header className="mb-2">
          <h1 className="text-base font-semibold tracking-tight text-text-heading">
            Space Group Chats
          </h1>
          <p className="text-xs text-text-muted">
            Every space you join includes a dedicated real-time group chat for
            members and instructors.
          </p>
        </header>
        <EmptyState
          title="No enrolled spaces yet"
          description="Join or create a space to collaborate in its live group chat."
          action={{ to: routes.spaces.list, label: "Browse spaces" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-3.5rem)] w-full max-w-7xl flex-col p-2 sm:p-3">
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-xl border border-border/80 bg-surface shadow-xs lg:grid-cols-[300px_1fr]">
        {/* Left Sidebar: Space Chat Rooms */}
        <MessageRoomList
          rooms={rooms}
          filteredRooms={filteredRooms}
          activeSpaceId={activeRoom?.spaceId}
          query={query}
          onImmediateQueryChange={setQuery}
          onDebouncedQueryChange={setDebouncedQuery}
          onSelectSpace={handleSelectSpace}
          className={activeRoom ? "hidden lg:flex" : "flex"}
        />

        {/* Right Pane: Active Space Chat Thread */}
        <div className={`min-h-0 ${activeRoom ? "flex" : "hidden lg:flex"}`}>
          {activeRoom ? (
            <MessageThread
              key={activeRoom.spaceId}
              room={activeRoom}
              currentUserId={currentUserId}
              onBack={() => handleSelectSpace(null)}
            />
          ) : (
            <div className="grid flex-1 place-items-center px-6 text-center text-xs text-text-muted">
              Select a space channel on the left to join the live conversation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
