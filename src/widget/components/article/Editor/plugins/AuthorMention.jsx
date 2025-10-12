import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TTP_BLOG_URL } from "../../../../services/config";

import {
  getUserNameForAvatar,
  addLandaSize,
  sanitize,
} from "../../../../services/utils";

import { IconClose } from "../../../common/Icons";
import _ from "../../../../i18n";
import styles from "./AuthorMention.module.scss";
import Loader from "./Loader";
export default function AuthorMention({
  suggestionsPosition,
  language,
  closeMention,
  onSelectSuggestion,
}) {
  const avatarsAndUsersSuggestions = useSelector(
    (state) => state.users.mixedItems
  );
  const loadingAuthorSuggestions = useSelector((state) => state.users.fetching);

  const nameAttr = `name${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;
  const lng = useSelector((state) => state.params.lng);
  const uaQueryParams = useSelector((state) => state.params.uaQueryParams);

  const handleSelectAuthor = async (newAuthor) => {
    let url = "";

    if (newAuthor.isAuthor) {
      // insert author link
      url = `${TTP_BLOG_URL}/${language}/author/${newAuthor.url}/${newAuthor.id}`;

      onSelectSuggestion(
        `<a href="${url}"> ${newAuthor.firstName} ${newAuthor.lastName}</a>`
      );
      closeMention();
    } else {
      // insert chain link
      const chainName =
        newAuthor[
          `name${language.charAt(0).toUpperCase()}${language.slice(1)}`
        ];
      url = `${TTP_BLOG_URL}/${language}/chain/${sanitize(chainName)}/${
        newAuthor.id
      }`;

      if (language === "en") {
        onSelectSuggestion(`<a href="${url}"> ${newAuthor.nameEn} </a>`);
      } else if (language === "fr")
        onSelectSuggestion(`<a href="${url}"> ${newAuthor.nameFr} </a>`);
      else onSelectSuggestion(`<a href="${url}"> ${newAuthor.nameNl} </a>`);
      closeMention();
    }
  };

  let avatarsL = avatarsAndUsersSuggestions.avatars
    ? avatarsAndUsersSuggestions.avatars
    : [];
  let usersL = avatarsAndUsersSuggestions.users
    ? avatarsAndUsersSuggestions.users
    : [];

  let avatarAndUsersList = avatarsAndUsersSuggestions
    ? {
        chains: avatarsL,
        authors: usersL,
      }
    : { chains: [], authors: [] };

  const renderSuggestion = (suggestion) => {
    let avatarUrl = suggestion.avatar ? suggestion.avatar : null;

    if (!suggestion.isAuthor && suggestion.mediaChain) {
      let media = suggestion.mediaChain.filter(
        (item) => item.language === language && item?.type === "AVATAR"
      );
      if (media && media.length > 0) {
        avatarUrl = media[0].avatarUrl;
      }
    }
    return (
      <div
        className={styles.coauthorSuggestion}
        onClick={() => handleSelectAuthor(suggestion)}
      >
        {avatarUrl ? (
          <div
            className={styles.imgWrap}
            style={{
              backgroundImage: `url(${addLandaSize(avatarUrl, 40)})`,
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

        <div className={styles.content}>
          <h4>
            {suggestion.isAuthor
              ? suggestion.firstName + " " + suggestion.lastName
              : suggestion[nameAttr]}
          </h4>
        </div>
      </div>
    );
  };

  return (
    <div
      className={styles.container}
      style={{
        position: "absolute",
        top: suggestionsPosition.top,
        left: suggestionsPosition.left + 10,
        zIndex: 999,
      }}
    >
      <span className={styles.closeCoauthor} onClick={closeMention}>
        <IconClose />
      </span>
      {loadingAuthorSuggestions ? (
        <div className={styles.loader_container}>
          <p>{_("article.loading_suggestions")}</p>
          <Loader width={44} height={44} />
        </div>
      ) : (
        <div>
          {avatarAndUsersList.authors.length > 0 && (
            <div>
              <div className={styles.cont}>
                <label>{_("article.authors")}</label>
              </div>
              <ul>
                {avatarAndUsersList.authors.map((author) =>
                  renderSuggestion(author)
                )}
              </ul>
            </div>
          )}

          {avatarAndUsersList.chains.length > 0 && (
            <div>
              <label>{_("article.chains")}</label>
              <ul>
                {avatarAndUsersList.chains.map((chain) =>
                  renderSuggestion(chain)
                )}
              </ul>
            </div>
          )}
          {avatarAndUsersList.authors.length === 0 &&
            avatarAndUsersList.chains.length === 0 && (
              <div className={styles.loader_container}>
                <p>{_("article.No_suggestions_available")}</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
