import axios from "axios";
import Button from "components/ui/button/Button";
import Header from "components/ui/header/Header";
import Input from "components/ui/input/Input";
import Modal from "components/ui/modal/Modal";
import AssignmentsLayout from "modules/users/student/AssignmentsLayout";
import React, { useEffect, useRef, useState } from "react";
import { Nav, Tab } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  useAssignMarksMutation,
  useExtendDueDateMutation,
  useGetClassAssignmentsBasedOnTitleQuery,
} from "redux/users/teacherSlice";

export const dates = {
  0: "01",
  1: "02",
  2: "03",
  3: "04",
  4: "05",
  5: "06",
  6: "07",
  7: "08",
  8: "09",
  9: "10",
  10: "11",
  11: "12",
};

const TABS = [
  {
    eventKey: "",
    title: "All",
  },
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

const Assignment = () => {
  const submitButtonRef = useRef(null);

  const {
    year,
    branch,
    semester,
    section,
    subject,
    assignment_title,
    assignment_id,
  } = useParams();

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [remarks, setRemarks] = useState({
    marks: "",
    remarks: "",
  });

  const [showFeedbackModal, setShowFeedbackModal] = useState({
    show: false,
  });

  const [showExtendDataModal, setShowExtendModal] = useState({
    show: false,
  });
  const [extendDate, setExtendDate] = useState("");

  const {
    data: assignmentsResponse,
    isLoading,
    error,
  } = useGetClassAssignmentsBasedOnTitleQuery({
    year,
    branch,
    semester,
    section,
    subject,
    assignment_title,
    assignment_id,
  });

  const [assignMarks, { isLoading: isMarksAssigning }] =
    useAssignMarksMutation();

  const [extendDueDate, { isLoading: isDateExtending }] =
    useExtendDueDateMutation();

  useEffect(() => {
    if (assignmentsResponse?.data) setData(assignmentsResponse?.data);
  }, [assignmentsResponse]);

  const handleFilter = (val) => {
    setFilter(val);
  };

  const handleExtendDueDate = async function (event) {
    event.preventDefault();

    let tdueDate = new Date(extendDate);
    let extDate = tdueDate.toString().split(" ").slice(0, 6).join(" ");

    extendDueDate({
      assignmentId: assignment_id,
      new_date: extDate,
    }).then((res) => {
      if (res?.data?.success == 1) {
        setExtendDate("");
        setShowExtendModal({ show: false });
      }
    });
  };

  const downloadReport = function () {
    axios
      .get("http://localhost:8000/api/get-class-assignments-title-report", {
        params: {
          year: 2019,
          edu_year: 4,
          branch,
          semester,
          section,
          subject,
          assignment_title,
          assignment_id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("access"))}`,
        },
        responseType: "blob",
      })
      .then((response) => {
        const href = URL.createObjectURL(response.data);
        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute(
          "download",
          year +
            "-" +
            branch +
            "-" +
            section +
            "-" +
            subject +
            "-" +
            assignment_title +
            ".xls"
        ); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
  };

  const submitHandler = function (event) {
    event.preventDefault();

    assignMarks({
      marks: remarks?.marks,
      feedback: remarks.remarks,
      assignmentId: showFeedbackModal.id,
      studentId: showFeedbackModal["student_id"],
    })
      .then((res) => {
        if (res?.data?.success == 1) {
          setShowFeedbackModal(false);
          setRemarks((prev) => ({ marks: "", remarks: "" }));
        }
      })
      .catch((err) => {});
  };

  console.log(assignmentsResponse);
  return (
    <>
      <Helmet>
        <title>Assignments | {assignment_title}</title>
      </Helmet>
      <Modal
        size=""
        show={showFeedbackModal?.show}
        onHide={() => setShowFeedbackModal({ show: false })}
        title={showFeedbackModal?.student_roll_no}
        body={
          <>
            <form onSubmit={submitHandler}>
              <Input
                name="marks"
                label="Marks"
                type="number"
                min={0}
                max={10}
                required
                value={remarks?.marks}
                onChange={(e) =>
                  setRemarks((prev) => ({ ...prev, marks: e.target.value }))
                }
              />
              <Input
                as="textarea"
                name="remarks"
                label="Remarks"
                placeholder="Enter your remarks here..."
                required
                value={remarks?.remarks}
                onChange={(e) =>
                  setRemarks((prev) => ({ ...prev, remarks: e.target.value }))
                }
              />
              <button
                type="submit"
                style={{ display: "none" }}
                ref={submitButtonRef}
              ></button>
            </form>
          </>
        }
        footerLeft={
          <>
            <a
              href={showFeedbackModal?.answer_link}
              target="_blank"
              rel="noreferrer"
              className="btn secondary"
              role="button"
            >
              Preview Answer
            </a>
          </>
        }
        footerRight={
          <>
            <Button
              onClick={() => {
                submitButtonRef.current.click();
              }}
              isLoading={isMarksAssigning}
            >
              Submit
            </Button>
          </>
        }
      />
      <Modal
        show={showExtendDataModal?.show}
        onHide={() => setShowExtendModal({ show: false })}
        title="Extend Due Date"
        body={
          <form onSubmit={handleExtendDueDate}>
            <Input
              type="date"
              name="due_date"
              label="Extend Date"
              min={(() => {
                let d = new Date();
                let min_date =
                  d.getFullYear() +
                  "-" +
                  dates[d.getMonth()] +
                  "-" +
                  (d.getUTCDate() < 10 ? "0" + d.getUTCDate() : d.getUTCDate());
                // console.log(min_date);
                return min_date;
              })()}
              value={extendDate}
              onChange={(event) => setExtendDate(event.target.value)}
              required
            />
            <button
              type="submit"
              style={{ display: "none" }}
              ref={submitButtonRef}
            ></button>
          </form>
        }
        footerRight={
          <>
            <Button
              onClick={() => {
                submitButtonRef.current.click();
              }}
            >
              Submit
            </Button>
          </>
        }
      />
      <div className="container-wrapper teacher-assignments-container-wrapper">
        <Header
          backBtn
          url="/teacher/my-assignments"
          title={assignment_title}
          subTitle={`${subject} Due Data: ${
            assignmentsResponse?.data?.length > 0 &&
            getDate(assignmentsResponse?.data[0]["due_date"])
          }
          `}
          rightChildren={
            <>
              <Button onClick={() => setShowExtendModal({ show: true })}>
                Extend Due Date
              </Button>
              <Button onClick={downloadReport}>Download Report</Button>
            </>
          }
        />

        <section>
          <div className="tab-container">
            <Tab.Container id="tabs" defaultActiveKey={filter}>
              <Nav variant="pills">
                {TABS?.map((tab) => (
                  <Nav.Item
                    key={tab?.eventKey}
                    className={`nav-link ${tab?.eventKey + "-item"} ${
                      tab?.eventKey === filter ? `active ` : ""
                    }`}
                    onClick={() => handleFilter(tab?.eventKey)}
                  >
                    <div className={tab?.eventKey} />
                    {tab?.title}
                  </Nav.Item>
                ))}
              </Nav>
              <Tab.Content>
                {TABS?.map((tab) => (
                  <Tab.Pane key={tab?.eventKey} eventKey={tab?.eventKey}>
                    {!isLoading && (
                      <AssignmentsLayout
                        setShowFeedbackModal={setShowFeedbackModal}
                        isHeader={false}
                        assignments={data
                          ?.filter((item) => {
                            if (filter === "") return true;
                            else return item.status === filter;
                          })
                          ?.map((item) => ({
                            ...item,
                            title:
                              item?.student_name +
                              "(" +
                              item?.student_roll_no +
                              ")",
                            color_code: item?.color,
                          }))}
                        isLoading={isLoading}
                      />
                    )}
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

export default Assignment;

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
