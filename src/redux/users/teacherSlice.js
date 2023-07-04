import { apiSlice } from "redux/apiSlice";

export const teacherSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranchesByYear: builder.query({
      query: (params) => ({
        url: "/get-branches-by-year",
        method: "GET",
        params,
      }),
    }),
    getSectionsByBranchYear: builder.query({
      query: (params) => ({
        url: "/get-sections-by-branch-year",
        method: "GET",
        params,
      }),
    }),

    getSubjectByBranchYearSectionSem: builder.query({
      query: (params) => ({
        url: "/get-subject-by-branch-year-section-sem",
        method: "GET",
        params,
      }),
    }),

    getClassAssignmentsBasedOnTitle: builder.query({
      query: (params) => ({
        url: "/get-class-assignments-title",
        method: "GET",
        params: { ...params, edu_year: 4, year: 2019 },
      }),
      providesTags: () => ["Class Assignment Titles"],
    }),

    createAssignment: builder.mutation({
      query: (data) => ({
        url: "/create-assignment",
        method: "POST",
        data,
      }),
      invalidatesTags: () => [],
    }),

    assignMarks: builder.mutation({
      query: (data) => ({
        url: "/assign-marks",
        method: "POST",
        data,
      }),
      invalidatesTags: () => ["Class Assignment Titles"],
    }),

    getMyAssignmentsForTeacher: builder.query({
      query: (params) => ({
        url: "/my-assignment-teacher",
        method: "GET",
        params,
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

    extendDueDate: builder.mutation({
      query: (data) => ({
        url: "/extend-due-date",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useGetBranchesByYearQuery,
  useGetSectionsByBranchYearQuery,
  useGetSubjectByBranchYearSectionSemQuery,
  useCreateAssignmentMutation,
  useGetClassAssignmentsBasedOnTitleQuery,
  useAssignMarksMutation,
  useExtendDueDateMutation,

  useGetMyAssignmentsForTeacherQuery,
  useGetAllSemsForStudentQuery,
  useGetSemDetailsForStudentQuery,
} = teacherSlice;
