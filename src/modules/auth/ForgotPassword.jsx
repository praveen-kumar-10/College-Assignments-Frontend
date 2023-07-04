import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import OTPInput, { ResendOTP } from "otp-input-react";

import saly from "assets/Saly-12.png";
import { ReactComponent as Logo } from "assets/full-logo-main.svg";

import Input from "components/ui/input/Input";

import "./ForgotPassword.scss";
import {
  useResetPasswordMutation,
  useSendResetPasswordOTPMutation,
} from "redux/auth/authSlice";
import { Slide, toast } from "react-toastify";
import Button from "components/ui/button/Button";

const renderButton = (buttonProps) => {
  return <button {...buttonProps}>Resend</button>;
};
const renderTime = (remainingTime) => {
  return <span>{remainingTime} seconds remaining</span>;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [changePasswordData, setChangePasswordData] = useState({
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [sendOTP, { isLoading: isOTPSending }] =
    useSendResetPasswordOTPMutation();
  const [resetPassword, { isLoading: isPasswordReseting }] =
    useResetPasswordMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.table(changePasswordData, errors);

    switch (name) {
      case "password":
        if (
          changePasswordData?.confirmPassword &&
          changePasswordData?.confirmPassword !== ""
        ) {
          if (changePasswordData?.confirmPassword === value) {
            setErrors((prev) => ({
              ...prev,
              password: "",
              confirmPassword: "",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              password: "Passwords doesn't match",
              confirmPassword: "Passwords doesn't match",
            }));
          }
        }
        break;
      case "confirmPassword":
        if (
          changePasswordData?.password &&
          changePasswordData?.password === value
        ) {
          setErrors((prev) => ({
            ...prev,
            password: "",
            confirmPassword: "",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            password: "Passwords doesn't match",
            confirmPassword: "Passwords doesn't match",
          }));
        }
        break;
      default:
        break;
    }

    setChangePasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const onOTPSendHandler = (e) => {
    e.preventDefault();
    sendOTP({ email }).then((res) => {
      if (res?.data?.success === "1") {
        setShowOTPForm(true);
      } else {
        res?.data?.success === "2" && setEmailError("User Not Found");
      }
    });
  };

  const onResetPasswordHandler = (e) => {
    e.preventDefault();

    const { otp, password, confirmPassword } = changePasswordData;

    if (otp && otp?.length === 6) {
      if (password === confirmPassword) {
        resetPassword({ email, otp, password }).then((res) => {
          if (res?.data?.success === "1") {
            navigate("/login");
          } else {
            res?.data?.message === "Please provide 'otp'" &&
              setErrors((prev) => ({ ...prev, otp: "Invalid" }));
          }
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          password: "Passwords doesn't match",
          changePassword: "Passwords doesn't match",
        }));
        // toast("Passwords doesn't match", { type: "error", transition: Slide });
      }
    } else {
      setErrors((prev) => ({ ...prev, otp: "Invalid" }));
    }
  };

  return (
    <>
      <Helmet>
        <title>Assignments | Forgot Password</title>
      </Helmet>
      <div className="forgot-password-container-wrapper">
        <div className="left__section">
          <header>
            <Logo className="logo" />
          </header>
          <h1>Welcome</h1>
          <p>
            Discover the world’s best platform for students and teachers to
            review and submit assignments.
          </p>
          <div className="image_wrapper">
            <img src={saly} alt="" className="saly" />
          </div>
        </div>

        <div className="right__section">
          <h1 className="headline">Forgot Password</h1>
          {/* <p>We just need your email to sent OTP</p> */}

          {!showOTPForm ? (
            <form onSubmit={onOTPSendHandler}>
              <div className="fields">
                <Input
                  name="email"
                  label="Email"
                  required
                  value={email}
                  error={emailError}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button type="submit" isLoading={isOTPSending}>
                  Send OTP
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={onResetPasswordHandler}>
              <div className="fields">
                <Form.Group className="input_wrapper">
                  <Form.Label>OTP *</Form.Label>
                  <OTPInput
                    required
                    className="otp-input-root"
                    value={changePasswordData?.otp}
                    onChange={(otp) =>
                      setChangePasswordData((prev) => ({ ...prev, otp }))
                    }
                    autoFocus
                    OTPLength={6}
                    otpType="number"
                    disabled={false}
                    // secure
                  />
                  {errors?.otp && (
                    <span className="error_message">{errors?.otp}</span>
                  )}
                  {/* <ResendOTP
                  renderButton={renderButton}
                  renderTime={renderTime}
                  onResendClick={() => console.log("Resend clicked")}
                /> */}
                </Form.Group>

                <Input
                  type="password"
                  name="password"
                  label="Password"
                  required
                  value={changePasswordData?.password}
                  error={errors?.password}
                  onChange={handleChange}
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  required
                  value={changePasswordData?.confirmPassword}
                  error={errors?.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" isLoading={isPasswordReseting}>
                Reset Password
              </Button>
            </form>
          )}
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

export default ForgotPassword;
