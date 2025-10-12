import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import { setArticle } from "../../../redux/actions";
import { sortCategoriesAlphabetically } from "../../../services/utils";
import _ from "../../../i18n";

export default function Types(props) {
  const loadingTypes = useSelector((state) => state.types.fetching);
  let types = useSelector((state) => state.types.items);

  const type = useSelector((state) => state.articles.article.type);
  const dispatch = useDispatch();

  const customFilter = (option, searchText) => {
    return option.data.name.toLowerCase().includes(searchText.toLowerCase());
  };

  const language = props.language;
  let typeOptions = [];
  const nameAttr = `name${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;

  types = sortCategoriesAlphabetically(types, nameAttr);

  types.map((type, index) => {
    const typeName =
      type[nameAttr] || type["nameFr"] || type["nameEn"] || type["nameNl"];
    typeOptions.push({
      id: type.id,
      // label: (
      //   <div>
      //     <span className="first-letter" style={{ color: type.colorCode }}>
      //       {type.name.charAt(0)}
      //     </span>
      //     {type.name.slice(1)}
      //   </div>
      // ),
      name: typeName,
    });
  });

  return (
    <Select
      styles={props.selectStyles}
      isLoading={loadingTypes}
      options={typeOptions}
      filterOption={customFilter}
      placeholder={_("article.select_type")}
      value={type}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      onChange={(e) => dispatch(setArticle({ index: "type", value: e }))}
    />
  );
}
