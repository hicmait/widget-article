import React, { useRef } from "react";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";

import * as api from "Api";
import { getLanguage, getTagNameAttr } from "Utils";

import _ from "i18n";

export const TagsSelect = (props) => {
  const { selectedTags, onChange } = props;
  const lng = getLanguage();
  const nameAttr = getTagNameAttr(lng);
  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  // const _loadUsersSuggestions = useRef(
  //   debounce((query) => loadTagsSuggestions(query), 500)
  // ).current;

  const loadTagsSuggestions = (query) => {
    let filter = [];
    if (query && query.length > 2) {
      filter = [
        {
          property: nameAttr,
          value: query,
          operator: "like",
        },
      ];
      return api.getBlogTags({ token, filter, lng }).then((result) => {
        return result.data.data;
      });
    }
    return [];
  };

  return (
    <AsyncSelect
      isMulti
      value={selectedTags}
      onChange={onChange}
      placeholder={_("Select Tags ...")}
      getOptionLabel={(option) => `${option[nameAttr]}`}
      getOptionValue={(option) => option.id}
      loadOptions={loadTagsSuggestions}
    />
  );
};
