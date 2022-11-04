import React from "react";
import PropTypes from "prop-types";

const SearchableDataList = ({ inputId, dataListId, placeholder, onBlur, disabled, options }) => {
  return (
    <>
      <input
        className="form-control"
        id={inputId}
        list={dataListId}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
      />
      <datalist id={dataListId}>{options}</datalist>
    </>
  );
};

SearchableDataList.propTypes = {
  inputId: PropTypes.string.isRequired,
  dataListId: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onBlur: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  options: PropTypes.any,
};

export default SearchableDataList;
