import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

import _ from "i18n";

export default function ThemeSelect(props) {
  const themesLoading = useSelector((state) => state.themes.fetching);
  let themes = useSelector((state) => state.themes.items);

  const language = props.lng;
  const titleAttr = `title${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;

  let themeOptions = [];
  themes.map((theme, index) => {
    const themeTitle =
      theme[titleAttr] ||
      theme["titleFr"] ||
      theme["titleEn"] ||
      theme["titleNl"];
    themeOptions.push({
      id: theme.id,
      title: themeTitle,
    });
  });

  const customFilter = (option, searchText) => {
    return option.data.title.toLowerCase().includes(searchText.toLowerCase());
  };

  return (
    <Select
      styles={props.selectStyles}
      isLoading={themesLoading}
      options={themeOptions}
      filterOption={customFilter}
      placeholder={_("article.select_theme")}
      value={props.selectedValue}
      getOptionLabel={(option) => option.title}
      getOptionValue={(option) => option.id}
      onChange={props.onChange}
    />
  );
}
