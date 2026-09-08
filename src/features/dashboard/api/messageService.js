import { store } from "@/app/store.js";
import { dashboardApi } from "./dashboardApi.js";

export async function fetchConversations() {
  const response = await store.dispatch(dashboardApi.endpoints.conversations.initiate()).unwrap();
  return response?.data ?? response;
}
