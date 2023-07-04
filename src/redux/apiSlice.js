import axios from "axios";

import { createApi } from "@reduxjs/toolkit/query/react";

import { baseURL } from "api/axiosConfig";
import { Slide, toast } from "react-toastify";

axios.defaults.baseURL = baseURL;

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axios({
        url: baseURL + url,
        method,
        headers: {
          Authorization: `bearer ${JSON.parse(localStorage.getItem("access"))}`,
        },
        params,
        data,
      });

      if (method === "POST")
        toast(result?.data?.message, {
          type: result?.data?.success === "1" ? "success" : "error",
          transition: Slide,
        });

      if (method === "GET")
        result?.data?.success === "0" &&
          toast(result?.data?.message, {
            type: "error",
            transition: Slide,
          });

      return result;
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        err?.response?.data;
      return {
        error: {
          status: err.response?.status,
          message: errorMsg,
        },
      };
    }
  };

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: baseURL,
  }),
  endpoints: (builder) => ({
    getAdminProfile: builder.query({
      query: (params) => ({
        url: "/auth/admin-profile",
        method: "GET",
        params,
      }),
    }),
    getTeacherProfile: builder.query({
      query: (params) => ({
        url: "/auth/teacher-profile",
        method: "GET",
        params,
      }),
    }),
    getStudentProfile: builder.query({
      query: (params) => ({
        url: "/auth/student-profile",
        method: "GET",
        params,
      }),
    }),
  }),
});

export const {
  useGetAdminProfileQuery,
  useGetTeacherProfileQuery,
  useGetStudentProfileQuery,
} = apiSlice;
