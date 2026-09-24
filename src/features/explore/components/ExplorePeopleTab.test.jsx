import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ExplorePeopleTab from "./ExplorePeopleTab.jsx";

describe("ExplorePeopleTab", () => {
  it("renders suggested for you section when recommendations are present", () => {
    const recommendations = [
      {
        id: "rec-1",
        name: "Recommended Peer",
        handle: "recpeer",
        department: "AI Research",
        recommendationReason: "SHARED_SPACES",
        sharedCoursesCount: 1,
      },
    ];

    const filteredPeople = [
      {
        id: "person-1",
        name: "General Member",
        handle: "genmember",
        department: "Design",
      },
    ];

    const html = renderToString(
      <MemoryRouter>
        <ExplorePeopleTab
          recommendations={recommendations}
          filteredPeople={filteredPeople}
          departments={["Design", "AI Research"]}
          personFilter="all"
          searchQuery=""
          onFilterChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(html).toContain("Suggested for you");
    expect(html).toContain("Recommended Peer");
    expect(html).toContain("All Community Members");
    expect(html).toContain("General Member");
  });

  it("hides suggested section when searching", () => {
    const recommendations = [
      {
        id: "rec-1",
        name: "Recommended Peer",
      },
    ];

    const html = renderToString(
      <MemoryRouter>
        <ExplorePeopleTab
          recommendations={recommendations}
          filteredPeople={[]}
          personFilter="all"
          searchQuery="someone"
          onFilterChange={vi.fn()}
        />
      </MemoryRouter>
    );

    expect(html).not.toContain("Suggested for you");
  });
});
