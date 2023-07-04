import React from "react";

import { Modal as Md } from "react-bootstrap";

import "./Modal.scss";

const Modal = ({
  title,
  size,
  show,
  onHide,
  body,
  footerRight,
  footerLeft,
  isCloseBtn,
  className,
}) => {
  return (
    <Md {...{ show, onHide, size, className }} centered>
      <Md.Header closeButton>
        <Md.Title>{title}</Md.Title>
      </Md.Header>
      <Md.Body>{body}</Md.Body>
      <Md.Footer>
        <div className="footer__left">{footerLeft}</div>
        <div className="footer__right">
          {isCloseBtn && <button onClick={onHide}>Close</button>}
          {footerRight}
        </div>
      </Md.Footer>
    </Md>
  );
};

export default Modal;
