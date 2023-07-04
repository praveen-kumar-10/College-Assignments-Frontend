import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

import { Col, Row, Spinner } from "react-bootstrap";
import saly from "assets/skills.png";
import { ReactComponent as Logo } from "assets/full-logo-main.svg";

import Input from "components/ui/input/Input";
import Select from "components/ui/input/Select";
import RadioInput from "components/ui/input/RadioInput";

import "./Register.scss";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "redux/auth/authSlice";
import { onRegister } from "redux/auth/authReducer";
import Modal from "components/ui/modal/Modal";
import { Slide, toast } from "react-toastify";

const FIELDS = [
  [
    {
      input_type: 1,
      type: "email",
      required: true,
      name: "email",
      label: "E-mail ID",
      placeholder: "email@gmail.com",
    },
    {
      input_type: 1,
      type: "tel",
      name: "phone",
      label: "Mobile Number",
      required: true,
      placeholder: "123-456-7890",
    },
  ],
  [
    {
      input_type: 1,
      name: "name",
      label: "Name",
      required: true,
    },
  ],
  [
    {
      input_type: 3,
      name: "profession",
      label: "Profession",
      required: true,
      optionInitialValue: "",
      options: ["HOD", "Associate Professor", "Assistant Professor", "DEO"],
    },
    {
      input_type: 3,
      name: "department",
      label: "Branch",
      required: true,
      optionInitialValue: "",
      options: ["CSE", "IT", "ECE", "EEE", "CIVIL", "MECH"],
    },
  ],
  [
    {
      input_type: 1,
      type: "password",
      required: true,
      name: "password",
      label: "Password",
      placeholder: "",
    },
    {
      input_type: 1,
      type: "password",
      required: true,
      name: "confirm_password",
      label: "Confirm Password",
      placeholder: "",
    },
  ],
  [
    {
      input_type: 2,
      name: "gender",
      label: "Gender",
      required: true,
      radioInputs: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "others", label: "Others" },
      ],
    },
  ],
];

const INITIAL_STATE = {
  email: "",
  phone: "",
  name: "",
  department: "",
  password: "",
  profession: "",
  confirm_password: "",
  gender: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    state: INITIAL_STATE,
    errors: INITIAL_STATE,
  });
  const [showModal, setShowModal] = useState(false);

  const { state, errors } = formData;

  const [register, { isLoading }] = useRegisterMutation();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    let errs = { ...errors };

    switch (name) {
      case "email":
        validateEmail(value) ? (errs.email = "") : (errs.email = "Invalid");
        break;
      case "phone":
        validatePhoneNumber(value)
          ? (errs.phone = "")
          : (errs.phone = "Invalid");
        break;
      case "password":
        if (state?.confirm_password && state?.confirm_password !== "") {
          if (state?.confirm_password === value)
            errs = { ...errs, password: "", confirm_password: "" };
          else {
            errs = {
              ...errs,
              password: "Passwords doesn't match",
              confirm_password: "Passwords doesn't match",
            };
          }
        }
        break;
      case "confirm_password":
        if (state?.password && state?.password === value) {
          errs = {
            ...errs,
            password: "",
            confirm_password: "",
          };
        } else {
          errs = {
            ...errs,
            password: "Passwords doesn't match",
            confirm_password: "Passwords doesn't match",
          };
        }
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

  const onRegisterSubmitHandler = (e) => {
    e.preventDefault();

    if (state?.password === state?.confirm_password)
      register({
        accountType: "teacher",
        ...state,
      }).then((res) => {
        if (res?.data?.success === "1") {
          // navigate("/login");
          setShowModal(true);

          dispatch(onRegister(res?.data));

          setFormData((prev) => ({
            state: INITIAL_STATE,
            errors: INITIAL_STATE,
          }));
        } else {
          const message = res?.data?.message;
          setFormData((prev) => ({
            ...prev,
            errors: {
              ...errors,
              email:
                message === "Email already exists"
                  ? "Email already exists"
                  : "",
            },
          }));
        }
      });
    else {
      toast("Passwords Mismatch", { type: "error", transition: Slide });
    }
  };

  const getFields = (field) => {
    switch (field?.input_type) {
      case 1:
        return (
          <Input
            {...field}
            value={state[field?.name]}
            error={errors[field?.name]}
            onChange={onChangeHandler}
          />
        );
      case 2:
        return (
          <RadioInput
            {...field}
            value={state[field?.name]}
            error={errors[field?.name]}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                state: { ...state, [field.name]: value },
              }))
            }
          />
        );
      case 3:
        return (
          <Select
            {...field}
            error={errors[field?.name]}
            value={state[field?.name]}
            onChange={onChangeHandler}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Assignments | Sigup</title>
      </Helmet>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Ooops!"
        isCloseBtn
        body={
          <>
            <p>
              Your account is in pending state, consult your admin to activate
              your account
            </p>
          </>
        }
      />
      <div className="auth-container-wrapper register-container-wrapper">
        <div className="left__section">
          <header>
            <Logo className="logo" />
          </header>
          <h1>Start your journey with us.</h1>
          <p>
            Discover the world’s best platform for students and teachers to
            review and submit assignments.
          </p>
          <div className="image_wrapper">
            <img src={saly} alt="" className="saly" />
          </div>
        </div>

        <div className="right__section">
          <h1 className="headline">Signup for an account</h1>

          <form onSubmit={onRegisterSubmitHandler}>
            <div className="fields">
              {FIELDS?.map((row, idx) => (
                <Row key={idx}>
                  {row?.map((field) => (
                    <Col key={field?.name}>{getFields(field)}</Col>
                  ))}
                </Row>
              ))}
            </div>
            <p className="terms-and-conditions">
              By creating an account, you agreeing to our{" "}
              <span>Privacy Policy</span>
            </p>
            <button disabled={isLoading}>
              {isLoading && (
                <Spinner size="sm" animation="border" variant="light" />
              )}
              Create Account
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;

const validateEmail = (email) => {
  let emailRe = new RegExp("[a-zA-Z0-9]+@[a-z]+.[a-z]+");
  return emailRe.test(email);
};

const validatePhoneNumber = (phoneNumber) => {
  let phoneRe = new RegExp("[1-9][0-9]{9}");
  return phoneRe.test(phoneNumber);
};
