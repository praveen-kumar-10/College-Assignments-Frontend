import React, { useState } from "react";
import { Helmet } from "react-helmet";

import Button from "components/ui/button/Button";
import Footer from "components/ui/footer/Footer";
import Header from "components/ui/header/Header";
import Select from "components/ui/input/Select";
import {
  usePromoteStudentsByYearConfirmMutation,
  usePromoteStudentsMutation,
} from "redux/admin/adminSlice";
import { Slide, toast } from "react-toastify";
import Modal from "components/ui/modal/Modal";

const INITIAL_STATE = {
  year: "",
  edu_year: "",
};

const PromoteStudents = () => {
  const [showModal, setShowModal] = useState({ show: false });
  const [formData, setFormData] = useState({
    state: INITIAL_STATE,
    errors: INITIAL_STATE,
  });

  const { state, errors } = formData;

  const [promoteStudentsByYearConfirm, { isLoading: isConfirming }] =
    usePromoteStudentsByYearConfirmMutation();
  const [promoteStudents, { isLoading: isPromoting }] =
    usePromoteStudentsMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errs = { ...errors };
    switch (name) {
      case "year":
        value
          ? (errs.year = "")
          : (errs.year = "Year of the Batch is required");
        break;
      case "edu_year":
        value
          ? (errs.edu_year = "")
          : (errs.edu_year = "Current Education Year is required");
        break;
      default:
        break;
    }
    setFormData((prev) => ({
      ...prev,
      state: { ...state, [name]: value },
      errors: errs,
    }));
  };

  const onPromoteConfirmHandler = (e) => {
    e.preventDefault();

    const { year, edu_year } = state;

    if (!year || !edu_year) {
      if (!year) {
        setFormData((prev) => ({
          ...prev,
          errors: { ...errors, year: "Year of the Batch is required" },
        }));
        toast("Select Year", { type: "error", transition: Slide });
      }
      if (!edu_year) {
        setFormData((prev) => ({
          ...prev,
          errors: { ...errors, edu_year: "Current Education Year is required" },
        }));
        toast("Select Year", { type: "error", transition: Slide });
      }
    } else {
      promoteStudentsByYearConfirm(state).then((res) => {
        if (res?.data?.success === "1") {
          setShowModal({ show: true, message: res?.data?.message });
        }
      });
    }
  };

  const onPromoteStudentsHandler = (e) => {
    promoteStudents(state).then((res) => {
      if (res?.data?.success === "1") {
        setFormData((prev) => ({
          state: INITIAL_STATE,
          errors: INITIAL_STATE,
        }));
        setShowModal({ show: false });
      }
    });
  };

  const FIELDS = [
    {
      input_type: 3,
      name: "year",
      isRequired: true,
      optionInitialValue: "",
      label: "Select Joining Year",
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
      isRequired: true,
      optionInitialValue: "",
      label: "Select Current Education Year",
      options: [1, 2, 3, 4],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Assignments | Admin - Promote Students</title>
      </Helmet>
      <Modal
        className={"promote-confirmation-modal"}
        show={showModal?.show}
        onHide={() => setShowModal({ show: false })}
        title="Promote Confirmation"
        body={
          <>
            <h1>{showModal?.message}</h1>
          </>
        }
        footerRight={
          <>
            <Button isLoading={isPromoting} onClick={onPromoteStudentsHandler}>
              Submit
            </Button>
          </>
        }
      />
      <div className="container-wrapper admin-promote-students">
        <Header title="Promote Students" />
        <section>
          <form onSubmit={onPromoteConfirmHandler}>
            <div className="fields">
              {FIELDS?.map((field) => (
                <Select
                  {...field}
                  value={state[field?.name]}
                  error={errors[field?.name]}
                  onChange={handleChange}
                />
              ))}
            </div>
            <Button type="submit" isLoading={isPromoting}>
              Promote
            </Button>
          </form>
        </section>
      </div>
    </>
  );
};

export default PromoteStudents;
