import React from "react";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";

import { getCollaborators } from "../../../api";

export default function CollaboratorsSelect({
  isMulti,
  selectedCollaborators,
  organizationId,
  onChange,
  selectStyles,
}) {
  const token = useSelector((state) => state.auth.token);
  const ttpApiUrl = useSelector((state) => state.params.ttpApiUrl);

  const fetchCollaborators = (inputValue) => {
    return getCollaborators({
      ttpApiUrl,
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
        value={selectedCollaborators}
        styles={selectStyles}
        onChange={(e) => onChange(e)}
        loadOptions={fetchCollaborators}
        defaultOptions={true}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        getOptionValue={(option) => option.id}
        classNamePrefix="custom-select"
      />
    </div>
  );
}
