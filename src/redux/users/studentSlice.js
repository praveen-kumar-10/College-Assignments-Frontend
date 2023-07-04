import { apiSlice } from "../apiSlice";

export const studentSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentAssignments: builder.query({
      query: (params) => ({
        url: "/students/assignments",
        method: "GET",
      }),
      providesTags: () => ["Student Assignments"],
    }),

    getStudentAssignment: builder.query({
      query: (id) => ({
        url: `/students/assignments/${id}`,
        method: "GET",
      }),
      providesTags: () => ["Student Assignment"],
    }),

    uploadAssignment: builder.mutation({
      query: (data) => ({
        url: "/students/upload",
        method: "POST",
        data,
      }),
      invalidatesTags: () => ["Student Assignments"],
    }),
  }),
});

export const {
  useGetStudentAssignmentsQuery,
  useGetStudentAssignmentQuery,
  useUploadAssignmentMutation,
} = studentSlice;
