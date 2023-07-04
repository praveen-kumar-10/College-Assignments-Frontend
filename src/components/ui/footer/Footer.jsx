import React from "react";

const Footer = ({ leftChildren, rightChildren }) => {
  return (
    <footer>
      <div className="footer_left"></div>
      <div className="footer_right">{rightChildren}</div>
    </footer>
  );
};

export default Footer;
