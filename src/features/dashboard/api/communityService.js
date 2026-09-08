import { store } from "@/app/store.js";
import { dashboardApi } from "./dashboardApi.js";

export async function fetchCommunityFeed() {
  const response = await store.dispatch(dashboardApi.endpoints.communityFeed.initiate()).unwrap();
  return response?.data ?? response;
}
