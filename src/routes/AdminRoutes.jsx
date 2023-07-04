import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Layout from "Layout";

import Admin from "modules/users/admin/Admin";
import Upload from "modules/users/admin/pages/upload/Upload";
import Teachers from "modules/users/admin/pages/teachers/Teachers";
import Consolidations from "modules/users/admin/pages/consolidations/Consolidations";
import PromoteStudents from "modules/users/admin/pages/promote-students/PromoteStudents";
import ConditionalRoute from "./ConditionalRoute";

import PageNotFound from "modules/404/PageNotFound";

const ADMIN_ROUTES = [
  {
    path: "",
    element: <Admin />,
  },
  {
    path: "upload",
    element: <Upload />,
  },
  {
    path: "approve-or-disapprove-teachers",
    element: <Teachers />,
  },
  {
    path: "consolidations",
    element: <Consolidations />,
  },
  {
    path: "promote-students",
    element: <PromoteStudents />,
  },
];

const AdminRoutes = () => {
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  const userType = useSelector((state) => state?.auth?.user?.user_type);
  return (
    <Routes>
      {ADMIN_ROUTES?.map((route) => (
        <Route
          key={route?.path}
          path={route?.path}
          element={
            <ConditionalRoute
              condition={isAuthenticated && userType === "admin"}
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

export default AdminRoutes;
