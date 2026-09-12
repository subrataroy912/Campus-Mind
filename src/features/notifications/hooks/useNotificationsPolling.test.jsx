import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { useNotificationsPolling } from "./useNotificationsPolling.js";

const mockUseListNotificationsQuery = vi.fn();
vi.mock("../api/notificationsApi.js", () => ({
  useListNotificationsQuery: (...args) => mockUseListNotificationsQuery(...args),
}));

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({ isAuthenticated: true }),
}));

function TestConsumer({ interval }) {
  useNotificationsPolling({ interval });
  return <div>consumer</div>;
}

describe("useNotificationsPolling", () => {
  it("enables polling when tab is visible and passes options to query", () => {
    renderToString(<TestConsumer interval={15000} />);

    expect(mockUseListNotificationsQuery).toHaveBeenCalledWith(
      { unreadOnly: true, page: 0, size: 10 },
      expect.objectContaining({
        skip: false,
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      })
    );
  });
});
