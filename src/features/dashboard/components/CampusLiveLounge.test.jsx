import { describe, it, expect, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { CampusLiveLounge } from "./CampusLiveLounge.jsx";

vi.mock("@/context/AuthContext.jsx", () => ({
  useAuth: () => ({
    user: { name: "Test Student", avatar: null },
  }),
}));

describe("CampusLiveLounge", () => {
  it("renders study lounge heading and active student cards", () => {
    const html = renderToString(<CampusLiveLounge />);
    expect(html).toContain("Campus Live Study Lounge");
    expect(html).toContain("Elena Rostova");
    expect(html).toContain("Marcus Vance");
    expect(html).toContain("Sit at Study Table");
  });
});
