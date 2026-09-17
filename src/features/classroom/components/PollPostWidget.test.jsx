import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { PollPostWidget } from "./PollPostWidget.jsx";

describe("PollPostWidget", () => {
  const samplePoll = {
    id: "test-poll-1",
    question: "Best language for backend?",
    options: [
      { id: "opt-1", text: "TypeScript / Node.js", votes: 10 },
      { id: "opt-2", text: "Python / FastAPI", votes: 10 },
    ],
    totalVotes: 20,
    status: "Active poll",
  };

  it("renders poll question and options", () => {
    const html = renderToString(<PollPostWidget poll={samplePoll} />);
    expect(html).toContain("Best language for backend?");
    expect(html).toContain("TypeScript / Node.js");
    expect(html).toContain("Python / FastAPI");
    expect(html).toContain("20 votes");
  });

  it("renders pre-voted poll with percentages directly", () => {
    const preVotedPoll = {
      ...samplePoll,
      userVotedOptionId: "opt-1",
    };
    const html = renderToString(<PollPostWidget poll={preVotedPoll} />);
    expect(html).toContain("50%");
  });

  it("returns null if poll has no options", () => {
    const html = renderToString(<PollPostWidget poll={{ question: "Empty?" }} />);
    expect(html).toBe("");
  });
});
