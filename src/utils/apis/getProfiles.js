import { baseURL } from "api/axiosConfig";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuthDetails } from "redux/auth/authReducer";

export const useGetAdminProfile = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();
  const getAdminProfile = async (params) => {
    setIsLoading(true);
    const res = await axios({
      url: baseURL + "/auth/admin-profile",
      method: "GET",
      headers: {
        Authorization: `bearer ${JSON.parse(localStorage.getItem("access"))}`,
      },
      params,
    });

    setIsLoading(false);

    if (res?.data?.success == 1) {
      const access = JSON.parse(localStorage.getItem("access"));
      const refresh = JSON.parse(localStorage.getItem("refresh"));
      const user =
        localStorage.getItem("user") &&
        JSON.parse(localStorage.getItem("user"));
      dispatch(
        setAuthDetails({
          isAuthenticated: true,
          access,
          refresh,
          user,
          adminDetails: res?.data?.data,
        })
      );
    }

    return res;
  };

  return [getAdminProfile, isLoading];
};

export const useGetTeacherProfile = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState();

  const getTeacherProfile = async (params) => {
    setIsLoading(true);

    const res = await axios({
      url: baseURL + "/auth/teacher-profile",
      method: "GET",
      headers: {
        Authorization: `bearer ${JSON.parse(localStorage.getItem("access"))}`,
      },
      params,
    });

    setIsLoading(false);

    if (res?.data?.success == 1) {
      const access = JSON.parse(localStorage.getItem("access"));
      const refresh = JSON.parse(localStorage.getItem("refresh"));
      const user =
        localStorage.getItem("user") &&
        JSON.parse(localStorage.getItem("user"));
      dispatch(
        setAuthDetails({
          isAuthenticated: true,
          access,
          refresh,
          user,
          teacherDetails: res?.data?.data,
        })
      );
    }

    return res;
  };

  return [getTeacherProfile, isLoading];
};

export const useGetStudentProfile = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState();

  const getStudentProfile = async (params) => {
    setIsLoading(true);

    const res = await axios({
      url: baseURL + "/auth/student-profile",
      method: "GET",
      headers: {
        Authorization: `bearer ${JSON.parse(localStorage.getItem("access"))}`,
      },
      params,
    });
    setIsLoading(false);

    if (res?.data?.success == 1) {
      const access = JSON.parse(localStorage.getItem("access"));
      const refresh = JSON.parse(localStorage.getItem("refresh"));
      const user =
        localStorage.getItem("user") &&
        JSON.parse(localStorage.getItem("user"));
      dispatch(
        setAuthDetails({
          isAuthenticated: true,
          access,
          refresh,
          user,
          studentDetails: res?.data?.data,
        })
      );
    }

    return res;
  };

  return [getStudentProfile, isLoading];
};
