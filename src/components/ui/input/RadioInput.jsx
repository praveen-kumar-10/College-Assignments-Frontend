import React from "react";
import { Form, Col, Row } from "react-bootstrap";

import "./base.scss";

const RadioInput = ({
  label,
  value,
  name,
  required,
  radioInputs,
  onChange,
  error,
  disabled,
}) => {
  return (
    <Form.Group className={`input_wrapper`}>
      {label && (
        <Form.Label>
          {label}
          {required && <span className="asterisk">*</span>}
        </Form.Label>
      )}
      <Row>
        {radioInputs &&
          radioInputs.map((item) => {
            const isChecked = value === item.value;
            return (
              <Col
                key={item.value}
                onClick={!disabled ? () => onChange(item.value) : () => {}}
              >
                <Form.Check
                  key={item.value}
                  // onClick={() => onChange(item.value)}
                  onClick={!disabled ? () => onChange(item.value) : () => {}}
                  type="radio"
                  className={isChecked ? "radio_check_input" : null}
                  style={
                    isChecked
                      ? {
                          background: "#F4F7FF",
                        }
                      : {}
                  }
                >
                  <Form.Check.Input
                    type="radio"
                    name={name}
                    value={item.value}
                    onChange={(e) => onChange(e.target.value)}
                    checked={isChecked}
                    disabled={disabled}
                  />
                  <Form.Check.Label
                    style={
                      isChecked ? { color: "#413DF2", fontWeight: 600 } : {}
                    }
                  >
                    {item.label}
                  </Form.Check.Label>
                </Form.Check>
              </Col>
            );
          })}
      </Row>
      {error && <span className="error-message">{error}</span>}
    </Form.Group>
  );
};

export default RadioInput;
