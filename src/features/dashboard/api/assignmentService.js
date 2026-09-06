import { ASSIGNMENTS, ASSIGNMENT_FILTERS } from "@/mock/mockAssignments.js";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));

export async function fetchAssignments() {
  return delay({
    items: ASSIGNMENTS.map((item) => ({ ...item })),
    filters: ASSIGNMENT_FILTERS.map((filter) => ({ ...filter })),
  });
}
