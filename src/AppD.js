import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Home from "modules/home/Home";
import LoginD from "modules/auth/Login";
import Register from "modules/auth/Register";
import ForgotPassword from "modules/auth/ForgotPassword";
import AccessDenied from "modules/auth/AccessDenied";
import PageNotFound from "modules/404/PageNotFound";
import AdminRoutes from "routes/AdminRoutes";
import ConditionalRoute from "routes/ConditionalRoute";
import StudentRoutes from "routes/StudentRoutes";
import TeacherRoutes from "routes/TeacherRoutes";
import Logout from "modules/auth/Logout";
import {
  useGetAdminProfile,
  useGetStudentProfile,
  useGetTeacherProfile,
} from "utils/apis/getProfiles";
import { setIsLoading } from "redux/uiReducer";
import Profile from "modules/profile/Profile";
import Layout from "Layout";

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

  const [getAdminProfile, isAdminDetailsLoading] = useGetAdminProfile();
  const [getStudentProfile, isSudentDetailsLoading] = useGetStudentProfile();
  const [getTeacherProfile, isTeacherDetailsLoading] = useGetTeacherProfile();

  const fetchProfile = (user) => {
    let email = user?.email;
    switch (user?.user_type) {
      case "admin":
        getAdminProfile({ admin_id: user?.id });
        break;
      case "teacher":
        getTeacherProfile({ email });
        break;
      case "student":
        getStudentProfile({ email });
        break;
      default:
        break;
    }
  };

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
      user &&
      user?.user_type
    ) {
      fetchProfile(user);
    } else {
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    dispatch(
      setIsLoading(
        isAdminDetailsLoading ||
          isSudentDetailsLoading ||
          isTeacherDetailsLoading
      )
    );
  }, [
    dispatch,
    isAdminDetailsLoading,
    isSudentDetailsLoading,
    isTeacherDetailsLoading,
  ]);

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

        <Route path="/access-denied" element={<AccessDenied />} />

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

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    );
};

export default App;
