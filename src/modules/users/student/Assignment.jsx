import Header from "components/ui/header/Header";
import { Helmet } from "react-helmet";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ReactComponent as EyeIcon } from "assets/icons/eye.svg";
import { ReactComponent as UploadIcon } from "assets/icons/upload-cloud.svg";
import { ReactComponent as CongraluationsIcon } from "assets/congratualtions.svg";
import badgeIcon from "assets/icons/star-medal.png";

import {
  useGetStudentAssignmentQuery,
  useUploadAssignmentMutation,
} from "redux/users/studentSlice";

import { setCurrentStudentAssignmentsTab, setIsLoading } from "redux/uiReducer";

import { default as FileUploader } from "components/ui/upload/Upload";
import Button from "components/ui/button/Button";
import Footer from "components/ui/footer/Footer";
import Modal from "components/ui/modal/Modal";

import DocumentViewerComponent from "../../../components/PdfViewerComponent";
import { useDispatch } from "react-redux";
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
//     title: "Assignment-2 (Submitted)",
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
// ];

// const assignmentResponse = {
//   data: DUMMY_ASSIGNMENTS?.filter((item) => item?.id === parseInt(id))[0],
// };

const Assignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [fileDataURL, setFileDataURL] = useState(null);
  const [showPreviewModalShow, setShowPreviewModalShow] = useState(false);

  const {
    data: assignmentResponse,
    isLoading,
    isError,
    error,
  } = useGetStudentAssignmentQuery(id, { refetchOnMountOrArgChange: true });

  const [uploadAssignment, { isLoading: isAssignmentUploading }] =
    useUploadAssignmentMutation();

  useEffect(() => {
    dispatch(setIsLoading(isAssignmentUploading));
  }, [dispatch, isAssignmentUploading]);

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result);
        }
      };
      fileReader.readAsDataURL(file);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [file]);

  const handleChange = (file) => setFile(file);

  const onUploadAssignment = () => {
    const fd = new FormData();

    let date = Date();
    date = date.split(" ").slice(0, 6).join(" ");

    fd.append("file", file);
    fd.append("assignmentId", parseInt(id));
    fd.append("date_submitted", date);

    uploadAssignment(fd).then((res) => {
      if (res?.data?.success === "1") {
        navigate("/student");
        dispatch(setCurrentStudentAssignmentsTab("submitted"));
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>
          {`Assignments | ${
            assignmentResponse?.data && assignmentResponse?.data?.title
          }`}
        </title>
      </Helmet>
      <Modal
        size="xl"
        show={showPreviewModalShow}
        className="document-preview-modal"
        onHide={() => setShowPreviewModalShow(false)}
        title={`Preview Assignment - ${file?.name}`}
        body={
          <>
            {fileDataURL && <DocumentViewerComponent document={fileDataURL} />}
            {/* {fileDataURL && <PdfViewerComponent document={fileDataURL} />} */}
          </>
        }
        footerRight={
          <>
            <Button className="" onClick={() => setShowPreviewModalShow(false)}>
              Close
            </Button>
          </>
        }
      />
      <div className="container-wrapper assignment-wrapper">
        <Header
          backBtn
          url="/student"
          title={assignmentResponse?.data && assignmentResponse?.data?.title}
          subTitle={
            assignmentResponse?.data &&
            assignmentResponse?.data?.subject_short_code +
              " - " +
              assignmentResponse?.data?.subject_full_code
          }
          subTitleStyles={{
            background: assignmentResponse?.data
              ? assignmentResponse?.data?.color_code
              : "",
            color: "#fff",
          }}
          rightChildren={
            <>
              <a
                role="button"
                className="btn btn-primary"
                href={assignmentResponse?.data?.assignment_link}
                target="_blank"
                rel="noreferrer"
              >
                <EyeIcon /> Preview Assignment Questions
              </a>
            </>
          }
        />
        {!assignmentResponse?.data?.submitted &&
          !assignmentResponse?.data?.reviewed && (
            <PendingAssignment
              {...{
                handleChange,
                file,
                onUploadAssignment,
                setShowPreviewModalShow,
              }}
            />
          )}
        {assignmentResponse?.data?.submitted &&
          !assignmentResponse?.data?.reviewed && <SubmittedAssignment />}

        {assignmentResponse?.data?.submitted &&
          assignmentResponse?.data?.reviewed && (
            <ReviewedAssignment
              marks={assignmentResponse?.data?.marks}
              feedback={assignmentResponse?.data?.feedback}
            />
          )}

        {!assignmentResponse?.data?.submitted &&
          !assignmentResponse?.data?.reviewed && (
            <Footer
              rightChildren={
                <>
                  <Button
                    disabled={!file}
                    isLoading={isAssignmentUploading}
                    onClick={() => onUploadAssignment()}
                  >
                    <UploadIcon /> Upload Assigment
                  </Button>
                </>
              }
            />
          )}
      </div>
    </>
  );
};

export default Assignment;

const PendingAssignment = ({
  handleChange,
  file,
  onUploadAssignment,
  setShowPreviewModalShow,
}) => {
  return (
    <section>
      <FileUploader
        {...{ handleChange, fileTypes: ["PDF", "DOC", "DOCX"] }}
        file={file}
      />

      {file && (
        <Button onClick={() => setShowPreviewModalShow(true)}>
          <EyeIcon /> Preview Assignment
        </Button>
      )}
    </section>
  );
};

const SubmittedAssignment = () => {
  return (
    <section style={{ display: "grid", placeItems: "center" }}>
      <h4 className="text-center" style={{ lineHeight: "3rem", width: "60%" }}>
        You have submitted the assignment and will receive the update as soon as
        the teacher reviews your assignment
      </h4>
    </section>
  );
};

const ReviewedAssignment = ({ marks, feedback }) => {
  return (
    <section className="reviewed-assignment">
      <div className="wrapper">
        <div className="top">
          <div className="bg">
            <CongraluationsIcon />
          </div>
        </div>
        <img src={badgeIcon} alt="" />
        <div className="bottom">
          <div className="content">
            <h1>Congratulations</h1>
            <h1 className="marks">{marks}/10</h1>
            <p>You did a great job in the assignment</p>
          </div>
        </div>
      </div>
      {/* <div className="text-white text-center">
        <h4 className="m-2">You have scored {marks}/10</h4>

        {feedback ? (
          <p>{feedback}</p>
        ) : (
          <p>Your teacher haven't posted any feedback for you</p>
        )}
      </div> */}
    </section>
  );
};
