import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";
import ExplorePersonCard from "./ExplorePersonCard.jsx";

describe("ExplorePersonCard", () => {
  it("renders member name, handle, department badge, and initials fallback", () => {
    const person = {
      id: "u-101",
      name: "Jane Doe",
      handle: "janedoe",
      department: "Physics",
      canCreateCourses: false,
    };

    const html = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={person} currentUser={{ id: "me" }} />
      </MemoryRouter>
    );

    expect(html).toContain("Jane Doe");
    expect(html).toContain("janedoe");
    expect(html).toContain("Physics");
    expect(html).toContain("JD"); // initials for Jane Doe
  });

  it("renders creator badge and shared classes count badge when applicable", () => {
    const person = {
      id: "u-102",
      name: "Dr. Smith",
      handle: "drsmith",
      department: "Mathematics",
      canCreateCourses: true,
      joined_class_ids: ["c-1", "c-2"],
    };

    const currentUser = {
      id: "me",
      joined_class_ids: ["c-1", "c-2"],
    };

    const html = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={person} currentUser={currentUser} />
      </MemoryRouter>
    );

    expect(html).toContain("Dr. Smith");
    expect(html).toContain("Mathematics");
    expect(html).toContain("Shares");
    expect(html).toContain("Spaces");
    expect(html).toContain("Course Creator");
  });

  it("renders avatar image when avatar URL is present", () => {
    const person = {
      id: "u-103",
      name: "Avatar User",
      avatar: "https://example.com/avatar.jpg",
      department: "Arts",
    };

    const html = renderToString(
      <MemoryRouter>
        <ExplorePersonCard person={person} currentUser={null} />
      </MemoryRouter>
    );

    expect(html).toContain("src=\"https://example.com/avatar.jpg\"");
  });
});
