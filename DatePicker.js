import React, { useReducer, useEffect, useState, useCallback } from 'react';
import Select, { OnChangeValue } from 'react-select';
import DatePicker from 'react-datepicker';

import {parseComplexDate} from '../../util/util';

import './DatePicker.css';

import { registerLocale, setDefaultLocale } from  "react-datepicker";
import tr from 'date-fns/locale/tr';
import { parseISO, format } from 'date-fns';
registerLocale('tr', tr);


const DateSelect = (props) => {
  const [isValid, setIsValid] = useState(props.initialValid || false);
  const [date, setDate] = useState();
  


  useEffect(() => {
   
    if (props.initialValue) {
     setDate(parseISO(props.initialValue));
     props.onInput(props.id, props.initialValue, true);
    }
    
  }, []);

  const handleChange = useCallback((selectedDate) => {

    if (selectedDate) {
      setDate(selectedDate);
      props.onInput(props.id, parseComplexDate(selectedDate), true);
      setIsValid(true);
    } else {
      if(props.nonrequired){
        props.onInput(props.id, '', true);
        setDate('');
        setIsValid(true);
    }
    else
    {
      props.onInput(props.id, '', false);
      setDate('');
      setIsValid(false);
    }
    }
  });

  return (
    <div className="form-control">
      <label htmlFor={props.id}>{props.label}</label>

      <DatePicker
        autoComplete="off"
        id={props.id}
        dateFormat="yyyy/MM/dd"
        locale="tr"
        className="datepickerclass"
        selected={date}
        onChange={(date) => handleChange(date)}
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

export default DateSelect;
