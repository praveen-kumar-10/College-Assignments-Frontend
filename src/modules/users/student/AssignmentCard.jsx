import { useNavigate } from "react-router-dom";

const AssignmentCard = ({ assignment }) => {
  const navigate = useNavigate();
  if (assignment.reviewed)
    return (
      <div
        className="assignment__wrapper"
        onClick={() => navigate(`assignment/${assignment.id}`)}
      >
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
        onClick={() => navigate(`assignment/${assignment.id}`)}
      >
        <div
          className="assignment_subject_color_code"
          style={{ background: assignment.color_code }}
        />
        <div className="assignment_subject">
          {assignment.subject_short_code}
        </div>
        <div className="assignment_body">
          <span>{assignment.title}</span>

          <span>Submitted on {getDate(assignment["submission_date"])} </span>
          <span>DueDate {getDate(assignment["due_date"])}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div
        key={assignment.id}
        className="assignment__wrapper"
        onClick={() => navigate(`assignment/${assignment.id}`)}
      >
        <div
          className="assignment_subject_color_code"
          style={{ background: assignment.color_code }}
        />
        <div className="assignment_subject">
          {assignment.subject_short_code}
        </div>
        <div className="assignment_body">
          <span>{assignment.title}</span>
          <span>Due Date - {getDate(assignment.due_date)}</span>
        </div>
      </div>
    );
  }
};

export default AssignmentCard;

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
