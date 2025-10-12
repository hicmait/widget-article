import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Autosuggest from "react-autosuggest";

import { fetchAvatarsAndAuthors, setArticle } from "../../../redux/actions";
import {
  getUserNameForAvatar,
  addLandaSize,
  // getAuthorAllHeadlines,
  getAuthorHeadlines,
} from "../../../services/utils";
import { getTheme } from "../../../api";

import { IconClose } from "../../common/Icons";
import _ from "../../../i18n";
import styles from "./AuthorSuggestion.module.scss";
import "./AutoSuggest.scss";

export default function RenderAuthorSuggestions(props) {
  const [addingAuthor, setAddingAuthor] = useState(false);
  const [authorInputValue, setAuthorInputValue] = useState("");
  const avatarsAndUsersSuggestions = useSelector(
    (state) => state.users.mixedItems
  );
  const loadingAuthorSuggestions = useSelector((state) => state.users.fetching);
  const category = useSelector((state) => state.articles.article.category);
  const type = useSelector((state) => state.articles.article.type);
  const theme = useSelector((state) => state.articles.article.theme);
  const pages = useSelector((state) => state.articles.article.pages);
  const categories = useSelector((state) => state.categories.items);
  const themes = useSelector((state) => state.themes.items);
  const types = useSelector((state) => state.types.items);
  const token = useSelector((state) => state.auth.token);

  const dispatch = useDispatch();

  let { selectedCommunity, selectedLanguage } = props;

  const nameAttr = `name${
    selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
  }`;

  const toggleAddAuthor = () => {
    setAuthorInputValue("");
    setAddingAuthor(!addingAuthor);
  };

  const loadAuthorSuggestions = (value) => {
    const communityId = selectedCommunity ? selectedCommunity.id : null;
    dispatch(fetchAvatarsAndAuthors({ word: value, communityId }));
  };

  const handleSelectAuthor = async (newAuthor) => {
    let { authors, selectedLanguage } = props;
    if (newAuthor.isAuthor) {
      props.onAuthorChange({
        id: newAuthor.id,
        signature: {
          title: newAuthor.firstName + " " + newAuthor.lastName,
          head: getAuthorHeadlines(newAuthor, selectedLanguage),
        },
        enableAvatar: true,
        avatar: newAuthor.avatar,
        avatarUrl: newAuthor.avatar,
        firstName: newAuthor.firstName,
        lastName: newAuthor.lastName,
        priority: authors.length,
        isAuthor: true,
        // headlines: getAuthorAllHeadlines(newAuthor),
      });
      if (newAuthor.preferences) {
        if (newAuthor.preferences.category && !category) {
          let cat = categories.filter(
            (c) => c.id === newAuthor.preferences.category
          );
          if (cat && cat.length === 1) {
            const nameAttr = `name${
              selectedLanguage.charAt(0).toUpperCase() +
              selectedLanguage.slice(1)
            }`;
            const categoryName =
              cat[0][nameAttr] ||
              cat[0]["nameFr"] ||
              cat[0]["nameEn"] ||
              cat[0]["nameNl"];
            dispatch(
              setArticle({
                index: "category",
                value: { id: cat[0].id, name: categoryName },
              })
            );
          }
        }

        if (newAuthor.preferences.type && !type) {
          let typ = types.filter((c) => c.id === newAuthor.preferences.type);
          if (typ && typ.length === 1) {
            const nameAttr = `name${
              selectedLanguage.charAt(0).toUpperCase() +
              selectedLanguage.slice(1)
            }`;
            const typeName =
              typ[0][nameAttr] ||
              typ[0]["nameFr"] ||
              typ[0]["nameEn"] ||
              typ[0]["nameNl"];
            dispatch(
              setArticle({
                index: "type",
                value: { id: typ[0].id, name: typeName },
              })
            );
          }
        }

        if (newAuthor.preferences.theme && !theme) {
          try {
            const resp = await getTheme({
              token,
              themeId: newAuthor.preferences.theme,
            });
            const t = resp?.data?.data[0];
            if (t) {
              const titleAttr = `title${
                selectedLanguage.charAt(0).toUpperCase() +
                selectedLanguage.slice(1)
              }`;
              const themeTitle =
                t[titleAttr] || t["titleFr"] || t["titleEn"] || t["titleNl"];
              dispatch(
                setArticle({
                  index: "theme",
                  value: {
                    id: t.id,
                    title: themeTitle,
                    pages: t.pages ? t.pages : [],
                  },
                })
              );

              let pageAdded = false;
              if (
                newAuthor.preferences.pages &&
                newAuthor.preferences.pages.length > 0 &&
                t.pages.length > 0
              ) {
                let tab = [];
                t.pages?.forEach((p) => {
                  if (newAuthor.preferences.pages.includes(p.id)) {
                    const pageTitle =
                      p[titleAttr] ||
                      p["titleFr"] ||
                      p["titleEn"] ||
                      p["titleNl"];
                    tab.push({
                      id: p.id,
                      title: pageTitle,
                    });
                  }
                });
                if (tab.length > 0) {
                  pageAdded = true;
                  dispatch(setArticle({ index: "pages", value: tab }));
                }
              }

              if (!pageAdded) {
                dispatch(setArticle({ index: "pages", value: [] }));
              }
            }
          } catch (e) {}
        }
      }
    } else {
      let avatar = null;
      let avatarUrl = null;
      if (newAuthor.mediaChain) {
        let media = newAuthor.mediaChain.filter(
          (item) =>
            item.language === selectedLanguage && item?.type === "AVATAR"
        );
        if (media && media.length > 0) {
          avatar = media[0].avatar;
          avatarUrl = media[0].avatarUrl;
        }
      }

      props.onAuthorChange({
        id: newAuthor.id,
        signature: {
          title: newAuthor.company,
          head: newAuthor.headline,
        },
        company: newAuthor.company,
        head: newAuthor.headline,
        enableAvatar: true,
        avatar: avatarUrl,
        avatarUrl: avatarUrl,
        nameFr: newAuthor.nameFr,
        nameEn: newAuthor.nameEn,
        nameNl: newAuthor.nameNl,
        priority: authors.length,
        isAvatar: true,
      });

      if (newAuthor.preferences) {
        if (newAuthor.preferences.category && !category) {
          let cat = categories.filter(
            (c) => c.id === newAuthor.preferences.category
          );
          if (cat && cat.length === 1) {
            const nameAttr = `name${
              selectedLanguage.charAt(0).toUpperCase() +
              selectedLanguage.slice(1)
            }`;
            const categoryName =
              cat[0][nameAttr] ||
              cat[0]["nameFr"] ||
              cat[0]["nameEn"] ||
              cat[0]["nameNl"];
            dispatch(
              setArticle({
                index: "category",
                value: { id: cat[0].id, name: categoryName },
              })
            );
          }
        }
        if (newAuthor.preferences.type && !type) {
          let typ = types.filter((c) => c.id === newAuthor.preferences.type);
          if (typ && typ.length === 1) {
            const nameAttr = `name${
              selectedLanguage.charAt(0).toUpperCase() +
              selectedLanguage.slice(1)
            }`;
            const typeName =
              typ[0][nameAttr] ||
              typ[0]["nameFr"] ||
              typ[0]["nameEn"] ||
              typ[0]["nameNl"];
            dispatch(
              setArticle({
                index: "type",
                value: { id: typ[0].id, name: typeName },
              })
            );
          }
        }
        if (newAuthor.preferences.theme && !theme) {
          let t = themes.filter((c) => c.id === newAuthor.preferences.theme);
          if (t && t.length === 1) {
            const titleAttr = `title${
              selectedLanguage.charAt(0).toUpperCase() +
              selectedLanguage.slice(1)
            }`;
            const themeTitle =
              t[0][titleAttr] ||
              t[0]["titleFr"] ||
              t[0]["titleEn"] ||
              t[0]["titleNl"];
            dispatch(
              setArticle({
                index: "theme",
                value: {
                  id: t[0].id,
                  title: themeTitle,
                  pages: t[0].pages ? t[0].pages : [],
                },
              })
            );

            setTimeout(() => {
              let pageAdded = false;

              if (
                newAuthor.preferences.pages &&
                newAuthor.preferences.pages.length > 0 &&
                pages.length === 0
              ) {
                themes.map((th) => {
                  if (th.id === t[0].id) {
                    let tab = [];
                    th.pages?.forEach((p) => {
                      if (newAuthor.preferences.pages.includes(p.id)) {
                        const pageTitle =
                          p[titleAttr] ||
                          p["titleFr"] ||
                          p["titleEn"] ||
                          p["titleNl"];
                        tab.push({
                          id: p.id,
                          title: pageTitle,
                        });
                      }
                    });
                    if (tab.length > 0) {
                      pageAdded = true;
                      dispatch(setArticle({ index: "pages", value: tab }));
                    }
                  }
                });
              }

              if (!pageAdded) {
                dispatch(setArticle({ index: "pages", value: [] }));
              }
            }, 200);
          }
        }
      }
    }

    setAddingAuthor(false);
  };

  if (!addingAuthor) {
    if (!selectedCommunity) {
      return null;
    }
    return (
      <div className={styles.addCoauthor} onClick={toggleAddAuthor}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.1317 6.88466H9.11625V0.869191C9.11625 0.595162 8.74415 0.000976562 7.99997 0.000976562C7.25579 0.000976562 6.88368 0.595194 6.88368 0.869191V6.88469H0.868215C0.594218 6.88466 0 7.25676 0 8.00091C0 8.74506 0.594218 9.1172 0.868215 9.1172H6.88371V15.1327C6.88371 15.4067 7.25579 16.0009 8 16.0009C8.74421 16.0009 9.11629 15.4067 9.11629 15.1327V9.1172H15.1318C15.4058 9.1172 16 8.74512 16 8.00091C16 7.2567 15.4057 6.88466 15.1317 6.88466Z"
            fill="#6D7F92"
          />
        </svg>
      </div>
    );
  }

  const inputProps = {
    placeholder: _("article.type_author"),
    value: authorInputValue,
    onChange: (event, { newValue }) => setAuthorInputValue(newValue),
    autoFocus: true,
    spellCheck: false,
    autoCorrect: "off",
    className: styles.autoSuggestInput,
  };

  let avatarsL = avatarsAndUsersSuggestions.avatars
    ? avatarsAndUsersSuggestions.avatars
    : [];
  let usersL = avatarsAndUsersSuggestions.users
    ? avatarsAndUsersSuggestions.users
    : [];

  let avatarAndUsersList = avatarsAndUsersSuggestions
    ? [
        { title: _("article.chains"), suggestions: avatarsL },
        { title: _("article.authors"), suggestions: usersL },
      ]
    : [];
  return (
    <div>
      <span className={styles.closeCoauthor} onClick={toggleAddAuthor}>
        <IconClose />
      </span>
      <Autosuggest
        multiSection={true}
        suggestions={avatarAndUsersList}
        renderSectionTitle={(section) =>
          section.suggestions.length == 0 ? null : section.title
        }
        getSectionSuggestions={(section) => section.suggestions}
        shouldRenderSuggestions={(value) => value && value.trim().length > 2}
        onSuggestionsFetchRequested={({ value }) =>
          loadAuthorSuggestions(value)
        }
        onSuggestionSelected={(e, { suggestion }) => {
          handleSelectAuthor(suggestion);
        }}
        getSuggestionValue={(suggestion) => {
          return suggestion.isAuthor
            ? suggestion.firstName + " " + suggestion.lastName
            : suggestion[nameAttr];
        }}
        renderSuggestion={(suggestion) => {
          let avatarUrl = suggestion.avatar ? suggestion.avatar : null;

          if (!suggestion.isAuthor && suggestion.mediaChain) {
            let media = suggestion.mediaChain.filter(
              (item) =>
                item.language === selectedLanguage && item?.type === "AVATAR"
            );
            if (media && media.length > 0) {
              avatarUrl = media[0].avatarUrl;
            }
          }
          return (
            <div className={styles.coauthorSuggestion}>
              {avatarUrl ? (
                <div
                  className={styles.imgWrap}
                  style={{
                    backgroundImage: `url(${addLandaSize(avatarUrl, 240)})`,
                  }}
                ></div>
              ) : (
                <div className={`${styles.imgWrap} ${styles.emptyAvatar}`}>
                  <span style={{ fontSize: "inherit" }}>
                    {suggestion.isAuthor
                      ? getUserNameForAvatar(
                          suggestion.firstName,
                          suggestion.lastName
                        )
                      : getUserNameForAvatar(suggestion[nameAttr], "")}
                  </span>
                </div>
              )}

              {suggestion.isAuthor ? (
                <div className={styles.content}>
                  <h4>
                    {suggestion.firstName} {suggestion.lastName}
                  </h4>
                  <p>{suggestion.description}</p>
                </div>
              ) : (
                <div className={styles.content}>
                  <h4>{suggestion[nameAttr]}</h4>
                </div>
              )}
            </div>
          );
        }}
        inputProps={inputProps}
        renderSuggestionsContainer={({ containerProps, children, query }) => {
          return (
            <div {...containerProps}>
              {loadingAuthorSuggestions ? (
                <span className={styles.sidebarPlaceholder}>
                  {_("article.loading_suggestions")}
                </span>
              ) : (
                children
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
