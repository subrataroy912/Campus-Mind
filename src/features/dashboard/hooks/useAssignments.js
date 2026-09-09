import { useState } from "react";

export function useAssignments() {
  return useState({
    data: null,
    isLoading: false,
    error: null,
  })[0];
}
