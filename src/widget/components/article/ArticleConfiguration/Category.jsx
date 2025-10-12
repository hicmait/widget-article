import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import { setArticle } from "../../../redux/actions";
import { sortCategoriesAlphabetically } from "../../../services/utils";
import _ from "../../../i18n";

export default function Category(props) {
  const loadingCategories = useSelector((state) => state.categories.fetching);
  let categories = useSelector((state) => state.categories.items);

  const category = useSelector((state) => state.articles.article.category);
  const dispatch = useDispatch();

  const customFilter = (option, searchText) => {
    return option.data.name.toLowerCase().includes(searchText.toLowerCase());
  };

  const language = props.language;
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
      // label: (
      //   <div>
      //     <span className="first-letter" style={{ color: category.colorCode }}>
      //       {categoryName.charAt(0)}
      //     </span>
      //     {categoryName.slice(1)}
      //   </div>
      // ),
      name: categoryName,
    });
  });

  return (
    <Select
      styles={props.selectStyles}
      isLoading={loadingCategories}
      options={categoryOptions}
      filterOption={customFilter}
      placeholder={_("article.select_category")}
      value={category}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      onChange={(e) => dispatch(setArticle({ index: "category", value: e }))}
    />
  );
}
