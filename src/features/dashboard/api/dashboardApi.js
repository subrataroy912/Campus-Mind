import { baseApi } from "@/app/baseApi.js";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    communityFeed: builder.query({ query: () => "/community/feed" }),
    conversations: builder.query({ query: () => "/messages/conversations" }),
    assignments: builder.query({ query: () => "/assignments" }),
    exploreUsers: builder.query({ query: () => "/users/explore" }),
  }),
});
