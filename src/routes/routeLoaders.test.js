import { describe, expect, it, vi } from "vitest";
import {
  createDashboardLoader,
  createSpacesLoader,
  createSpaceDetailLoader,
  createExploreLoader,
} from "./routeLoaders.js";

describe("routeLoaders", () => {
  const createMockStore = (token = "mock-token") => ({
    getState: () => ({
      auth: { accessToken: token },
    }),
    dispatch: vi.fn(),
  });

  it("createDashboardLoader dispatches prefetch for classrooms, profile, and explore feed", () => {
    const store = createMockStore();
    const loader = createDashboardLoader(store);
    const result = loader();

    expect(result).toBeNull();
    // 3 prefetch dispatches
    expect(store.dispatch).toHaveBeenCalledTimes(3);
  });

  it("createSpacesLoader dispatches prefetch for classrooms when authenticated", () => {
    const store = createMockStore();
    const loader = createSpacesLoader(store);
    const result = loader();

    expect(result).toBeNull();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it("createSpaceDetailLoader dispatches prefetch for classroom and coursework", () => {
    const store = createMockStore();
    const loader = createSpaceDetailLoader(store);
    const result = loader({ params: { classId: "c-123" } });

    expect(result).toBeNull();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });

  it("createExploreLoader dispatches prefetch for feed by default", () => {
    const store = createMockStore();
    const loader = createExploreLoader(store);
    const result = loader({ request: { url: "http://localhost:5173/explore" } });

    expect(result).toBeNull();
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });

  it("createExploreLoader dispatches prefetch for people when tab=people", () => {
    const store = createMockStore();
    const loader = createExploreLoader(store);
    const result = loader({
      request: { url: "http://localhost:5173/explore?tab=people" },
    });

    expect(result).toBeNull();
    expect(store.dispatch).toHaveBeenCalledTimes(2);
  });
});
