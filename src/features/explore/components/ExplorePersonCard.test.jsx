import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ExplorePersonCard from "./ExplorePersonCard.jsx";

describe("ExplorePersonCard", () => {
  it("renders member name and initials fallback when no avatar", () => {
    const person = {
      id: "u-101",
      name: "Jane Doe",
      handle: "janedoe",
    };

    const html = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={person} />
      </MemoryRouter>
    );

    expect(html).toContain("Jane Doe");
    expect(html).toContain("JD"); // initials for Jane Doe
  });

  it("does not render handle, department, or badges", () => {
    const person = {
      id: "u-102",
      name: "Dr. Smith",
      handle: "drsmith",
      department: "Mathematics",
      canCreateCourses: true,
      sharedCoursesCount: 2,
      sameDepartment: true,
    };

    const html = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={person} />
      </MemoryRouter>
    );

    expect(html).toContain("Dr. Smith");
    expect(html).not.toContain("drsmith");
    expect(html).not.toContain("Mathematics");
    expect(html).not.toContain("Shares");
    expect(html).not.toContain("Same Department");
    expect(html).not.toContain("Course Creator");
  });

  it("renders avatar image when avatar URL is present", () => {
    const person = {
      id: "u-103",
      name: "Avatar User",
      avatar: "https://example.com/avatar.jpg",
    };

    const html = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={person} />
      </MemoryRouter>
    );

    expect(html).toContain('src="https://example.com/avatar.jpg"');
  });

  it("shows mutual friends count only when mutualPeersCount > 0", () => {
    const personWith = {
      id: "u-104",
      name: "Professor Higgins",
      mutualPeersCount: 3,
    };
    const personWithout = {
      id: "u-105",
      name: "No Peers",
      mutualPeersCount: 0,
    };

    const htmlWith = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={personWith} />
      </MemoryRouter>
    );
    const htmlWithout = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={personWithout} />
      </MemoryRouter>
    );

    expect(htmlWith).toContain("3 mutual friends");
    expect(htmlWithout).not.toContain("mutual friend");
  });

  it("uses singular 'mutual friend' when count is 1", () => {
    const person = {
      id: "u-106",
      name: "Solo Friend",
      mutualPeersCount: 1,
    };

    const html = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={person} />
      </MemoryRouter>
    );

    expect(html).toContain("1 mutual friend");
    expect(html).not.toContain("1 mutual friends");
  });
});
