import { store } from "@/app/store.js";
import { exploreApi } from "./exploreApi.js";

export const fetchExploreClasses = async ({ subject, page = 0, size = 20 } = {}) =>
  store.dispatch(exploreApi.endpoints.getExploreFeed.initiate({ subject, page, size })).unwrap();

export const fetchExploreUsers = async (currentUserId) => {
  void currentUserId;
  return [];
};
