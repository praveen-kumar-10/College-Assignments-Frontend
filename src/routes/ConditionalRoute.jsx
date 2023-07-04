import React from "react";
import { Navigate } from "react-router-dom";

const ConditionalRoute = ({ condition, redirectTo, children }) => {
  return condition ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

export default ConditionalRoute;
