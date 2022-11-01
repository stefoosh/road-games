import React from "react";

const DateSelectorInput = ({ name, placeholder, value, onChange }) => {
  return (
    <>
      <label htmlFor={name}>{placeholder}</label>
      <input type="date" name={name} placeholder={placeholder} value={value} onChange={onChange} />
    </>
  );
};

export default DateSelectorInput;
