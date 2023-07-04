import React from "react";
import { Form } from "react-bootstrap";

import "./base.scss";

const Select = ({ label, required, ...other }) => {
  const {
    name,
    value,
    options,
    optionInitialValue,
    optionKey,
    optionValue,
    valueLength,
    onChange,
    disabled,
    isRequired,
    error,
  } = other;

  return (
    <Form.Group className="input_wrapper">
      {label && (
        <Form.Label>
          {label}
          {required && <span className="asterisk">*</span>}
          {isRequired && <span className="asterisk">*</span>}
        </Form.Label>
      )}
      <Form.Select {...{ name, value, required, disabled, onChange }}>
        {optionInitialValue === "" && (
          <option value={optionInitialValue}>Select</option>
        )}
        {options && Array.isArray(options) && (
          <>
            {options.map((item) => {
              const value = optionValue ? item[optionValue] : item;
              const key = optionKey ? item[optionKey] : item;
              const vl = valueLength ? valueLength : 40;

              return (
                <option key={value} value={value}>
                  {key.length > vl ? key.substring(0, vl) + "..." : key}
                </option>
              );
            })}
          </>
        )}
        {options && !Array.isArray(options) && (
          <>
            {Object.entries(options).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </>
        )}
      </Form.Select>
      {error && <span className="error_message">{error}</span>}
    </Form.Group>
  );
};

// const Select = ({
//   label,
//   required,
//   name,
//   value,
//   onChange,
//   disabled,
//   optionInitialValue,
//   options,
//   optionKey,
//   optionValue,
//   valueLength,
// }) => {
//   return (
//     <Form.Group className={`input__wrapper`}>
//       {label && (
//         <Form.Label>
//           {label}
//           {required && <span className="asterisk">*</span>}
//         </Form.Label>
//       )}
//       <Form.Select
//         name={name}
//         value={value}
//         onChange={onChange}
//         disabled={disabled}
//         required
//       >
//         {optionInitialValue === "" && (
//           <option value={optionInitialValue}>Select</option>
//         )}
//         {options && Array.isArray(options) && (
//           <>
//             {options.map((item) => {
//               const value = optionValue ? item[optionValue] : item;
//               const key = optionKey ? item[optionKey] : item;
//               const vl = valueLength ? valueLength : 40;

//               return (
//                 <option key={value} value={value}>
//                   {key.length > vl ? key.substring(0, vl) + "..." : key}
//                 </option>
//               );
//             })}
//           </>
//         )}
//         {options && !Array.isArray(options) && (
//           <>
//             {Object.entries(options).map(([key, value]) => (
//               <option key={key} value={value}>
//                 {key}
//               </option>
//             ))}
//           </>
//         )}
//       </Form.Select>
//     </Form.Group>
//   );
// };

export default Select;
