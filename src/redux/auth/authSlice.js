import axios from "axios";

import { createApi } from "@reduxjs/toolkit/query/react";

import { baseURL } from "api/axiosConfig";
import { Slide, toast } from "react-toastify";

axios.defaults.baseURL = baseURL;

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axios({
        url: baseURL + url,
        method,
        headers,
        params,
        data,
      });

      // if (method === "POST")
      //   toast(result?.data?.message, {
      //     type: result?.data?.success === "1" ? "success" : "error",
      //     transition: Slide,
      //   });

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

export const authSlice = createApi({
  reducerPath: "authQueries",
  baseQuery: axiosBaseQuery({
    baseUrl: baseURL,
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        data,
      }),
    }),

    sendResetPasswordOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        data,
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: "/auth/logout",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendResetPasswordOTPMutation,
  useResetPasswordMutation,
  useLogoutMutation,
} = authSlice;
