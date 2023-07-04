import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { Nav, Tab } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentStudentAssignmentsTab } from "redux/uiReducer";
import { useGetStudentAssignmentsQuery } from "redux/users/studentSlice";

import Header from "components/ui/header/Header";

import "./Student.scss";
import AssignmentsLayout from "./AssignmentsLayout";
import { Helmet } from "react-helmet";
import Modal from "components/ui/modal/Modal";

// const DUMMY_ASSIGNMENTS = [
//   {
//     id: 1,
//     title: "Assignment 1 (Pending)",
//     assignmentLink:
//       "https://firebasestorage.googleapis.com/v0/b/python-2c704.appspot.com/o/assignments%2Ftitle1666024104928602307?alt=media&token=788986f0-df3e-440e-8712-03867a8c9ac1",
//     datePosted: "2022-10-15T00:35:14Z",
//     due_date: "2022-10-14T00:35:14Z",
//     assignedBy: {
//       teacherId: 1,
//       teacherName: "teacher1",
//     },
//     marks: null,
//     reviewed: false,
//     submitted: false,
//     answerlink: null,
//     subject_full_code: "Subj1",
//     subject_short_code: "S1",
//     submissionDate: null,
//     color_code: "#FF7A00",
//   },
//   {
//     id: 2,
//     title: "Assignment-2 (Submiited)",
//     assignmentLink:
//       "https://firebasestorage.googleapis.com/v0/b/python-2c704.appspot.com/o/assignments%2Ftitle1666024104928602307?alt=media&token=788986f0-df3e-440e-8712-03867a8c9ac1",
//     datePosted: "2022-10-15T00:35:14Z",
//     due_date: "2022-10-14T00:35:14Z",
//     assignedBy: {
//       teacherId: 2,
//       teacherName: "teacher2",
//     },
//     marks: null,
//     reviewed: false,
//     submitted: true,
//     answerlink:
//       "https://firebasestorage.googleapis.com/v0/b/python-2c704.appspot.com/o/assignments%2Ftitle1666024104928602307?alt=media&token=788986f0-df3e-440e-8712-03867a8c9ac1",
//     subject_full_code: "Subj2",
//     subject_short_code: "S2",
//     submissionDate: "2022-10-18T04:25:08Z",
//     color_code: "#FF7A00",
//   },
//   {
//     id: 3,
//     title: "Assignment-3 (Reviewed & Submitted)",
//     assignmentLink:
//       "https://firebasestorage.googleapis.com/v0/b/python-2c704.appspot.com/o/assignments%2Ftitle1666024104928602307?alt=media&token=788986f0-df3e-440e-8712-03867a8c9ac1",
//     datePosted: "2022-10-15T00:35:14Z",
//     due_date: "2022-10-14T00:35:14Z",
//     assignedBy: {
//       teacherId: 1,
//       teacherName: "teacher1",
//     },
//     marks: 9,
//     reviewed: true,
//     submitted: true,
//     answerlink:
//       "https://firebasestorage.googleapis.com/v0/b/python-2c704.appspot.com/o/assignments%2FSubj14CSEC%2FCream%20and%20Green%20Creative%20Resume.pdf1666027691271191341?alt=media&token=f7a25d15-3701-4675-9c82-e811d41b39da",
//     subject_full_code: "Subj3",
//     subject_short_code: "S3",
//     submissionDate: "2022-10-18T04:25:08Z",
//     color_code: "#FF7A00",
//     feedback: null,
//   },
//   {
//     id: 4,
//     title: "Assignment 4 (Pending)",
//     assignmentLink:
//       "https://firebasestorage.googleapis.com/v0/b/python-2c704.appspot.com/o/assignments%2Ftitle1666024104928602307?alt=media&token=788986f0-df3e-440e-8712-03867a8c9ac1",
//     datePosted: "2022-10-15T00:35:14Z",
//     due_date: "2022-10-14T00:35:14Z",
//     assignedBy: {
//       teacherId: 1,
//       teacherName: "teacher1",
//     },
//     marks: null,
//     reviewed: false,
//     submitted: false,
//     answerlink: null,
//     subject_full_code: "Subj2",
//     subject_short_code: "S2",
//     submissionDate: null,
//     color_code: "#FF7A99",
//   },
// ];

