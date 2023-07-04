import React from "react";

import { ReactComponent as SearchIcon } from "assets/icons/Search.svg";
import { ReactComponent as ArrowLeft } from "assets/icons/u_angle-left-b.svg";
import { useNavigate } from "react-router-dom";

const Header = ({
  title,
  subTitle,
  subTitleStyles = {},
  search,
  rightChildren,
  backBtn,
  url,
}) => {
  const navigate = useNavigate();
  return (
    <header>
      <div className="header_left">
        {backBtn && (
          <div className="arrow-left-wrapper" onClick={() => navigate(url)}>
            <ArrowLeft />
          </div>
        )}
        <h1 className="title">
          {title}
          {subTitle && <span style={subTitleStyles}>{subTitle}</span>}
        </h1>
      </div>
      <div className="header_right">
        {search && (
          <div className="search_wrapper">
            <SearchIcon className="search_icon" />
            <input
              type="text"
              className="search_inp"
              onChange={search?.onChange}
              defaultValue={search?.query}
              placeholder={search?.placeholder}
            />
          </div>
        )}
        {rightChildren}
      </div>
    </header>
  );
};

export default Header;
