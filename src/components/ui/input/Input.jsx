import React, { useState } from "react";
import { Form } from "react-bootstrap";

import { ReactComponent as EyeIcon } from "assets/icons/eye.svg";
import { ReactComponent as EyeOffIcon } from "assets/icons/eye-off.svg";

import "./base.scss";

// const Input = React.forwardRef(
//   ({ label, required, error, success, errorCond, touched, ...other }, ref) => {
//     return (
//       <Form.Group className={`input__wrapper`}>
//         {label && (
//           <Form.Label>
//             {label}
//             {required && <span className="asterisk">*</span>}
//           </Form.Label>
//         )}
//         <Form.Control
//           ref={ref}
//           className={`${touched ? (errorCond ? "error" : "success") : ""}`}
//           {...other}
//           required
//         />
//         {errorCond && <span className="error__message">{error}</span>}
//       </Form.Group>
//     );
//   }
// );

const Input = ({ label, required, error, ...other }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Form.Group className="input_wrapper">
      {label && (
        <Form.Label>
          {label} {required && <span className="asterisk">*</span>}
        </Form.Label>
      )}
      <Form.Control
        {...{ required, ...other }}
        type={
          other?.type === "password"
            ? showPassword
              ? "text"
              : "password"
            : other?.type
        }
      />
      {other?.type && other?.type === "password" && (
        <>
          {!showPassword ? (
            <EyeOffIcon
              className="eye-icon"
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <EyeIcon
              className="eye-icon"
              onClick={() => setShowPassword(false)}
            />
          )}
        </>
      )}
      {error && <span className="error_message">{error}</span>}
    </Form.Group>
  );
};

export default Input;
