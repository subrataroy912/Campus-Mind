import { baseApi } from "@/app/baseApi.js";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    communityFeed: builder.query({ queryFn: () => ({ data: { posts: [], filters: [] } }) }),
    conversations: builder.query({ queryFn: () => ({ data: { conversations: [] } }) }),
    assignments: builder.query({ queryFn: () => ({ data: [] }) }),
    exploreUsers: builder.query({ queryFn: () => ({ data: [] }) }),
  }),
});

export const {
  useCommunityFeedQuery,
  useConversationsQuery,
  useAssignmentsQuery,
  useExploreUsersQuery,
} = dashboardApi;
