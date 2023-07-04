import React, { useState } from "react";
import { Card, Col, Nav, Row } from "react-bootstrap";

import { ReactComponent as ArrowRight } from "assets/icons/ArrowRight.svg";

import { useGetSemDetailsForStudentQuery } from "redux/admin/adminSlice";

const MarksTable = ({ data, rollNo }) => {
  const [semDetails, setSemDetails] = useState({});
  const [skip, setSkip] = useState(true);
  const {
    data: semResponse,
    isLoading,
    error,
  } = useGetSemDetailsForStudentQuery(semDetails, {
    skip,
  });

  const handleSemClick = (item) => {
    setSkip(false);
    setSemDetails({ ...item, roll_no: rollNo });
  };
  return (
    <>
      <Card>
        <Card.Header>
          <Nav variant="pills">
            {data?.map((item) => (
              <Nav.Item key={item?.sem} onClick={() => handleSemClick(item)}>
                <Nav.Link className="text-white" href={"#" + item?.sem}>
                  {item?.sem}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Card.Header>
        {semResponse && (
          <Card.Body>
            <div className={`table-wrapper`}>
              <Row className="table-header">
                <Col>Subject</Col>
                <Col>Marks</Col>
              </Row>
              {semResponse?.data &&
                Object.entries(semResponse.data)?.map(
                  ([subject, assignments]) => (
                    <TableRow
                      {...{ subject, marks: 0, assignments, level: 1 }}
                    />
                  )
                )}
              <Row className="table-footer">
                <Col>Total</Col>
                <Col>20</Col>
              </Row>
            </div>
          </Card.Body>
        )}
      </Card>
    </>
  );
};

export default MarksTable;

const TableRow = ({ subject, marks, assignments, level }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="table-body">
      <Row className={`level-${level}`}>
        <Col>
          {subject}{" "}
          {level === 1 && (
            <>
              {JSON.stringify(assignments) !== "{}" && (
                <>
                  {!show && (
                    <ArrowRight
                      className="arrow-right"
                      onClick={() => setShow(true)}
                    />
                  )}
                  {show && (
                    <ArrowRight
                      className="arrow-down"
                      onClick={() => setShow(false)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Col>
        <Col>{marks || "-"}</Col>
      </Row>
      {show &&
        assignments &&
        Object.entries(assignments)?.map(([subject, marks]) => (
          <TableRow {...{ subject, marks, level: level + 1 }} />
        ))}
    </div>
  );
};
