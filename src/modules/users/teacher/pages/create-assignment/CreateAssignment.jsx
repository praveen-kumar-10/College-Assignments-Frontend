import React, { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";

import Input from "components/ui/input/Input";
import Select from "components/ui/input/Select";
import Button from "components/ui/button/Button";
import Footer from "components/ui/footer/Footer";
import Header from "components/ui/header/Header";
import RadioInput from "components/ui/input/RadioInput";
import { default as FileUploader } from "components/ui/upload/Upload";
import {
  useCreateAssignmentMutation,
  useGetBranchesByYearQuery,
  useGetSectionsByBranchYearQuery,
  useGetSubjectByBranchYearSectionSemQuery,
} from "redux/users/teacherSlice";
import { useDispatch } from "react-redux";
import { setIsLoading } from "redux/uiReducer";
import { Slide, toast } from "react-toastify";

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

const INITIAL_STATE = {
  title: "",
  due_date: "",
  year: "",
  edu_year: "",
  branch: "",
  section: "",
  semester: "",
  subject: "",
  upload_type: "",
  date: "",
};

const CreateAssignment = () => {
  const dispatch = useDispatch();
  const submitBtnRef = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({ ...INITIAL_STATE, upload_type: "" });

  const [skip, setSkip] = useState({
    branches: true,
    sections: true,
    subjects: true,
  });

  const {
    data: branchesResponse,
    isLoading: isBranchesLoading,
    error: branchesError,
  } = useGetBranchesByYearQuery(
    {
      edu_year: formData?.edu_year,
      year: formData?.year,
    },
    {
      skip: skip?.branches,
    }
  );

  const { data: sectionsResponse, isLoading: isSectionsLoading } =
    useGetSectionsByBranchYearQuery(
      {
        edu_year: formData?.edu_year,
        branch: formData?.branch,
        year: formData?.year,
      },
      { skip: skip?.sections }
    );

  const { data: subjectsResponse, isLoading: isSubjectsLoading } =
    useGetSubjectByBranchYearSectionSemQuery(
      {
        edu_year: formData?.edu_year,
        branch: formData?.branch,
        semester: formData?.semester,
        section: formData?.section,
        year: formData?.year,
      },
      { skip: skip?.subjects }
    );

  const [createAssignment, { isLoading: isAssignmentCreating }] =
    useCreateAssignmentMutation();

  useEffect(() => {
    dispatch(
      setIsLoading(
        isBranchesLoading ||
          isSubjectsLoading ||
          isSectionsLoading ||
          isAssignmentCreating
      )
    );
  }, [
    dispatch,
    isBranchesLoading,
    isSubjectsLoading,
    isSectionsLoading,
    isAssignmentCreating,
  ]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    let otherData = {};
    let errs = { ...errors };
    const { year, edu_year, branch, section, semester, subject, upload_type } =
      formData;

    switch (name) {
      case "year":
        otherData = {
          ...otherData,
          edu_year: "",
          branch: "",
          section: "",
          semester: "",
          subject: "",
          upload_type: "",
        };
        break;
      case "edu_year":
        otherData = {
          ...otherData,
          branch: "",
          section: "",
          semester: "",
          subject: "",
          upload_type: "",
        };
        value && value !== "" && year && year !== ""
          ? setSkip((prev) => ({ ...prev, branches: false }))
          : setSkip((prev) => ({ ...prev, branches: true }));
        break;
      case "branch":
        otherData = {
          ...otherData,
          section: "",
          semester: "",
          subject: "",
          upload_type: "",
        };
        value &&
        value !== "" &&
        year &&
        year !== "" &&
        edu_year &&
        edu_year !== ""
          ? setSkip((prev) => ({ ...prev, sections: false }))
          : setSkip((prev) => ({ ...prev, sections: true }));
        break;
      case "section":
        otherData = {
          ...otherData,
          semester: "",
          subject: "",
          upload_type: "",
        };
        break;
      case "semester":
        otherData = {
          ...otherData,
          subject: "",
          upload_type: "",
        };

        value &&
        value !== "" &&
        year &&
        year !== "" &&
        edu_year &&
        edu_year !== "" &&
        section &&
        section !== ""
          ? setSkip((prev) => ({ ...prev, subjects: false }))
          : setSkip((prev) => ({ ...prev, subjects: true }));
        break;
      case "subject":
        otherData = {
          ...otherData,
          upload_type: "",
        };
        break;
      case "upload_type":
        break;

      default:
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: value, ...otherData }));
    setErrors(errs);
  };

  const onCreateAssignmentSubmitHandler = (e) => {
    e.preventDefault();

    let tdate = Date();
    let tdueDate = new Date(formData?.due_date);

    let date = tdate.split(" ").slice(0, 6).join(" ");
    let dueDate = tdueDate.toString().split(" ").slice(0, 6).join(" ");

    const fd = new FormData();

    Object.entries({ ...formData, date, due_date: dueDate }).forEach(
      ([key, value]) => fd.append(key, value)
    );

    createAssignment(fd).then((res) => {
      console.log(res);
      if (res?.data?.success === "1") {
        toast("Assignment Created Successfully", {
          type: "success",
          transition: Slide,
        });
        setFormData(INITIAL_STATE);
        setSkip({ branches: true, sections: true, subjects: true });
        setErrors({ ...INITIAL_STATE, upload_type: "" });
      }
    });
  };

  const getField = (field) => {
    switch (field?.input_type) {
      case 1:
        return (
          <Input
            {...field}
            value={formData[field?.name]}
            error={errors[field?.name]}
            onChange={handleChange}
          />
        );
      case 2:
        return (
          <RadioInput
            {...field}
            value={formData[field?.name]}
            error={errors[field?.name]}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <Select
            {...field}
            value={formData[field?.name]}
            error={errors[field?.name]}
            onChange={handleChange}
          />
        );
      default:
        return <></>;
    }
  };

  const FIELDS = [
    [
      {
        input_type: 1,
        name: "title",
        label: "Title",
        required: true,
      },
    ],
    [
      {
        input_type: 1,
        type: "date",
        name: "due_date",
        label: "Due Date",
        required: true,
        min: (() => {
          let d = new Date();
          return (
            d.getFullYear() +
            "-" +
            dates[d.getMonth()] +
            "-" +
            (d.getUTCDate() < 10 ? "0" + d.getUTCDate() : d.getUTCDate())
          );
        })(),
      },
    ],
    [
      {
        input_type: 3,
        name: "year",
        label: "Year",
        required: true,
        optionInitialValue: "",
        options: (() => {
          let d = new Date();
          let currentYear = d.getFullYear();
          let years = [];
          for (let i = 2019; i <= currentYear; i++) {
            years.push(i);
          }
          return years;
        })(),
      },
      {
        input_type: 3,
        name: "edu_year",
        label: "Batch",
        required: true,
        optionInitialValue: "",
        options: { "1st": 1, "2nd": 2, "3rd": 3, "4th": 4 },
        disabled: formData?.year === "",
      },
    ],

    [
      {
        input_type: 3,
        name: "branch",
        label: "Branch",
        required: true,
        optionInitialValue: "",
        options: branchesResponse?.data,
        disabled: formData?.year === "" || formData?.edu_year === "",
      },
      {
        input_type: 3,
        name: "section",
        label: "Section",
        required: true,
        disabled: formData?.branch === "",
        options: sectionsResponse?.data,
        optionInitialValue: "",
      },
    ],
    [
      {
        input_type: 3,
        name: "semester",
        label: "Semester",
        required: true,
        optionInitialValue: "",
        options: { "1st": 1, "2nd": 2 },
        disabled: formData?.section === "",
      },
      {
        input_type: 3,
        name: "subject",
        label: "Subject",
        optionInitialValue: "",
        options: subjectsResponse?.data,
        optionValue: "subject",
        optionKey: "subject",
        disabled: formData?.semester === "",
      },
    ],
    [
      {
        input_type: 3,
        name: "upload_type",
        label: "Upload Type",
        optionInitialValue: "",
        options: [
          { key: "Upload Document", value: 1 },
          { key: "Type in text editor and upload", value: 2 },
        ],
        optionKey: "key",
        optionValue: "value",
        disabled: formData?.subject === "",
      },
    ],
  ];

  return (
    <>
      <Helmet>
        <title>Assignments | Create Assignment</title>
      </Helmet>
      <div className="container-wrapper teacher-create-assignment">
        <Header title="Create Assignment" />
        <section>
          <form onSubmit={onCreateAssignmentSubmitHandler}>
            <div className="fields">
              {FIELDS?.map((row) => (
                <Row>
                  {row?.map((col) => (
                    <Col>{getField(col)}</Col>
                  ))}
                </Row>
              ))}

              {formData?.upload_type == 1 && (
                <Form.Group className="input_wrapper">
                  <Form.Label>
                    Upload Document <span className="asterisk">*</span>
                  </Form.Label>

                  <FileUploader
                    {...{
                      name: "file",
                      handleChange: (file) =>
                        setFormData((prev) => ({ ...prev, file })),
                      fileTypes: ["PDF", "DOC", "DOCX"],
                    }}
                    file={formData?.file}
                  />
                  {errors?.file && (
                    <span className="error_message">{errors?.file}</span>
                  )}
                </Form.Group>
              )}

              {formData?.upload_type == 2 && (
                <Form.Group>
                  <Form.Label>Type Manually *</Form.Label>
                  <Button
                    onClick={() => {
                      // submitButtonRef.current.click();
                      localStorage.setItem(
                        "type-assignment-details",
                        JSON.stringify(formData)
                      );
                      navigate(`/teacher/create-assignment/type`);
                    }}
                  >
                    Open Text Editor
                  </Button>
                </Form.Group>
              )}

              <button
                type="submit"
                ref={submitBtnRef}
                style={{ display: "none" }}
              ></button>
            </div>
          </form>
        </section>
        <Footer
          rightChildren={
            <>
              <Button onClick={() => submitBtnRef?.current?.click()}>
                Create Assignment
              </Button>
            </>
          }
        />
      </div>
    </>
  );
};

export default CreateAssignment;
