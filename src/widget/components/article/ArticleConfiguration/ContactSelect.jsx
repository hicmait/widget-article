import React from "react";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";

import { getContacts } from "../../../api";

export default function ContactSelect({
  isMulti,
  selectedContacts,
  organizationId,
  onChange,
  selectStyles,
}) {
  const token = useSelector((state) => state.auth.token);

  const fetchContacts = (inputValue) => {
    return getContacts({
      token,
      organizationId,
      search: inputValue,
    }).then((result) => {
      return result.data.data;
    });
  };

  return (
    <div style={{ display: "block", marginTop: "10px", marginBottom: "20px" }}>
      <AsyncSelect
        isMulti={isMulti}
        cacheOptions
        value={selectedContacts}
        styles={selectStyles}
        onChange={(e) => onChange(e)}
        loadOptions={fetchContacts}
        defaultOptions={true}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        getOptionValue={(option) => option.id}
        classNamePrefix="custom-select"
      />
    </div>
  );
}
