import React from "react";
import PropTypes from "prop-types";

const RadioModeButton = ({ id, checked, onchange, labelClassName, labelValue }) => {
  return (
    <>
      <input
        type="radio"
        className="btn-check"
        name={id}
        id={id}
        autoComplete="off"
        checked={checked}
        onChange={onchange}
      />
      <label className={labelClassName} htmlFor={id}>
        {labelValue}
      </label>
    </>
  );
};

RadioModeButton.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onchange: PropTypes.func.isRequired,
  labelClassName: PropTypes.string.isRequired,
  labelValue: PropTypes.string.isRequired,
};

export default RadioModeButton;
