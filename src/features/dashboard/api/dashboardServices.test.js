import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAssignments } from "./assignmentService.js";
import { fetchCommunityFeed } from "./communityService.js";
import { fetchConversations } from "./messageService.js";
import { store } from "@/app/store.js";

vi.mock("@/app/store.js", () => ({
  store: { dispatch: vi.fn() },
}));

describe("dashboard services", () => {
  beforeEach(() => {
    store.dispatch.mockReset();
  });

  it("unwraps assignment data returned by the API", async () => {
    store.dispatch.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { items: [], filters: [] } }),
    });
    const result = await fetchAssignments();

    expect(result).toEqual({ items: [], filters: [] });
  });

  it("unwraps community data returned by the API", async () => {
    store.dispatch.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { posts: [], filters: [] } }),
    });
    const result = await fetchCommunityFeed();

    expect(result).toEqual({ posts: [], filters: [] });
  });

  it("unwraps conversations returned by the API", async () => {
    store.dispatch.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { conversations: [] } }),
    });
    const result = await fetchConversations();

    expect(result).toEqual({ conversations: [] });
  });
});
