import React from "react";
import { Spinner } from "react-bootstrap";
import "./Button.scss";

const Button = ({
  secondary,
  type,
  children,
  isLoading,
  disabled,
  ...other
}) => {
  return (
    <button
      type={type ? type : "button"}
      className={`btn ${secondary ? "secondary" : ""}`}
      disabled={disabled || isLoading}
      {...other}
    >
      {isLoading && <Spinner size="sm" animation="border" variant="light" />}
      {children}
    </button>
  );
};

export default Button;
