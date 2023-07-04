import styled from "@emotion/styled";
import React from "react";
import { ReactComponent as Logo } from "assets/full-logo-main.svg";
import { useNavigate } from "react-router-dom";

const StyledSidebarHeader = styled.div`
  height: 64px;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;

  > div {
    width: 100%;
    overflow: hidden;
    > svg {
      width: 80%;
      height: 2rem;
    }
  }
`;

export const SidebarHeader = ({ userType, children, ...rest }) => {
  const navigate = useNavigate();
  return (
    <StyledSidebarHeader {...rest}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo
          style={{ cursor: "pointer" }}
          onClick={() =>
            userType === "admin"
              ? navigate("/admin")
              : userType === "teacher"
              ? navigate("/teacher")
              : userType === "student"
              ? navigate("/student")
              : navigate("/login")
          }
        />
        {/* <StyledLogo>P</StyledLogo> */}
        {/* <Typography variant="subtitle1" fontWeight={700} color="#0098e5">
          Pro Sidebar
        </Typography> */}
      </div>
    </StyledSidebarHeader>
  );
};
