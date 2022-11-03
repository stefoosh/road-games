import React from "react";

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
      />
    </>
  );
};

export default DateSelectorInput;
