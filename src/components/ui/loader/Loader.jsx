import React from "react";
import { Spinner } from "react-bootstrap";

import "./Loader.scss";

const Loader = ({ isLoading }) => {
  if (isLoading)
    return (
      <div className="backdrop-global-loader">
        <Spinner animation="border" variant="light" />
      </div>
    );
};

export default Loader;
