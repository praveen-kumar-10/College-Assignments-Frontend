import { apiSlice } from "redux/apiSlice";

export const adminSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query({
      query: (params) => ({
        url: "/getteachers",
        params,
      }),
      providesTags: () => ["Teachers"],
    }),
    approveOrDisapproveTeacher: builder.mutation({
      query: (data) => ({
        url: "/approve",
        method: "POST",
        data,
      }),
      invalidatesTags: () => ["Teachers"],
    }),
    createBulkStudents: builder.mutation({
      query: (data) => ({
        url: "/create-bulk-students",
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),
    createSubjects: builder.mutation({
      query: (data) => ({
        url: "/create-subjects",
        method: "POST",
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),
    promoteStudentsByYearConfirm: builder.mutation({
      query: (data) => ({
        url: "/promote_students_by_year_confirm",
        method: "POST",
        data,
      }),
    }),
    promoteStudents: builder.mutation({
      query: (data) => ({
        url: "/promote_students_by_year",
        method: "POST",
        data,
      }),
    }),
    getAllSemsForStudent: builder.query({
      query: (params) => ({
        url: "/get-student-consolidation-sems",
        method: "GET",
        params,
      }),
    }),
    getSemDetailsForStudent: builder.query({
      query: (params) => ({
        url: "/get-student-consolidation-by-sem",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useApproveOrDisapproveTeacherMutation,
  useCreateBulkStudentsMutation,
  useCreateSubjectsMutation,
  usePromoteStudentsByYearConfirmMutation,
  usePromoteStudentsMutation,
  useGetAllSemsForStudentQuery,
  useGetSemDetailsForStudentQuery,
} = adminSlice;
