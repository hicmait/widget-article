import React, { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { setArticle } from "../../../redux/actions";

import { getUserNameForAvatar, addLandaSize } from "../../../services/utils";

import _ from "../../../i18n";
import { IconClose, IconEye } from "../../common/Icons";
import styles from "./Author.module.scss";

// const Author = (props) => {
const Author = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const { author, language, onChange } = props;
  //   if (author && author.signature) {
  //     const { title, head } = author.signature;
  //     const newHead = getAuthorHeadline(author, language, head);

  //     onChange({ ...author, signature: { head: newHead, title } });
  //   }
  // }, [props.author, props.language]);

  const handleChangeTitle = (e) => {
    const { author } = props;
    const { head } = author.signature;

    props.onChange({
      ...author,
      signature: { title: e.target.value, head },
    });
  };

  const handleChangeHead = (e) => {
    const { author } = props;
    const { title } = author.signature;
    props.onChange({
      ...author,
      signature: { head: e.target.value, title },
    });
  };

  const toggleEnableAvatar = (event) => {
    event.stopPropagation();
    const { author, authorsCount, onChange } = props;
    const { enableAvatar } = author;
    if (author.id === 8650) {
      let next = true;
      if (enableAvatar === true) {
        next = false;
      } else if (enableAvatar === false) {
        if (authorsCount > 1) {
          next = "D";
        } else {
          next = true;
        }
      } else if (enableAvatar === "D") {
        next = true;
      }
      onChange({ ...author, enableAvatar: next });

      if (!next) {
        dispatch(
          setArticle({
            index: "category",
            value: null,
          })
        );
        dispatch(
          setArticle({
            index: "type",
            value: null,
          })
        );
        dispatch(
          setArticle({
            index: "theme",
            value: null,
          })
        );
        dispatch(
          setArticle({
            index: "pages",
            value: [],
          })
        );
      }
    } else {
      onChange({ ...author, enableAvatar: !enableAvatar });
    }
  };

  const handleDeleteAuthor = (e) => {
    e.stopPropagation();
    const { author, onDelete } = props;
    onDelete(author);
  };

  const renderAvatar = () => {
    const { author } = props;

    const selectedLanguage = "fr";

    let { enableAvatar, firstName, lastName, isAuthor, avatarUrl } = author;
    const nameAttr = `name${
      selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
    }`;

    if (!isAuthor && author.mediaChain) {
      let media = author.mediaChain.filter(
        (item) => item.language === selectedLanguage && item?.type === "AVATAR"
      );
      if (media && media.length === 1) {
        avatarUrl = media[0].avatarUrl;
      }
    }

    if (!avatarUrl) {
      const iconEyeClass =
        enableAvatar === "D"
          ? styles.iconEye +
            " " +
            styles.iconEyeDeleted +
            " " +
            styles.disabledAvatar
          : enableAvatar === false
          ? styles.iconEye + " " + styles.disabledAvatar
          : styles.iconEye;
      return (
        <div
          className={`${styles.sidebarAvatar} ${styles.emptyAvatar}`}
          style={{ backgroundImage: `url("/img/user-avatar.svg")` }}
        >
          <div
            className={styles.avatarOverlay}
            style={
              enableAvatar === true && enableAvatar !== "D"
                ? { display: "none" }
                : { display: "block" }
            }
          ></div>

          {isAuthor && (
            <>
              <span>{getUserNameForAvatar(firstName, lastName)}</span>
              <span
                className={iconEyeClass}
                onClick={toggleEnableAvatar}
                title={enableAvatar ? "Disable" : "Enable"}
              >
                <IconEye size="16" />
              </span>
            </>
          )}
        </div>
      );
    }

    const iconEyeClass =
      enableAvatar === "D"
        ? styles.iconEye + " " + styles.disabledAvatarDeleted
        : enableAvatar === false
        ? styles.iconEye + " " + styles.disabledAvatar
        : styles.iconEye;
    return (
      <div
        className={styles.sidebarAvatar}
        style={{ backgroundImage: `url(${addLandaSize(avatarUrl, 240)})` }}
      >
        <div
          className={styles.avatarOverlay}
          style={
            enableAvatar === true && enableAvatar !== "D"
              ? { display: "none" }
              : { display: "block" }
          }
        ></div>
        {isAuthor && (
          <span
            className={iconEyeClass}
            onClick={toggleEnableAvatar}
            title={enableAvatar ? "Disable" : "Enable"}
          >
            <IconEye size="16" />
          </span>
        )}
      </div>
    );
  };

  const getAuthorHeadline = (author, language, currentHead) => {
    const { headlines } = author;

    if (headlines && headlines[language]) {
      return headlines[language];
    } else {
      return currentHead;
    }
  };

  const { removable, author, language } = props;
  const { enableAvatar, isAuthor, isAvatar, signature } = author;

  let title = "";
  let head = "";

  if (isAuthor) {
    if (signature) {
      title = signature.title;
      head = signature.head;
    }
  } else {
    const nameAttr = `name${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;

    title = author[nameAttr];
    head = author.headline;
  }

  return (
    <div className={styles.sidebarAuthor}>
      {removable && (
        <div className={styles.authorRemove} onClick={handleDeleteAuthor}>
          <IconClose size={16} />
        </div>
      )}
      {renderAvatar()}

      <div className={`${styles.sidebarUsername} ${styles.editableInput}`}>
        <input
          type="text"
          style={!enableAvatar ? { opacity: 0.6 } : {}}
          readOnly={true}
          value={title}
          onChange={handleChangeTitle}
          placeholder={_("article.author_title")}
        />
      </div>

      {(isAuthor || (isAvatar && head)) && (
        <div className={`${styles.sidebarPost} ${styles.editableInput}`}>
          <input
            type="text"
            style={!enableAvatar ? { opacity: 0.6 } : {}}
            readOnly={!enableAvatar || !isAuthor}
            value={head}
            onChange={handleChangeHead}
            placeholder={_("article.author_headline")}
          />
        </div>
      )}
    </div>
  );
});

export default Author;
