import React, { PureComponent } from "react";
import AsyncSelect from "react-select/async";

import { getGroups } from "../../../api";
import _ from "../../../i18n";

export default class GroupsSelect extends PureComponent {
  fetchGroups = (inputValue) => {
    const { community, auth, ttpApiUrl } = this.props;
    const { token } = auth;
    let customFilter = [];

    if (null !== inputValue) {
      customFilter = [
        {
          property: "name",
          value: inputValue,
          operator: "like",
        },
      ];
    }

    return getGroups({
      ttpApiUrl,
      token,
      clientId: community ? community.value : null,
      customFilter,
    }).then((result) => {
      return result.data.data;
    });
  };
  render() {
    const { selectedGroups, onChange, selectStyles } = this.props;

    return (
      <div
        style={{ display: "block", marginTop: "10px", marginBottom: "20px" }}
      >
        <AsyncSelect
          isMulti={true}
          cacheOptions
          styles={selectStyles}
          value={selectedGroups}
          onChange={(e) => onChange(e)}
          loadOptions={this.fetchGroups}
          defaultOptions={true}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          classNamePrefix="custom-select"
        />
      </div>
    );
  }
}
