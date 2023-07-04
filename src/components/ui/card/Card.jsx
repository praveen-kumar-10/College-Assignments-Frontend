import React from "react";
import { useNavigate } from "react-router-dom";
import { Card as Crd } from "react-bootstrap";

const Card = ({ card }) => {
  const navigate = useNavigate();
  return (
    <Crd>
      <Crd.Header as="h5">{card?.title}</Crd.Header>
      <Crd.Body>
        <ul>
          {card?.details?.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button onClick={() => navigate(card?.path)}>
          View {card?.title} Page
        </button>
      </Crd.Body>
    </Crd>
  );
};

export default Card;
