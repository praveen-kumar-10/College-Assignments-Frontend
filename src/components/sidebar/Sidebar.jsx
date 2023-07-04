import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  // SubMenu,
  useProSidebar,
  menuClasses,
  // MenuItemStyles,
} from "react-pro-sidebar";

import profilePic from "assets/profile-pic.png";

import { ReactComponent as BellIcon } from "assets/icons/u_bell.svg";
import { ReactComponent as HomeIcon } from "assets/icons/u_home-alt.svg";
import { ReactComponent as SettingsIcon } from "assets/icons/u_setting.svg";
import { ReactComponent as LogoutIcon } from "assets/icons/u_sign-out-alt.svg";
import { ReactComponent as NotesIcon } from "assets/icons/u_clipboard-notes.svg";
import { ReactComponent as UploadIcon } from "assets/icons/upload-cloud.svg";
// import { ReactComponent as UserIcon } from "assets/icons/u_user-circle.svg";

import { Badge } from "./components/Badge";
import { Switch } from "./components/Switch";
import { Typography } from "./components/Typography";
import { SidebarHeader } from "./components/SidebarHeader";
// import { PackageBadges } from "./components/PackageBadges";
// import { SidebarFooter } from "./components/SidebarFooter";

import "./Sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { apiSlice } from "redux/apiSlice";
import { authSlice, useLogoutMutation } from "redux/auth/authSlice";
import store from "redux/store";
import Modal from "components/ui/modal/Modal";
import Button from "components/ui/button/Button";
import { setAuthDetails } from "redux/auth/authReducer";
import { setCurrentStudentAssignmentsTab } from "redux/uiReducer";

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#c5e4ff",
        color: "#44596e",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#0b2948",
      color: "#8ba1b7",
    },
    menu: {
      menuContent: "#082440",
      icon: "#59d0ff",
      hover: {
        backgroundColor: "#00458b",
        color: "#b6c8d9",
      },
      disabled: {
        color: "#3e5e7e",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { collapsed } = useProSidebar();
  const [theme, setTheme] = useState("light");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const userType = useSelector((state) => state?.auth?.user?.user_type);
  const adminDetails = useSelector((state) => state?.auth?.adminDetails);
  const teacherDetails = useSelector((state) => state?.auth?.teacherDetails);
  const studentDetails = useSelector((state) => state?.auth?.studentDetails);
  const refresh = useSelector((state) => state?.auth?.refresh);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleThemeChange = (e) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  const menuItemStyles = {
    root: {
      fontSize: "18px",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes[theme].menu.menuContent, 1)
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, 1),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  const ADMIN_MENU_ITEMS = [
    {
      icon: <HomeIcon />,
      title: "Home",
      onClick: () => navigate("/admin"),
    },
    {
      icon: <NotesIcon />,
      title: "Consolidations",
      onClick: () => navigate("/admin/consolidations"),
    },
    {
      icon: <UploadIcon className="upload-icon" />,
      title: "Upload",
      onClick: () => navigate("/admin/upload"),
    },
  ];

  const STUDENT_MENU_ITEMS = [
    {
      icon: <NotesIcon />,
      title: "Pending Assignments",
      onClick: () => {
        dispatch(setCurrentStudentAssignmentsTab("pending"));
        navigate("/student");
      },
    },
    {
      icon: <NotesIcon />,
      title: "Submitted Assignments",
      onClick: () => {
        dispatch(setCurrentStudentAssignmentsTab("submitted"));
        navigate("/student");
      },
    },
    {
      icon: <NotesIcon />,
      title: "Reviewed Assignments",
      onClick: () => {
        dispatch(setCurrentStudentAssignmentsTab("reviewed"));
        navigate("/student");
      },
    },
  ];

  const TEACHER_MENU_ITEMS = [
    {
      icon: <HomeIcon />,
      title: "Home",
      onClick: () => navigate("/teacher"),
    },
    {
      icon: <NotesIcon />,
      title: "Create Assignment",
      onClick: () => navigate("/teacher/create-assignment"),
    },
    {
      icon: <NotesIcon />,
      title: "My Assignments",
      onClick: () => navigate("/teacher/my-assignments"),
    },
    {
      icon: <NotesIcon />,
      title: "Show Saved",
      onClick: () => navigate("/teacher/create-assignment/type"),
    },
    {
      icon: <NotesIcon />,
      title: "Consolidations",
      onClick: () => navigate("/teacher/consolidations"),
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "USER_LOGOUT" });
    store.dispatch(apiSlice.util.resetApiState());
    store.dispatch(authSlice.util.resetApiState());

    localStorage.setItem("isLoggedout", true);
    navigate("/logout");
  };

  return (
    <>
      <Modal
        backdrop={isLoading ? "static" : true}
        keyboard={isLoading}
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        title="Logout Confirmation"
        className="logout-confirmation-modal"
        body={
          <>
            <h5>Are you sure you want to logout?</h5>
          </>
        }
        footerRight={
          <>
            <Button secondary onClick={() => setShowConfirmationModal(false)}>
              No
            </Button>
            <Button isLoading={isLoading} onClick={handleLogout}>
              Yes
            </Button>
          </>
        }
      />
      <ProSidebar
        breakPoint="lg"
        backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 1)}
        rootStyles={{
          width: "21rem",
          color: themes[theme].sidebar.color,
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <SidebarHeader
            userType={userType}
            style={{ marginBottom: "24px", marginTop: "16px" }}
          />
          <div style={{ flex: 1, marginBottom: "32px" }}>
            <div
              style={{
                padding: "0 24px",
                marginBottom: "8px",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
              >
                General
              </Typography>
            </div>

            <Menu menuItemStyles={menuItemStyles}>
              {userType === "admin" &&
                ADMIN_MENU_ITEMS?.map((item) => (
                  <MenuItem key={item?.title} {...item}>
                    {item?.title}
                  </MenuItem>
                ))}

              {userType === "teacher" &&
                TEACHER_MENU_ITEMS?.map((item) => (
                  <MenuItem key={item?.title} {...item}>
                    {item?.title}
                  </MenuItem>
                ))}

              {userType === "student" &&
                STUDENT_MENU_ITEMS?.map((item) => (
                  <MenuItem key={item?.title} {...item}>
                    {item?.title}
                  </MenuItem>
                ))}
            </Menu>
          </div>

          <Menu menuItemStyles={menuItemStyles}>
            <MenuItem
              icon={<BellIcon />}
              suffix={<Badge variant="danger">2</Badge>}
            >
              Notifications
            </MenuItem>
            <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
            <MenuItem
              rootStyles={{
                color: "#FF472E",
              }}
              icon={<LogoutIcon />}
              onClick={() => setShowConfirmationModal(true)}
            >
              Logout
            </MenuItem>
          </Menu>

          <div
            style={{
              padding: "0 20px",
              marginBottom: "24px",
              marginTop: "16px",
            }}
          >
            <Switch
              id="theme"
              checked={theme === "dark"}
              onChange={handleThemeChange}
              label="Dark theme"
            />
          </div>
          <div
            style={{
              padding: "0 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
            className="profile"
            onClick={() => navigate("/profile")}
          >
            <div
              className="profile_pic"
              style={{
                borderRadius: "50%",
                border: "1px solid rgb(200 210 223)",
              }}
            >
              <img
                style={{ borderRadius: "50%" }}
                width="40"
                src={profilePic}
                alt=""
              />
            </div>
            <div className="right">
              <h6
                style={{
                  margin: 0,
                }}
              >
                {userType === "admin" &&
                  `${adminDetails?.first_name} ${adminDetails?.last_name}`}
                {userType === "teacher" && teacherDetails?.name}
                {userType === "student" && studentDetails?.name}
                {/* N Praveen Kumar */}
              </h6>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                }}
              >
                {userType === "admin" && adminDetails?.email}
                {userType === "teacher" && teacherDetails?.email}
                {userType === "student" && studentDetails?.email}
                {/* N Praveen Kumar */}
                {/* praveennetinti@gmail.com */}
              </p>
            </div>
          </div>
        </div>
      </ProSidebar>
    </>
  );
};

export default Sidebar;
