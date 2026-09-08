import { store } from "@/app/store.js";
import { dashboardApi } from "./dashboardApi.js";

export async function fetchAssignments() {
  const response = await store.dispatch(dashboardApi.endpoints.assignments.initiate()).unwrap();
  return response?.data ?? response;
}
