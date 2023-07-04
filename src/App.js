import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import {
  useGetAdminProfileQuery,
  useGetTeacherProfileQuery,
  useGetStudentProfileQuery,
} from "redux/apiSlice";
import { setAuthDetails } from "redux/auth/authReducer";

import Home from "modules/home/Home";
import LoginD from "modules/auth/Login";
import Register from "modules/auth/Register";
import ForgotPassword from "modules/auth/ForgotPassword";

import PageNotFound from "modules/404/PageNotFound";
import AdminRoutes from "routes/AdminRoutes";
import ConditionalRoute from "routes/ConditionalRoute";
import StudentRoutes from "routes/StudentRoutes";
import TeacherRoutes from "routes/TeacherRoutes";
import Logout from "modules/auth/Logout";

const PUBLIC_ROUTES = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginD />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
];

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  const userType = useSelector((state) => state?.auth?.user?.user_type);

  const [skip, setSkip] = useState({
    admin: true,
    teacher: true,
    student: true,
  });

  const {
    data: adminResponse,
    isLoading: isAdminDetailsLoading,
    // isError: isAdminError,
    // error: adminError,
  } = useGetAdminProfileQuery(
    { admin_id: JSON.parse(localStorage.getItem("user"))?.id },
    { skip: skip?.admin }
  );

  const {
    data: teacherResponse,
    isLoading: isTeacherDetailsLoading,
    // isError: isTeacherError,
    // error: teacherError,
  } = useGetTeacherProfileQuery(
    {
      email: JSON.parse(localStorage.getItem("user"))?.email,
    },
    { skip: skip?.teacher }
  );

  const {
    data: studentResponse,
    isLoading: isSudentDetailsLoading,
    // isError: isStudentError,
    // error: studentError,
  } = useGetStudentProfileQuery(
    {
      email: JSON.parse(localStorage.getItem("user"))?.email,
    },
    { skip: skip?.student }
  );

  useEffect(() => {
    const access = JSON.parse(localStorage.getItem("access"));
    const refresh = JSON.parse(localStorage.getItem("refresh"));
    const user =
      localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
    if (adminResponse?.data || teacherResponse?.data || studentResponse?.data) {
      dispatch(
        setAuthDetails({ isAuthenticated: true, access, refresh, user })
      );
    }
  }, [adminResponse, teacherResponse, studentResponse, dispatch]);

  useEffect(() => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");
    const user =
      localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));

    if (
      access &&
      refresh &&
      user &&
      access !== "" &&
      refresh !== "" &&
      user !== ""
    ) {
      user &&
        user?.user_type &&
        setSkip((prev) => ({ ...prev, [user?.user_type]: false }));
    } else {
      localStorage.clear();
      setSkip((prev) => ({
        admin: true,
        teacher: true,
        student: true,
      }));
      // navigate("/login");
    }
  }, []);

  console.table({
    isAdminDetailsLoading,
    isSudentDetailsLoading,
    isTeacherDetailsLoading,
    isAuthenticated,
    userType,
    location: window.location.pathname,
    isLoggedout: typeof localStorage.getItem("isLoggedout"),
  });

  if (
    isAdminDetailsLoading ||
    isSudentDetailsLoading ||
    isTeacherDetailsLoading
  )
    return <Spinner />;

  if (!isAuthenticated && !userType) {
    return (
      <Routes>
        {PUBLIC_ROUTES?.map((route) => (
          <Route
            key={route?.path}
            path={route?.path}
            element={
              <ConditionalRoute
                condition={!isAuthenticated}
                redirectTo="/admin"
              >
                {route?.element}
              </ConditionalRoute>
            }
          />
        ))}
        {/* {JSON.parse(localStorage.getItem("isLoggedout")) && ( */}
        <Route path="/logout" element={<Logout />} />
        {/* )} */}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (isAuthenticated && userType)
    return (
      <Routes>
        {/* <Route path="/logout" element={<Logout />} /> */}

        {PUBLIC_ROUTES?.map((route) => (
          <Route
            key={route?.path}
            path={route?.path}
            element={
              <Navigate
                to={
                  userType === "admin"
                    ? "/admin"
                    : userType === "student"
                    ? "/student"
                    : "/teacher"
                }
              />
            }
          />
        ))}

        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/teacher/*" element={<TeacherRoutes />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    );
};

export default App;
