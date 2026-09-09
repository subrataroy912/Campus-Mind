import { useState } from "react";

export function useCommunityFeed() {
  return useState({
    data: null,
    isLoading: false,
    error: null,
  })[0];
}
