import React from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Form } from "react-bootstrap";

import { ReactComponent as ArrowDownIcon } from "assets/icons/u_angle-down.svg";

import "./Dropdown.scss";

const DropDown = ({
  variant,
  icon,
  isDropdownIcon,
  title,
  items,
  type,
  onChange,
  data,
  disabled,
}) => {
  return (
    <div className="dropdown-wrapper">
      <Dropdown
        id="dropdown-basic"
        className={`shadow-none ${type}`}
        variant={variant}
      >
        <Dropdown.Toggle
          disabled={disabled}
          className={`dropdown-toggle-${variant} ${
            !isDropdownIcon ? "no-toggle-icon" : ""
          }`}
        >
          {icon} {title} {isDropdownIcon && <ArrowDownIcon />}
        </Dropdown.Toggle>
        <Dropdown.Menu style={{ margin: 0 }}>
          {items?.map((item) => (
            <DropdownItem key={item?.title} {...item} />
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropDown;

const DropdownItem = ({
  title,
  className,
  disabled,
  navigateTo,
  onClick,
  icon,
  required = true,
}) => {
  const navigate = useNavigate();

  if (required)
    return (
      <Dropdown.Item
        key={title}
        {...{ className, disabled }}
        onClick={() => {
          navigateTo && navigate(navigateTo);
          onClick && onClick();
        }}
      >
        {icon} {title}
      </Dropdown.Item>
    );
  else return <></>;
};
