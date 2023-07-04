import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Layout from "Layout";
import Student from "modules/users/student/Student";
import Assignment from "modules/users/student/Assignment";
import ConditionalRoute from "./ConditionalRoute";

const STUDENT_ROUTES = [
  {
    path: "",
    element: <Student />,
  },
  {
    path: "assignment/:id",
    element: <Assignment />,
  },
];

const StudentRoutes = () => {
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  const userType = useSelector((state) => state?.auth?.user?.user_type);
  return (
    <Routes>
      {STUDENT_ROUTES?.map((route) => (
        <Route
          key={route?.path}
          path={route?.path}
          element={
            <ConditionalRoute
              condition={isAuthenticated && userType === "student"}
              redirectTo="/login"
            >
              <Layout>{route?.element}</Layout>
            </ConditionalRoute>
          }
        />
      ))}
    </Routes>
  );
};

export default StudentRoutes;
