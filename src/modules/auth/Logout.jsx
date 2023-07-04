import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiSlice } from "redux/apiSlice";

import Button from "components/ui/button/Button";
import { authSlice } from "redux/auth/authSlice";
import store from "redux/store";

import { ReactComponent as Logo } from "assets/full-logo-main.svg";
import { ReactComponent as CheckCircle } from "assets/icons/check-circle.svg";

import "./Logout.scss";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="logout-container-wrapper">
      <div className="wrapper">
        <header>
          <Logo className="logo" />
        </header>
        <section>
          <CheckCircle className="check-circle-icon" />
          <div className="content">
            <h3>You have been logged out successfully</h3>
            <h4>Thank You</h4>
          </div>

          <Button onClick={() => navigate("/login")}>Login Again</Button>
        </section>
      </div>
    </div>
  );
};

export default Logout;
