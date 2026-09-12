import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import ClassCard from "./ClassCard.jsx";
import { ContentList } from "@/components/common/ContentList.jsx";

vi.mock("react-router", () => ({
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));


describe("ClassCard", () => {
  it("renders rich classroom details with full height and non-breaking structure", () => {
    const classroom = {
      id: "class-1",
      title: "Algorithms & Data Structures",
      subject: "COMPUTER_SCIENCE",
      section: "Section A - Fall 2026",
      teacher: { name: "Dr. Christopher Henderson" },
      accessType: "code",
      code: "ALGO1234",
      memberCount: 25,
      unreadCount: 3,
    };

    const html = renderToString(<ClassCard classroom={classroom} />);

    expect(html).toContain("Algorithms &amp; Data Structures");
    expect(html).toContain("Computer Science");
    expect(html).toContain("Section A - Fall 2026");
    expect(html).toContain("with Dr. Christopher Henderson");
    expect(html).toContain("ALGO1234");
    expect(html).toContain("new");
    expect(html).toContain("h-full");
    expect(html).toContain("w-full");

  });

  it("renders minimal classroom details preserving placeholders for consistent height", () => {
    const classroom = {
      id: "class-2",
      title: "Simple Math",
      memberCount: 5,
    };

    const html = renderToString(<ClassCard classroom={classroom} />);

    expect(html).toContain("Simple Math");
    expect(html).toContain("Self-paced");
    expect(html).toContain("Up to date");
    expect(html).toContain("h-full");
    expect(html).toContain("w-full");
  });

  it("ContentList applies uniform width and items-stretch to carousel items", () => {
    const classrooms = [
      { id: "c-1", title: "Course 1" },
      { id: "c-2", title: "Course 2" },
    ];

    const html = renderToString(
      <ContentList
        layout="carousel"
        items={classrooms}
        renderItem={(c) => <ClassCard classroom={c} />}
      />
    );

    expect(html).toContain("items-stretch");
    expect(html).toContain("max-w-[320px]");
    expect(html).not.toContain("max-w-70");
  });
});
