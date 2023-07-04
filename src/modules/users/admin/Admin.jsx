import React from "react";

import Dashboard from "../Dashboard";

import "./Admin.scss";

const CARDS = [
  [
    {
      title: "Teachers",
      details: ["Preview Teachers", "Approve/Disapprove Teacher's"],
      path: "/admin/approve-or-disapprove-teachers",
    },
    {
      title: "Upload",
      details: [
        "Upload details of Students",
        "Upload Subject Details of a Classroom",
      ],
      path: "/admin/upload",
    },
  ],
  [
    {
      title: "Promote Students",
      details: ["Promote Students to next semester"],
      path: "/admin/promote-students",
    },
    {
      title: "Consolidations",
      details: ["Check the marks of a particular student"],
      path: "/admin/consolidations",
    },
  ],
];

const Admin = () => {
  return <Dashboard documentTitle="Admin" cards={CARDS} />;
  // return (
  //   <>
  //     <Helmet>
  //       <title>Assignments | Admin Dashboard</title>
  //     </Helmet>
  //     <div className="container-wrapper admin-dashboard">
  //       <Header title="Dashboard" />
  //       <section>
  //         <div className="cards-wrapper">
  //           {CARDS?.map((row, idx) => (
  //             <Row key={idx}>
  //               {row?.map((card) => (
  //                 <Col key={card?.title}>
  //                   <Card card={card} />
  //                 </Col>
  //               ))}
  //             </Row>
  //           ))}
  //         </div>
  //       </section>
  //     </div>
  //   </>
  // );
};

export default Admin;
