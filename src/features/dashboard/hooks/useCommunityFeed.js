import { useState } from "react";
import {
  MOCK_COMMUNITY_FILTERS,
  MOCK_COMMUNITY_POSTS,
} from "../model/communityData.js";

export function useCommunityFeed() {
  return useState({
    data: {
      filters: MOCK_COMMUNITY_FILTERS,
      posts: MOCK_COMMUNITY_POSTS,
    },
    isLoading: false,
    error: null,
  })[0];
}