const TABS = [
 
  {
    eventKey: "pending",
    title: "Pending Assignments",
  },
  {
    eventKey: "submitted",
    title: "Submitted Assignments",
  },
  {
    eventKey: "reviewed",
    title: "Reviewed Assignments",
  },
];

// const studentAssignmentsResponse = { data: DUMMY_ASSIGNMENTS };

const Student = () => {
  const dispatch = useDispatch();
  const currentTab = useSelector(
    (state) => state?.ui?.currentStudentAssignmentsTab
  );

  const [assignments, setAssignments] = useState({
    pending: [],
    submitted: [],
    reviewed: [],
  });
  const [query, setQuery] = useState("");

  const { pending, submitted, reviewed } = assignments;

  const {
    data: studentAssignmentsResponse,
    isFetching: isLoading,
    isError,
    error,
  } = useGetStudentAssignmentsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (studentAssignmentsResponse?.data) {
      const data = studentAssignmentsResponse?.data;

      let submitted = data?.filter(
        (assignment) => assignment?.submitted && !assignment?.reviewed
      );

      let reviewed = data?.filter(
        (assignment) => assignment?.reviewed && assignment?.submitted
      );

      let pending = data?.filter(
        (assignment) => !assignment?.submitted && !assignment?.reviewed
      );

      setAssignments((prev) => ({ ...prev, submitted, reviewed, pending }));
    }
  }, [studentAssignmentsResponse]);

  const onChangeQuery = debounce((e) => setQuery(e.target.value), 200);

  return (
    <>
      <Helmet>
        <title>Assignments | Students</title>
      </Helmet>

      <div className="container-wrapper student-dashboard-container-wrapper">
        <Header
          title="Assignments"
          // search={{
          //   query,
          //   onChange: onChangeQuery,
          //   placeholder: "Search...",
          // }}
        />
        <section>
          <div className="tab-container">
            <Tab.Container id="tabs">
              <Nav variant="pills">
                {TABS?.map((tab) => (
                  <Nav.Item
                    key={tab?.eventKey}
                    className={`nav-link ${tab?.eventKey + "-item"} ${
                      tab?.eventKey === currentTab ? `active ` : ""
                    }`}
                    onClick={() =>
                      dispatch(setCurrentStudentAssignmentsTab(tab?.eventKey))
                    }
                  >
                    <div className={tab?.eventKey} />
                    {tab?.title}
                  </Nav.Item>
                ))}
              </Nav>
              <Tab.Content>
                {TABS?.map((tab) => (
                  <Tab.Pane
                    key={tab?.eventKey}
                    className={
                      tab?.eventKey === currentTab ? `active show` : ""
                    }
                    eventKey={tab?.eventKey}
                  >
                    <AssignmentsLayout
                      assignments={assignments[tab?.eventKey]}
                      isLoading={isLoading}
                      // isLoading={true}
                    />
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Tab.Container>
          </div>
        </section>
      </div>
    </>
  );
};

export default Student;

// return <Dashboard documentTitle="Student" cards={CARDS} />;

// const CARDS = [
//   [
//     {
//       title: "Pending Assignments",
//       details: ["Preview Teachers", "Approve/Disapprove Teacher's"],
//       path: "/student/pending-assignments",
//     },
//     {
//       title: "Submitted Assignments",
//       details: [
//         "Upload details of Students",
//         "Upload Subject Details of a Classroom",
//       ],
//       path: "/student/submitted-assignments",
//     },
//   ],
//   [
//     {
//       title: "Reviewed Assignments",
//       details: ["Promote Students to next semester"],
//       path: "/student/reviewed-assignments",
//     },
//   ],
// ];
