import React from "react";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";

import { getClients } from "../../../api";

export default function ClientSelect({
  isMulti,
  selectedClients,
  onChange,
  selectStyles,
}) {
  const token = useSelector((state) => state.auth.token);

  const fetchClients = (inputValue) => {
    return getClients({
      token,
      search: inputValue,
    }).then((result) => {
      return result.data.data
        .map((element) => {
          if (element.legalRepresentative) {
            return {
              id: element.legalRepresentative.id,
              name: `${element.legalRepresentative.firstName} ${element.legalRepresentative.lastName}`,
            };
          }
          return null;
        })
        .filter(Boolean);
    });
  };

  return (
    <div style={{ display: "block", marginTop: "10px", marginBottom: "20px" }}>
      <AsyncSelect
        isMulti={isMulti}
        cacheOptions
        value={selectedClients}
        styles={selectStyles}
        onChange={(e) => onChange(e)}
        loadOptions={fetchClients}
        defaultOptions={true}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
        classNamePrefix="custom-select"
      />
    </div>
  );
}
