import { describe, expect, it } from "vitest";
import { fetchAssignments } from "./assignmentService.js";
import { fetchCommunityFeed } from "./communityService.js";
import { fetchConversations } from "./messageService.js";

describe("dashboard services", () => {
  it("return assignment data through an async boundary", async () => {
    const result = await fetchAssignments();

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.filters.length).toBeGreaterThan(0);
  });

  it("return community data through an async boundary", async () => {
    const result = await fetchCommunityFeed();

    expect(result.posts.length).toBeGreaterThan(0);
    expect(result.filters.length).toBeGreaterThan(0);
  });

  it("return conversations with copied message arrays", async () => {
    const result = await fetchConversations();

    expect(result.conversations.length).toBeGreaterThan(0);
    expect(result.conversations[0].messages).not.toBeUndefined();
  });
});
