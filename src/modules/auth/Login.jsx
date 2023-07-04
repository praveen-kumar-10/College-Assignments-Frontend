import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import saly from "assets/skills.png";
import { ReactComponent as Logo } from "assets/full-logo-main.svg";

import Input from "components/ui/input/Input";
import Modal from "components/ui/modal/Modal";

import { onLogin, setAuthDetails } from "redux/auth/authReducer";
import { useLoginMutation } from "redux/auth/authSlice";

import "./Login.scss";
import {
  useGetAdminProfile,
  useGetStudentProfile,
  useGetTeacherProfile,
} from "utils/apis/getProfiles";
import { setIsLoading } from "redux/uiReducer";

const FIELDS = [
  {
    type: "email",
    required: true,
    name: "email",
    label: "E-mail ID",
    placeholder: "email@gmail.com",
  },
  {
    type: "password",
    required: true,
    name: "password",
    label: "Password",
    placeholder: "",
  },
];

const INITIAL_STATE = {
  email: "",
  password: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  localStorage.removeItem("isLoggedout");

  const [formData, setFormData] = useState({
    state: INITIAL_STATE,
    errors: INITIAL_STATE,
  });
  const [showModal, setShowModal] = useState(false);

  const { state, errors } = formData;

  const [login, { isLoading }] = useLoginMutation();

  const [getAdminProfile, isAdminDetailsLoading] = useGetAdminProfile();
  const [getStudentProfile, isSudentDetailsLoading] = useGetStudentProfile();
  const [getTeacherProfile, isTeacherDetailsLoading] = useGetTeacherProfile();

  const fetchProfile = (user) => {
    let email = user?.email;
    switch (user?.user_type) {
      case "admin":
        getAdminProfile({ admin_id: user?.id });
        break;
      case "teacher":
        getTeacherProfile({ email });
        break;
      case "student":
        getStudentProfile({ email });
        break;
      default:
        break;
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    let errs = { ...errors };

    setFormData((prev) => ({
      ...prev,
      state: { ...state, [name]: value },
      errors: errs,
    }));
  };

  const onLoginSubmitHandler = (e) => {
    e.preventDefault();

    login(state).then((res) => {
      if (res?.data?.success === "1") {
        const { access, refresh, user } = res?.data;

        dispatch(
          setAuthDetails({ access, refresh, user, isAuthenticated: true })
        );

        Object.entries({ access, refresh, user })?.forEach(([key, value]) =>
          localStorage.setItem(key, JSON.stringify(value))
        );

        // navigate("/admin");

        fetchProfile(user);

        setFormData((prev) => ({
          state: INITIAL_STATE,
          errors: INITIAL_STATE,
        }));
      } else if (res?.data?.success === "2") {
        setShowModal(true);
      } else {
        const message = res?.data?.message;
        setFormData((prev) => ({
          ...prev,
          errors: {
            ...errors,
            email:
              message === "Email doesnot exists" ? "Email Doesn't Exists" : "",
            password: message === "Incorrect Password" ? message : "",
          },
        }));
      }
    });
  };

  return (
    <>
      <Helmet>
        <title>Assignments | Login</title>
      </Helmet>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Ooops!"
        isCloseBtn
        body={
          <>
            <p>Consult your admin to activate your account</p>
          </>
        }
      />
      <div className="auth-container-wrapper login-container-wrapper">
        <div className="left__section">
          <header>
            <Logo className="logo" />
          </header>
          <h1>Welcome Back</h1>
          <p>
            Discover the world’s best platform for students and teachers to
            review and submit assignments.
          </p>
          <div className="image_wrapper">
            <img src={saly} alt="" className="saly" />
          </div>
        </div>

        <div className="right__section">
          <h1 className="headline">Login to your account</h1>

          <form onSubmit={onLoginSubmitHandler}>
            <div className="fields">
              {FIELDS?.map((field) => (
                <Input
                  key={field?.name}
                  {...{
                    ...field,
                    value: state[field?.name],
                    error: errors[field?.name],
                    onChange: onChangeHandler,
                    disabled: isLoading,
                  }}
                />
              ))}
            </div>
            <p className="forgot-password">
              <Link to="/forgot-password" className="link">
                Forgot Password?
              </Link>
            </p>

            <button disabled={isLoading}>
              {isLoading && (
                <Spinner size="sm" animation="border" variant="light" />
              )}
              Login
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
