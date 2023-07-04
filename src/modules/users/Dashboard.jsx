import Card from "components/ui/card/Card";
import Header from "components/ui/header/Header";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";

import "./Dashboard.scss";

const Dashboard = ({ documentTitle, cards }) => {
  return (
    <>
      <Helmet>
        <title>Assignments | {documentTitle} Dashboard</title>
      </Helmet>
      <div className="container-wrapper admin-dashboard">
        <Header title="Dashboard" />
        <section>
          <div className="cards-wrapper">
            {cards?.map((row, idx) => (
              <Row key={idx}>
                {row?.map((card) => (
                  <Col key={card?.title}>
                    <Card card={card} />
                  </Col>
                ))}
              </Row>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
