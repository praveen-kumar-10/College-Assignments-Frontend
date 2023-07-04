import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Layout from "Layout";
import ConditionalRoute from "./ConditionalRoute";

import Teacher from "modules/users/teacher/Teacher";
import ShowSaved from "modules/users/teacher/pages/show-saved/ShowSaved";
import MyAssignments from "modules/users/teacher/pages/my-assignments/MyAssignments";
import Consolidations from "modules/users/teacher/pages/consolidations/Consolidations";
import CreateAssignment from "modules/users/teacher/pages/create-assignment/CreateAssignment";
import TypeAssignment from "modules/users/teacher/pages/create-assignment/TypeAssignment";

import PageNotFound from "modules/404/PageNotFound";
import Assignment from "modules/users/teacher/pages/my-assignments/Assignment";

const TEACHER_ROUTES = [
  {
    path: "",
    element: <Teacher />,
  },
  {
    path: "consolidations",
    element: <Consolidations />,
  },
  {
    path: "my-assignments",
    element: <MyAssignments />,
  },
  {
    path: "/my-assignments/:year/:branch/:semester/:section/:subject/:assignment_title/:assignment_id",
    element: <Assignment />,
  },
  {
    path: "show-saved",
    element: <ShowSaved />,
  },
  {
    path: "create-assignment",
    element: <CreateAssignment />,
  },
  {
    path: "create-assignment/type",
    element: <TypeAssignment />,
  },
];

const TeacherRoutes = () => {
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  const userType = useSelector((state) => state?.auth?.user?.user_type);
  return (
    <Routes>
      {TEACHER_ROUTES?.map((route) => (
        <Route
          key={route?.path}
          path={route?.path}
          element={
            <ConditionalRoute
              condition={isAuthenticated && userType === "teacher"}
              redirectTo="/login"
            >
              <Layout>{route?.element}</Layout>
            </ConditionalRoute>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default TeacherRoutes;
