import React from "react";
import Dashboard from "../Dashboard";

import "./Teacher.scss";

const CARDS = [
  [
    {
      title: "Create Assignment",
      details: ["Assign assignment to students"],
      path: "/teacher/create-assignment",
    },
    {
      title: "My Assignments",
      details: ["See your assigned assignments"],
      path: "/teacher/my-assignments",
    },
  ],
  [
    {
      title: "Consolidations",
      details: ["Check the marks of a particular student"],
      path: "/teacher/consolidations",
    },
    {
      title: "Show Saved",
      details: ["Shows the draft assignment"],
      path: "/teacher/show-saved",
    },
  ],
];

const Teacher = () => {
  return <Dashboard documentTitle="Teacher" cards={CARDS} />;
};

export default Teacher;
