import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ExplorePeopleTab from "./ExplorePeopleTab.jsx";

describe("ExplorePeopleTab", () => {
  it("renders unified Recommended for you section without All Community Members", () => {
    const filteredPeople = [
      {
        id: "rec-1",
        name: "Recommended Peer",
        handle: "recpeer",
        recommendationReason: "MUTUAL_SPACE_PEERS",
        mutualPeersCount: 2,
      },
    ];

    const html = renderToString(
      <MemoryRouter>
        <ExplorePeopleTab
          filteredPeople={filteredPeople}
          personFilter="all"
          searchQuery=""
          onFilterChange={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(html).toContain("Recommended for you");
    expect(html).toContain("Recommended Peer");
    expect(html).toContain("2 mutual friends");
    expect(html).not.toContain("All Community Members");
    expect(html).not.toContain("All departments");
  });

  it("renders empty state when no recommendations match", () => {
    const html = renderToString(
      <MemoryRouter>
        <ExplorePeopleTab
          filteredPeople={[]}
          personFilter="all"
          searchQuery=""
          onFilterChange={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(html).toContain("No recommendations yet");
  });

  it("activates built-in recommendation filter buttons correctly", () => {
    const html = renderToString(
      <MemoryRouter>
        <ExplorePeopleTab
          filteredPeople={[]}
          personFilter="mutual"
          searchQuery=""
          onFilterChange={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(html).toContain("All Recommendations");
    expect(html).toContain("Mutual Space Peers");
    expect(html).toContain("Shares a Space");
    expect(html).toContain("bg-primary text-primary-foreground");
  });
});
