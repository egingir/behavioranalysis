import React, { useReducer, useEffect, useState, useCallback } from "react";
import Select, { OnChangeValue } from "react-select";

import "./Select.css";

const CustomSelect = (props) => {
  const [isValid, setIsValid] = useState(props.initialValid || false);
  const [selection, setSelection] = useState(props.initialValue);

  useEffect(() => {
    if (props.initialValue) {
      handleChange(props.initialValue);
    }
  }, []);

  const handleChange = useCallback((selectedoption) => {
    if (!props.isMulti) {
      setSelection(selectedoption);
      setIsValid(true);
      props.onInput(props.id, selectedoption.value, true);

      if (props.fireChange) {
        props.fireChange(selectedoption.value);
      }
    } else {
      if (selectedoption) {
        setSelection(selectedoption);
        props.onInput(
          props.id,
          selectedoption.map((item) => item.value),
          true
        );
        setIsValid(true);
      } else {
        props.onInput(props.id, [], false);
        setSelection([]);
        setIsValid(false);
      }
    }
  });

  return (
    <div className="form-control">
      <label htmlFor={props.id}>{props.label}</label>

      <Select
        id={props.id}
        isDisabled={props.disabled}
        isSearchable={true}
        value={selection}
        isMulti={props.isMulti}
        onChange={handleChange}
        options={props.options}
        placeholder="Seçiniz"
      />
    </div>
  );
};

//   useEffect(() => {
//     onInput(id, value, isValid);
//   }, [id, value, isValid, onInput]);

//   const changeHandler = event => {
//     dispatch({
//       type: 'CHANGE',
//       val: event.target.value,
//       validators: props.validators
//     });
//   };

//   const touchHandler = () => {
//     dispatch({
//       type: 'TOUCH'
//     });
//   };

//   return (
//     <div
//       className={`form-control ${!inputState.isValid &&
//         inputState.isTouched &&
//         'form-control--invalid'}`}
//     >
//       <label htmlFor={props.id}>{props.label}</label>
//       <select
//         id={props.id}
//         type={props.type}
//         placeholder={props.placeholder}
//         onChange={changeHandler}
//         onBlur={touchHandler}
//         value={inputState.value}
//       />
//       {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
//     </div>
//   );
// };

export default CustomSelect;
