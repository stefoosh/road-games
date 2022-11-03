import React from "react";
import PropTypes from "prop-types";

const DateSelectorInput = ({ name, value, onChange }) => {
  return (
    <>
      <input className="form-control" type="date" name={name} value={value} onChange={onChange} required />
    </>
  );
};

DateSelectorInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateSelectorInput;
