import React from "react";
import { useSelector, useDispatch } from "react-redux";
import AsyncCreatableSelect from "react-select/async-creatable";

import { getTags } from "Api";
import _ from "i18n";

export default function TagsSelect(props) {
  const { language } = props;
  const token = useSelector((state) => state.auth.token);

  const nameAttr = `name${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;

  const fetchTags = (inputValue) => {
    let customFilter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== language);

    if (null !== inputValue) {
      customFilter = [
        {
          property: nameAttr,
          value: inputValue,
          operator: "like",
        },
      ];

      if (lngs) {
        lngs.forEach((itm) => {
          let lngNameAttr = `name${itm.charAt(0).toUpperCase() + itm.slice(1)}`;
          customFilter.push({
            property: lngNameAttr,
            value: inputValue,
            operator: "eq",
            logicalOperator: "OR",
          });
        });
      }
    }
    return getTags({
      token,
      language,
      customFilter,
    }).then((result) => {
      const tags = result.data.data;
      return tags.map((tag) => {
        return { label: tag[nameAttr], value: tag.id };
      });
    });
  };

  return (
    <AsyncCreatableSelect
      isMulti
      cacheOptions
      value={props.selectedTags}
      onChange={(e) => props.onChange(e)}
      loadOptions={fetchTags}
      createOptionPosition="first"
      styles={props.selectStyles}
    />
  );
}
