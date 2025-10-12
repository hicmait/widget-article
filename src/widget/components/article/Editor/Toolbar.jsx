import React, { useState, useRef, useEffect } from "react";

import ImageOption from "./ImageOption";
import TablePlugin from "./TablePlugin";
import VideoAdd from "./VideoAdd";
import Button from "Common/Button";
import {
  IconHeader1,
  IconHeader2,
  IconHeader3,
  IconHeader4,
  IconQuote,
  IconBold,
  IconItalic,
  IconUnderline,
  IconStrike,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconAlignJustify,
  IconUnorderedList,
  IconOrderedList,
  IconIndent,
  IconOutdent,
  IconLink,
} from "Common/Icons/Editor";
import _ from "i18n";
import styles from "./Toolbar.module.scss";

export default function Toolbar(props) {
  const [linkPopupOpened, setLinkPopupOpened] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkError, setLinkError] = useState(false);
  useEffect(() => {
    document.addEventListener("click", () => {
      setLinkPopupOpened(false);
      setLinkUrl("");
      setLinkText("");
      setLinkError(false);
    });

    return () => {
      document.removeEventListener("click", () => {
        setLinkPopupOpened(false);
        setLinkUrl("");
        setLinkText("");
        setLinkError(false);
      });
    };
  });

  const refLinkUrl = useRef();

  const handleClickLink = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (!linkPopupOpened) {
      setLinkText(props.getDefaultLinkText());
    }
    setLinkPopupOpened(!linkPopupOpened);
    setTimeout(() => refLinkUrl.current.focus(), 0);
  };

  const closeLinkPopup = () => {
    setLinkPopupOpened(false);
    setLinkUrl("");
    setLinkText("");
    setLinkError(false);
  };

  const handleAddLink = () => {
    let { onAddLink } = props;

    if (linkUrl.trim().length === 0) {
      setLinkError(true);
      return;
    }

    onAddLink(linkUrl.trim(), linkText.trim());

    closeLinkPopup();
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbar__group}>
        <props.UndoButton className={styles.toolbar__button} />
        <props.RedoButton className={styles.toolbar__button} />
      </div>
      <div
        className={`${styles.toolbar__group} ${styles.toolbar__groupmargin}`}
      >
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleBlockType("header-one")}
        >
          <IconHeader1 />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleBlockType("header-two")}
        >
          <IconHeader2 />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleBlockType("header-three")}
        >
          <IconHeader3 />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleBlockType("header-four")}
        >
          <IconHeader4 />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleBlockType("blockquote")}
        >
          <IconQuote />
        </span>
      </div>

      <div className={styles.toolbar__group}>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleInlineStyle("BOLD")}
        >
          <IconBold />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleInlineStyle("ITALIC")}
        >
          <IconItalic />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleInlineStyle("UNDERLINE")}
        >
          <IconUnderline />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleInlineStyle("STRIKETHROUGH")}
        >
          <IconStrike />
        </span>
      </div>

      <div className={`${styles.toolbar__group}`}>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleInlineStyle("ALIGN_LEFT")}
        >
          <IconAlignLeft />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleInlineStyle("ALIGN_CENTER")}
        >
          <IconAlignCenter />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleInlineStyle("ALIGN_RIGHT")}
        >
          <IconAlignRight />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleInlineStyle("ALIGN_JUSTIFY")}
        >
          <IconAlignJustify />
        </span>
      </div>

      <div
        className={`${styles.toolbar__group} ${styles.toolbar__groupmargin}`}
      >
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleBlockType("unordered-list-item")}
        >
          <IconUnorderedList />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.onToggleBlockType("ordered-list-item")}
        >
          <IconOrderedList />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.adjustDepth(-1)}
        >
          <IconOutdent />
        </span>
        <span
          className={styles.toolbar__button}
          onClick={() => props.adjustDepth(1)}
        >
          <IconIndent />
        </span>
      </div>

      <TablePlugin insertTable={(size) => props.insertTable(size)} />

      <div className={`${styles.toolbar__group}`}>
        <span
          className={`${styles.toolbar__popup_container} ${styles.toolbar__button}`}
          title={_("Link")}
          onClick={handleClickLink}
        >
          <IconLink />
          <div
            className={
              linkPopupOpened
                ? `${styles.toolbar__popup} ${styles.toolbar__popup_link} ${styles.toolbar__popup_opened}`
                : `${styles.toolbar__popup} ${styles.toolbar__popup_link} ${styles.toolbar__popup_closed}`
            }
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            <span className={styles.toolbar__popup_triangle}></span>
            <input
              type="text"
              placeholder={_("article.link") + " *"}
              value={linkUrl}
              ref={refLinkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            {linkError ? (
              <p className={styles.toolbar__popup_helptext}>
                {_("article.validate_link")}
              </p>
            ) : null}
            <input
              type="text"
              placeholder={_("article.link_text")}
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
            <Button block onClick={handleAddLink}>
              {_("article.add_link")}
            </Button>
          </div>
        </span>
      </div>
      <ImageOption onUploadImage={props.handleAddImage} />
      <VideoAdd onAddVideo={props.handleAddVideo} />
    </div>
  );
}
