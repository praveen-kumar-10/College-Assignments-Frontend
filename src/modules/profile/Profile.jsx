import Header from "components/ui/header/Header";
import Input from "components/ui/input/Input";
import React from "react";
import { useSelector } from "react-redux";
import { ReactComponent as ProfilePic } from "assets/icons/profile-pic.svg";
import { ReactComponent as EditIcon } from "assets/icons/edit.svg";

import "./Profile.scss";
import { Col, Row } from "react-bootstrap";
import Button from "components/ui/button/Button";

const ADMIN_FIELDS = [
  [
    {
      name: "email",
      label: "Email",
    },
  ],
  [
    {
      name: "first_name",
      label: "First Name",
    },
  ],
  [
    {
      name: "last_name",
      label: "Last Name",
    },
  ],
];

const TEACHER_FIELDS = [
  [
    {
      name: "name",
      label: "Username",
    },
  ],
  [
    {
      name: "email",
      label: "Email",
    },
  ],
  [
    {
      name: "phone",
      label: "Mobile Number",
    },
  ],
  [
    {
      name: "gender",
      label: "Gender",
    },
  ],
  [
    {
      name: "department",
      label: "Department",
    },
  ],
];

const STUDENT_FIELDS = [
  [
    {
      name: "name",
      label: "Username",
    },
  ],
  [
    {
      name: "email",
      label: "Email",
    },
  ],
  [
    {
      name: "roll_no",
      label: "Roll Number",
    },
  ],
  [
    {
      name: "phone",
      label: "Mobile Number",
    },
  ],
  [
    {
      name: "joinedIn",
      label: "Batch",
    },
    {
      name: "currentYear",
      label: "Year",
    },
  ],
  [
    {
      name: "currentBranch",
      label: "Branch",
    },
    {
      name: "currentSemester",
      label: "Semester",
    },
  ],
  [
    {
      name: "currentSection",
      label: "Section",
    },
  ],
];

const Profile = () => {
  const userType = useSelector((state) => state?.auth?.user?.user_type);

  const adminDetails = useSelector((state) => state?.auth?.adminDetails);
  const teacherDetails = useSelector((state) => state?.auth?.teacherDetails);
  const studentDetails = useSelector((state) => state?.auth?.studentDetails);

  const getFields = (fields, state) => {
    return fields?.map((row) => (
      <Row>
        {row?.map((field) => (
          <Col>
            <Input
              {...field}
              disabled
              value={state[field?.name]}
              onChange={() => {}}
            />
          </Col>
        ))}
      </Row>
    ));
  };

  return (
    <div className="container-wrapper profile-container-wrapper">
      <Header
        title="Profile"
        rightChildren={
          <>
            <Button>
              <EditIcon /> Edit
            </Button>
          </>
        }
      />
      <section>
        <form>
          <div className="profile-pic-wrapper">
            <ProfilePic className="profile-pic" />
          </div>
          <div className="fields">
            {userType === "admin" && getFields(ADMIN_FIELDS, adminDetails)}
            {userType === "teacher" &&
              getFields(TEACHER_FIELDS, teacherDetails)}
            {userType === "student" &&
              getFields(STUDENT_FIELDS, studentDetails)}
          </div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
