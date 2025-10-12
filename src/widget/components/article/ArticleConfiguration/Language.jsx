import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import {
  //fetchTypes,
  fetchThemes,
  setArticle,
  setThemeCurrentLanguage,
  fetchArticleTags,
  changeTagsLanguage,
} from "../../../redux/actions";

import _ from "../../../i18n";

const languages = {
  en: _("article.english"),
  fr: _("article.french"),
  nl: _("article.dutch"),
};

export default function Language(props) {
  let { allowedLanguages } = props;

  // const selectedLanguage = useSelector(
  //   (state) => state.articles.article.selectedLanguage
  // );
  const selectedLanguage = {
    value: props.language,
    label: languages[props.language],
  };

  const community = useSelector((state) => state.articles.article.community);
  const articleTitle = useSelector((state) => state.articles.article.title);
  const editArticleId = useSelector((state) => state.articles.article.id);
  const tags = useSelector((state) => state.articles.article.tags);
  const dispatch = useDispatch();

  let languageOptions = [];

  if (allowedLanguages.length === 0) {
    // const language = selectedLanguage ? selectedLanguage : props.language;
    languageOptions.push(selectedLanguage);
  } else {
    languageOptions = allowedLanguages.map((l) => {
      return { value: l, label: languages[l] };
    });
  }

  const handleChangeLanguage = (language) => {
    dispatch(setArticle({ index: "selectedLanguage", value: language.value }));
    dispatch(setArticle({ index: "pages", value: [] }));
    dispatch(setArticle({ index: "theme", value: null }));
    //dispatch(setArticle({ index: "type", value: null }));
    dispatch(setThemeCurrentLanguage(language.value));

    const communityId = community.value;
    //dispatch(fetchTypes({ language: language.value, communityId }));
    // dispatch(fetchThemes({ language: language.value, communityId })).then(
    //   (resp) => {
    //     let themes = resp.payload.data.data;
    //     if (themes && themes.length == 1) {
    //       dispatch(setArticle({ index: "theme", value: themes[0] }));
    //       if (themes[0].pages && themes[0].pages.length == 1) {
    //         let page = themes[0].pages[0];
    //         dispatch(setArticle({ index: "pages", value: [page] }));
    //       }
    //     }
    //   }
    // );

    if (!editArticleId) {
      if (tags?.length > 0) {
        dispatch(changeTagsLanguage(language.value));
      } else {
        // dispatch(setArticle({ index: "tags", value: [] }));
        dispatch(
          fetchArticleTags({
            language: language.value,
            title: articleTitle,
            content: props.content.replace(/<[^>]+>/g, ""),
          })
        ).then((resp) => {
          if (resp.payload) {
            const data = resp.payload.data.data;
            if (data) {
              const length = data.length;
              let tags = [];
              if (length < 8) {
                tags = data.map((tag) => {
                  return { label: tag.name, value: tag.id };
                });
              } else {
                for (let i = 0; i < 7; i++) {
                  tags.push({ label: data[i].name, value: data[i].id });
                }
              }
              dispatch(
                setArticle({
                  index: "tags",
                  value: tags,
                })
              );
            }
          }
        });
      }
    } else {
      dispatch(changeTagsLanguage(language.value));
    }
  };

  return (
    <Select
      styles={props.selectStyles}
      options={languageOptions}
      placeholder={_("article.select_language")}
      value={selectedLanguage}
      onChange={handleChangeLanguage}
    />
  );
}
