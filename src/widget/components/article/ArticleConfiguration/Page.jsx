import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import { setArticle } from "../../../redux/actions";
import PagePopOver from "./PagePopOver";
import { IconPlus } from "../../common/Icons/IconPlus";
import styles from "./ArticleConfiguration.module.scss";
import _ from "../../../i18n";

export default function Page(props) {
  const loadingThemes = useSelector((state) => state.themes.fetching);

  const pages = useSelector((state) => state.articles.article.pages);
  const selectedLanguage = useSelector(
    (state) => state.articles.article.selectedLanguage
  );
  const loggedAs = useSelector((state) => state.auth.loggedAs);
  const [showPopOver, setShowPopOver] = useState(false);
  const dispatch = useDispatch();

  const theme = useSelector((state) => state.articles.article.theme);
  const [pageOptions, setPageOptions] = useState([]);

  const language = props.language;
  const titleAttr = `title${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;

  useEffect(() => {
    if (theme) {
      let tab = [];
      theme.pages?.map((page) => {
        const pageTitle =
          page[titleAttr] ||
          page["titleFr"] ||
          page["titleEn"] ||
          page["titleNl"];
        tab.push({
          id: page.id,
          title: pageTitle,
        });
      });
      setPageOptions(tab);
    }
  }, [theme]);

  const togglePopOver = () => {
    setShowPopOver(!showPopOver);
  };

  return (
    <div
      className={`${styles.inputContainer} ${showPopOver ? styles.active : ""}`}
    >
      <Select
        styles={props.selectStyles}
        isLoading={loadingThemes}
        options={pageOptions}
        className={styles.input}
        placeholder={_("article.select_page")}
        value={pages}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option.id}
        onChange={(e) => dispatch(setArticle({ index: "pages", value: e }))}
        isMulti
      />
      {["CHIEF_EDITOR"].includes(loggedAs) && (
        <div className={styles.inputAdd} onClick={() => togglePopOver()}>
          <IconPlus />
          <PagePopOver
            language={selectedLanguage}
            closePopOver={() => togglePopOver()}
          />
        </div>
      )}
    </div>
  );
}
