import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Col, Row } from "react-bootstrap";

import Button from "components/ui/button/Button";
import Header from "components/ui/header/Header";
import Input from "components/ui/input/Input";
// import { useGetAllSemsForStudentQuery } from "redux/admin/adminSlice";
import { Slide, toast } from "react-toastify";
import MarksTable from "./MarksTable";
import { useDispatch } from "react-redux";
import axios from "axios";
import { baseURL } from "api/axiosConfig";

const Consolidations = () => {
  const [rollNo, setRollNo] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const getAllSemsForStudentQuery = async () => {
    setIsLoading(true);
    const res = await axios({
      url: baseURL + "/get-student-consolidation-sems",
      method: "GET",
      headers: {
        Authorization: `bearer ${JSON.parse(localStorage.getItem("access"))}`,
      },
      params: { roll_no: rollNo },
    });

    if (res?.data?.data && res?.data?.data?.length === 0)
      toast("No Details Found", { type: "info", transition: Slide });

    console.log(res);
    const dt = await res?.data?.data;
    setIsLoading(false);

    setData(dt);
  };

  const handleConsolidationSubmit = (e) => {
    e.preventDefault();

    if (!rollNo) {
      toast("Please Fill Roll Number Field", {
        type: "error",
        transition: Slide,
      });
    } else {
      getAllSemsForStudentQuery();
      // setSkip(false);
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
          {data && data?.length !== 0 && (
            <MarksTable data={data} rollNo={rollNo} />
          )}
        </section>
      </div>
    </>
  );
};

export default Consolidations;
