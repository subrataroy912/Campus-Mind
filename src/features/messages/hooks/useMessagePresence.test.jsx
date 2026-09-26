import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { useMessagePresence } from "./useMessagePresence.js";

function TestConsumer(props) {
  const presence = useMessagePresence(props);
  return (
    <div
      data-testid="presence"
      data-active-count={presence.activeOnlineCount}
      data-online={presence.onlineMembers.map((m) => m.userId).join(",")}
      data-offline={presence.offlineMembers.map((m) => m.userId).join(",")}
    />
  );
}

describe("useMessagePresence", () => {
  it("computes online and offline members accurately", () => {
    const spaceRoster = [
      { id: "u1", name: "Alice", online: true },
      { id: "u2", name: "Bob", online: false },
      { id: "u3", name: "Charlie", online: false },
    ];

    const userPresenceMap = {
      u3: { online: true, lastActiveAt: new Date().toISOString() },
    };

    const html = renderToString(
      <TestConsumer
        currentUserId="u1"
        room={{ spaceId: "s1", onlineCount: 2 }}
        spaceRoster={spaceRoster}
        stompOnlineUserIds={["u1"]}
        userPresenceMap={userPresenceMap}
      />,
    );

    // u1 is current user and in stompOnlineUserIds -> online
    // u2 is offline in roster and not in presenceMap -> offline
    // u3 is offline in roster, but overridden online in userPresenceMap -> online
    expect(html).toContain('data-online="u1,u3"');
    expect(html).toContain('data-offline="u2"');
    expect(html).toContain('data-active-count="2"');
  });
});
