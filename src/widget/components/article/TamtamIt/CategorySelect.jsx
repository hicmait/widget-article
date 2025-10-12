import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import { sortCategoriesAlphabetically } from "Utils";
import _ from "i18n";

export default function CategorySelect(props) {
  const language = props.lng;
  let categories = useSelector((state) => state.categories.items);
  const isLoading = useSelector((state) => state.categories.fetching);

  let categoryOptions = [];
  const nameAttr = `name${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;

  categories = sortCategoriesAlphabetically(categories, nameAttr);

  categories.map((category, index) => {
    const categoryName =
      category[nameAttr] ||
      category["nameFr"] ||
      category["nameEn"] ||
      category["nameNl"];
    categoryOptions.push({
      id: category.id,
      name: categoryName,
    });
  });

  const customFilter = (option, searchText) => {
    return option.data.name.toLowerCase().includes(searchText.toLowerCase());
  };

  if (isLoading) return null;

  return (
    <Select
      styles={props.selectStyles}
      isLoading={isLoading}
      options={categoryOptions}
      filterOption={customFilter}
      placeholder={_("select_category")}
      value={props.selectedValue}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      onChange={props.onChange}
    />
  );
}
