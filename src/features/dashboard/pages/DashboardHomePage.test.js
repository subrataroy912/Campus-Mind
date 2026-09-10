import { describe, expect, it } from "vitest";
import { selectDashboardFeed } from "../dashboardFeed.js";

describe("selectDashboardFeed", () => {
  it("keeps returned public discovery courses available for cards", () => {
    const result = selectDashboardFeed([
      { id: "created-course", title: "Created course", popularity: 4 },
    ]);

    expect(result).toEqual([
      { id: "created-course", title: "Created course", popularity: 4 },
    ]);
  });
});
