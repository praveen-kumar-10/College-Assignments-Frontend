import Modal from "components/ui/modal/Modal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

const AssignmentTeacherCard = ({ assignment, setShowFeedbackModal }) => {
  const navigate = useNavigate();

  if (assignment.reviewed)
    return (
      <div className="assignment__wrapper">
        <div
          className="assignment_subject_color_code"
          style={{ background: assignment.color_code }}
        />
        <div className="assignment_subject">
          {assignment.subject_short_code}
        </div>
        <div className="assignment_body">
          <span>{assignment.title}</span>
          <span>Marks : {assignment.marks}/10</span>
        </div>
      </div>
    );
  else if (assignment.submitted) {
    return (
      <div
        key={assignment.id}
        className="assignment__wrapper"
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          if (assignment?.submitted && assignment?.marks) {
            return toast("You already awarded this student", {
              type: "info",
              transition: Slide,
            });
          }
          setShowFeedbackModal({
            show: true,
            ...assignment,
          });
        }}
      >
        <div
          className="assignment_subject_color_code"
          style={{ background: assignment.color_code }}
        />
        <div className="assignment_subject">
          {/* {assignment.subject_short_code} */}
          {assignment.marks ? assignment?.marks + " / 10" : "-"}
        </div>
        <div className="assignment_body">
          <span>{assignment.title}</span>
          <span>Submitted on {getDate(assignment["submission_date"])} </span>
          {/* {assignment?.due_date && (
            <span>Due Date - {getDate(assignment.due_date)}</span>
          )} */}
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div
          key={assignment.id}
          className="assignment__wrapper"
          style={{
            cursor: assignment?.submitted ? "pointer" : "default",
          }}
        >
          <div
            className="assignment_subject_color_code"
            style={{ background: assignment.color_code }}
          />
          <div className="assignment_subject">
            {assignment.marks ? assignment?.marks : "-"}
          </div>
          <div className="assignment_body">
            <span>{assignment.title}</span>
            {/* {assignment?.marks && <span>Marks : {assignment.marks}/10</span>} */}

            {assignment?.due_date && (
              <span>Due Date - {getDate(assignment.due_date)}</span>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default AssignmentTeacherCard;

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
