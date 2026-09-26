import SearchInput from "@/components/common/SearchInput.jsx";
import { MessageRoomItem } from "./MessageRoomItem.jsx";

export function MessageRoomList({
  rooms = [],
  filteredRooms = [],
  activeSpaceId,
  query,
  onImmediateQueryChange,
  onDebouncedQueryChange,
  onSelectSpace,
  className = "",
}) {
  return (
    <div
      className={`flex min-h-0 flex-col border-border/70 lg:border-r ${className}`}
    >
      <div className="border-b border-border/70 p-2.5 space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Space Channels ({rooms.length})
          </h2>
        </div>
        <SearchInput
          value={query}
          onImmediateChange={onImmediateQueryChange}
          onChange={onDebouncedQueryChange}
          placeholder="Search space chats…"
          className="w-full"
        />
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto p-1.5">
        {filteredRooms.length === 0 ? (
          <div className="p-4 text-center text-xs text-text-muted">
            No matching space channels found.
          </div>
        ) : (
          filteredRooms.map((room) => (
            <MessageRoomItem
              key={room.spaceId}
              room={room}
              active={room.spaceId === activeSpaceId}
              onSelect={onSelectSpace}
            />
          ))
        )}
      </div>
    </div>
  );
}
