import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Col, Row } from "react-bootstrap";

import Button from "components/ui/button/Button";
import Header from "components/ui/header/Header";
import Input from "components/ui/input/Input";
import { useGetAllSemsForStudentQuery } from "redux/admin/adminSlice";
import { Slide, toast } from "react-toastify";
import MarksTable from "./MarksTable";

const Consolidations = () => {
  const [rollNo, setRollNo] = useState("");
  const [skip, setSkip] = useState(true);

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetAllSemsForStudentQuery(
    {
      roll_no: rollNo,
    },
    {
      skip,
    }
  );

  const handleConsolidationSubmit = (e) => {
    e.preventDefault();

    if (!rollNo)
      toast("Please Fill Roll Number Field", {
        type: "error",
        transition: Slide,
      });
    else {
      setSkip(false);
      // refetch();
    }
  };

  return (
    <>
      <Helmet>
        <title>Assignments | Consolidations</title>
      </Helmet>
      <div className="container-wrapper consolidations">
        <Header title="Consolidations" />
        <section>
          <form onSubmit={handleConsolidationSubmit}>
            <Row>
              <Col>
                <Input
                  name="roll_no"
                  label="Roll Number"
                  required
                  value={rollNo}
                  onChange={(e) => {
                    setSkip(true);
                    setRollNo(e.target.value);
                  }}
                />
              </Col>
              <Col>
                <Button type="submit" isLoading={isLoading}>
                  Submit
                </Button>
              </Col>
            </Row>
          </form>
          {response && response?.success === "1" && (
            <MarksTable data={response?.data} rollNo={rollNo} />
          )}
        </section>
      </div>
    </>
  );
};

export default Consolidations;
