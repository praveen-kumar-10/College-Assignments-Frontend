import React from "react";
import { Spinner } from "react-bootstrap";

const ComponentLoader = ({ isLoading, error, isEmpty }) => {
  if (isLoading || error || isEmpty)
    return (
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading && <Spinner />}
        {isEmpty && <h6>No Data Found</h6>}
        {error && <h6 className="text-danger">{error?.message}</h6>}
      </section>
    );
  else return <></>;
};

export default ComponentLoader;
