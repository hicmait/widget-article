import React, { PureComponent } from "react";
import { connect } from "react-redux";

import { getUserNameForAvatar, addLandaSize } from "Utils";
import { setArticle } from "Actions";

import _ from "i18n";
import { IconClose, IconEye } from "Common/Icons";
import styles from "./Author.module.scss";

class Author extends PureComponent {
  constructor(props) {
    super(props);

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeHead = this.handleChangeHead.bind(this);
    this.toggleEnableAvatar = this.toggleEnableAvatar.bind(this);
    this.handleDeleteAuthor = this.handleDeleteAuthor.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      const { author, language, onChange } = this.props;
      if (author && author.signature) {
        const { title, head } = author.signature;
        const newHead = this.getAuthorHeadline(author, language, head);

        onChange({ ...author, signature: { head: newHead, title } });
      }
    }
  }

  handleChangeTitle(e) {
    const { author } = this.props;
    const { head } = author.signature;

    this.props.onChange({
      ...author,
      signature: { title: e.target.value, head },
    });
  }

  handleChangeHead(e) {
    const { author } = this.props;
    const { title } = author.signature;
    this.props.onChange({
      ...author,
      signature: { head: e.target.value, title },
    });
  }

  toggleEnableAvatar(event) {
    event.stopPropagation();
    const { author, authorsCount, onChange, setArticle } = this.props;
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
        setArticle({
          index: "category",
          value: null,
        });
        setArticle({
          index: "type",
          value: null,
        });
        setArticle({
          index: "theme",
          value: null,
        });
        setArticle({
          index: "pages",
          value: [],
        });
      }
    } else {
      onChange({ ...author, enableAvatar: !enableAvatar });
    }
  }

  handleDeleteAuthor(e) {
    e.stopPropagation();
    const { author, onDelete } = this.props;
    onDelete(author);
  }

  renderAvatar() {
    const { author } = this.props;

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
                onClick={this.toggleEnableAvatar}
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
            onClick={this.toggleEnableAvatar}
            title={enableAvatar ? "Disable" : "Enable"}
          >
            <IconEye size="16" />
          </span>
        )}
      </div>
    );
  }

  getAuthorHeadline(author, language, currentHead) {
    const { headlines } = author;

    if (headlines && headlines[language]) {
      return headlines[language];
    } else {
      return currentHead;
    }
  }

  render() {
    const { removable, author, language } = this.props;
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
          <div
            className={styles.authorRemove}
            onClick={this.handleDeleteAuthor}
          >
            <IconClose size={16} />
          </div>
        )}
        {this.renderAvatar()}

        <div className={`${styles.sidebarUsername} ${styles.editableInput}`}>
          <input
            type="text"
            style={!enableAvatar ? { opacity: 0.6 } : {}}
            readOnly={true}
            value={title}
            onChange={this.handleChangeTitle}
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
              onChange={this.handleChangeHead}
              placeholder={_("article.author_headline")}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    lng: store.params.lng,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setArticle: (article) => dispatch(setArticle(article)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Author);
