import ComponentLoader from "components/ui/ComponentLoader";
import Header from "components/ui/header/Header";
import AssignmentCard from "modules/users/student/AssignmentCard";
import React from "react";
import { Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useGetMyAssignmentsForTeacherQuery } from "redux/users/teacherSlice";

import '../../Teacher.scss'

const MyAssignments = () => {
  const navigate = useNavigate();
  const {
    data: assignmentsResponse,
    isLoading,
    error,
  } = useGetMyAssignmentsForTeacherQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  console.log(assignmentsResponse);

  return (
    <>
      <Helmet>
        <title>Assignments - My Assignments</title>
      </Helmet>
      <div className="container-wrapper teachers-assignments">
        <Header title="My Assignments" search={{ placeholder: "Search..." }} />

        {!isLoading &&
          assignmentsResponse?.data &&
          assignmentsResponse?.data?.length !== 0 && (
            <section>
              {assignmentsResponse && assignmentsResponse?.data && (
                <div className={`assignments__wrapper`}>
                  {Object.entries(assignmentsResponse?.data)?.map(
                    ([title, data]) => (
                      <div
                        className="assignment__wrapper"
                        onClick={() => {
                          navigate(
                            `/teacher/my-assignments/${data?.year}/${data?.branch}/${data?.semester}/${data?.section}/${data?.subject}/${title}/${data?.id}`
                          );
                        }}
                      >
                        <div
                          className="assignment_subject_color_code"
                          style={{ background: data?.subject_color }}
                        />
                        <div className="assignment_subject">
                          {data?.subject_code}
                        </div>
                        <div className="assignment_body">
                          <span>{title}</span>
                          <span>
                            Created on : {getDate(data?.creation_date)}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          )}

        {isLoading && (
          <section style={{ display: "grid", placeItems: "center" }}>
            <Spinner animation="border" variant="primary" />
          </section>
        )}

        {!isLoading &&
          assignmentsResponse?.data &&
          assignmentsResponse?.data?.length === 0 && (
            <section style={{ display: "grid", placeItems: "center" }}>
              <h4>No assignment to show.</h4>
            </section>
          )}
      </div>
    </>
  );
};

export default MyAssignments;

function getDate(dateS) {
  const date = new Date(dateS);
  const months = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // let d = `
  // ${date.getFullYear()}/${months[date.getMonth()]}/${date.getDate()}
  //   `;

  let dt = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  return dt;
}
