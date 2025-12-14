import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AsyncSelect from "react-select/async";

import { getThemes } from "../../../api";
import { setArticle } from "../../../redux/actions";
import ThemePopOver from "./ThemePopOver";
import { IconPlus } from "../../common/Icons/IconPlus";
import _ from "../../../i18n";
import styles from "./ArticleConfiguration.module.scss";

export default function Theme(props) {
  const loadingThemes = useSelector((state) => state.themes.fetching);

  const theme = useSelector((state) => state.articles.article.theme);
  const token = useSelector((state) => state.auth.token);
  const loggedAs = useSelector((state) => state.auth.loggedAs);
  const ttpApiUrl = useSelector((state) => state.params.ttpApiUrl);
  const [showPopOver, setShowPopOver] = useState(false);
  const dispatch = useDispatch();

  const language = props.language;
  const titleAttr = `title${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;

  const fetchThemes = (inputValue) => {
    let customFilter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== language);

    if (null !== inputValue && inputValue.length > 0) {
      customFilter = [
        {
          property: titleAttr,
          value: inputValue,
          operator: "like",
        },
      ];

      if (lngs) {
        lngs.forEach((itm) => {
          let lngTitleAttr = `title${
            itm.charAt(0).toUpperCase() + itm.slice(1)
          }`;
          customFilter.push({
            property: lngTitleAttr,
            value: inputValue,
            operator: "like",
            filter: "or",
          });
        });
      }
    }
    return getThemes({
      ttpApiUrl,
      token,
      customFilter,
      sortField: titleAttr,
    }).then((result) => {
      const themeData = result.data.data;
      return themeData.map((t) => {
        return {
          title: t[titleAttr],
          id: t.id,
          pages: t.pages ? t.pages : [],
        };
      });
    });
  };

  const togglePopOver = () => {
    setShowPopOver(!showPopOver);
  };

  const handleChangeTheme = (theme) => {
    dispatch(setArticle({ index: "theme", value: theme }));
    dispatch(setArticle({ index: "pages", value: [] }));
  };

  return (
    <div
      className={`${styles.inputContainer} ${showPopOver ? styles.active : ""}`}
    >
      <AsyncSelect
        cacheOptions
        styles={props.selectStyles}
        value={theme}
        onChange={handleChangeTheme}
        isLoading={loadingThemes}
        loadOptions={fetchThemes}
        defaultOptions={true}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option.id}
        placeholder={_("article.select_theme")}
        className={styles.input}
      />
      {["CHIEF_EDITOR"].includes(loggedAs) && (
        <div className={styles.inputAdd} onClick={() => togglePopOver()}>
          <IconPlus />
          <ThemePopOver
            language={props.language}
            closePopOver={() => togglePopOver()}
          />
        </div>
      )}
    </div>
  );
}
