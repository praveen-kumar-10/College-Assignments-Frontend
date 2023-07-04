import { useEffect, useState } from "react";

import { ReactComponent as SearchIcon } from "assets/icons/Search.svg";

import Button from "components/ui/button/Button";
import AssignmentCard from "./AssignmentCard";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import AssignmentTeacherCard from "../teacher/pages/my-assignments/AssignmentTeacherCard";

const AssignmentsLayout = ({
  assignments,
  isLoading,
  isHeader = true,
  setShowFeedbackModal,
}) => {
  const userType = useSelector((state) => state?.auth?.user?.user_type);
  const [query, setQuery] = useState("");
  const [subjectColors, setSubjectColors] = useState({});
  const [subjectAssignments, setSubjectAssignments] = useState(assignments);

  useEffect(() => {
    setSubjectAssignments(assignments);

    setSubjectColors(
      assignments.reduce((curr, assignment) => {
        curr[assignment["subject_short_code"]] = assignment["color_code"];
        return curr;
      }, {})
    );
  }, [assignments]);

  useEffect(() => {
    if (query !== "") {
      const tempAssignments = assignments.filter((assignment) =>
        ["title", "subject_short_code"].some((key) =>
          assignment[key].toLowerCase().includes(query.toLowerCase())
        )
      );
      setSubjectAssignments((prev) => tempAssignments);
    } else setSubjectAssignments(assignments);
  }, [assignments, query]);

  const onSubjectClickHandler = (subject) => {
    const filteredAssignments = assignments?.filter(
      (assignment) => assignment.subject_short_code === subject
    );

    if (filteredAssignments) {
      setSubjectAssignments(filteredAssignments);
    }
  };

  // const onChangeQuery = debounce((e) => setQuery(e.target.value), 200);
  const onChangeQuery = (e) => setQuery(e.target.value);

  return (
    <main className="assignments-wrapper">
      {!isLoading && assignments?.length !== 0 && isHeader && (
        <header>
          <div className="header__left">
            <div className="subject_code__wrapper">
              {Object.entries(subjectColors)?.map(([subject, color]) => (
                <div
                  key={subject}
                  className="subject"
                  onClick={() => {
                    onSubjectClickHandler(subject);
                    setQuery("");
                  }}
                >
                  <div
                    className="subject_color_code"
                    style={{
                      background: color,
                    }}
                  />
                  {subject}
                </div>
              ))}
            </div>
          </div>
          <div className="header__right">
            <Button
              className="secondary"
              onClick={() => {
                setSubjectAssignments(assignments);
                setQuery("");
              }}
            >
              Show All
            </Button>
            <div className="search_wrapper">
              <SearchIcon className="search_icon" />
              <input
                type="text"
                className="search_inp"
                onChange={onChangeQuery}
                value={query}
                placeholder="Search..."
              />
            </div>
          </div>
        </header>
      )}

      {!isLoading && subjectAssignments?.length !== 0 && (
        <section>
          {subjectAssignments?.map((assignment) =>
            userType === "student" ? (
              <AssignmentCard key={assignment?.id} assignment={assignment} />
            ) : (
              <AssignmentTeacherCard
                key={assignment?.id}
                assignment={assignment}
                setShowFeedbackModal={setShowFeedbackModal}
              />
            )
          )}
        </section>
      )}

      {isLoading && (
        <section style={{ display: "grid", placeItems: "center" }}>
          <Spinner animation="border" variant="primary" />
        </section>
      )}

      {!isLoading && subjectAssignments?.length === 0 && (
        <section style={{ display: "grid", placeItems: "center" }}>
          <h4>No assignment to show.</h4>
        </section>
      )}
    </main>
  );
};

export default AssignmentsLayout;
