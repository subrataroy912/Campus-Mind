import { baseApi } from "@/app/baseApi.js";

export const classroomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchClassrooms: builder.query({
      query: () => "/classrooms",
      providesTags: ["Classrooms"],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    fetchExploreClassrooms: builder.query({
      query: () => "/classrooms/explore",
      providesTags: ["Classrooms"],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    findClassroomById: builder.query({
      query: (classId) => `/classrooms/${classId}`,
      providesTags: (_result, _error, classId) => [{ type: "Classrooms", id: classId }],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: 300,
    }),
    findClassroomByCode: builder.query({
      query: (code) => ({ url: "/classrooms/lookup", params: { code } }),
    }),
    createClassroom: builder.mutation({
      query: (details) => ({ url: "/classrooms", method: "POST", body: details }),
      invalidatesTags: ["Classrooms"],
    }),
    joinClassroom: builder.mutation({
      query: (code) => ({
        url: "/classrooms/join",
        method: "POST",
        body: { code },
      }),
      invalidatesTags: ["Classrooms"],
    }),
  }),
});

export const {
  useFetchClassroomsQuery,
  useFetchExploreClassroomsQuery,
  useFindClassroomByIdQuery,
} = classroomApi;