import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useParseCSV } from "custom-hooks/useParseCSV";

import { ReactComponent as UploadIcon } from "assets/icons/upload-cloud.svg";

import Header from "components/ui/header/Header";
import RadioInput from "components/ui/input/RadioInput";
import { default as FileUploader } from "components/ui/upload/Upload";
import Footer from "components/ui/footer/Footer";
import Button from "components/ui/button/Button";
import { Slide, toast } from "react-toastify";
import {
  useCreateBulkStudentsMutation,
  useCreateSubjectsMutation,
} from "redux/admin/adminSlice";
import { useDispatch } from "react-redux";
import { setIsLoading } from "redux/uiReducer";

const Upload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filePurpose, setFilePurpose] = useState("students");
  const [file, data, error, handleChange, handleParse] = useParseCSV();

  const [createStudents, { isLoading: isStudentsCreating }] =
    useCreateBulkStudentsMutation();
  const [createSubjects, { isLoading: isSubjectsUploading }] =
    useCreateSubjectsMutation();

  useEffect(() => {
    dispatch(setIsLoading(isStudentsCreating || isSubjectsUploading));
  }, [dispatch, isStudentsCreating, isSubjectsUploading]);

  const onSubmitHandler = (e) => {
    if (!file || !filePurpose) {
      toast("Please fill the options properly", {
        type: "error",
        transition: Slide,
      });
      return;
    }

    const fd = new FormData();

    fd.append("file", file);
    fd.append("filePurpose", filePurpose);

    filePurpose === "students" &&
      createStudents(fd).then(
        (res) => res?.data?.success === "1" && navigate("/admin")
      );
    filePurpose === "subjects" &&
      createSubjects(fd).then(
        (res) => res?.data?.success === "1" && navigate("/admin")
      );
  };

  return (
    <>
      <Helmet>
        <title>Assignments | Admin - Upload</title>
      </Helmet>
      <div className="container-wrapper admin-upload">
        <Header
          title="Upload"
          subTitle="for Branch/Students Data (only .csv file supported)"
        />
        <section>
          <FileUploader
            {...{ handleChange, fileTypes: ["CSV", "JPEG", "XLSX"] }}
            file={file}
          />
          <div className="fields">
            <RadioInput
              name="filePurpose"
              value={filePurpose}
              onChange={(value) => setFilePurpose(value)}
              radioInputs={[
                { value: "students", label: "Students" },
                { value: "subjects", label: "Subjects" },
              ]}
            />
          </div>
        </section>
        <Footer
          rightChildren={
            <>
              <Button
                isLoading={isStudentsCreating || isSubjectsUploading}
                disabled={!file}
                onClick={onSubmitHandler}
              >
                <UploadIcon />
                Upload
              </Button>
            </>
          }
        />
      </div>
    </>
  );
};

export default Upload;
