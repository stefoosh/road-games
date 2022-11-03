import React from "react";
import PropTypes from "prop-types";

const DateSelectorInput = ({ name, placeholder, value, onChange }) => {
  return (
    <>
      <label htmlFor={name} className="form-label">
        {placeholder}
      </label>
      <input
        className="form-control"
        type="date"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </>
  );
};

DateSelectorInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateSelectorInput;
