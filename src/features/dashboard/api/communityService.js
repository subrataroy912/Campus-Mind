import { COMMUNITY_FILTERS, COMMUNITY_POSTS } from "@/mock/mockCommunityPosts.js";

const delay = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), 300));

export async function fetchCommunityFeed() {
  return delay({
    posts: COMMUNITY_POSTS.map((post) => ({ ...post })),
    filters: COMMUNITY_FILTERS.map((filter) => ({ ...filter })),
  });
}
