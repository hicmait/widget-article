import React from "react";
import { useDispatch } from "react-redux";
import classnames from "classnames";

import {
  toggleMediaModal,
  toggleArticleModal,
  toggleTamtamitModal,
} from "../../../redux/actions";
import { BUBBLE_EVENTS } from "../../../services/config";

import styles from "./Bubble.module.scss";
import { IconPencil, IconFolder, IconTamtamit } from "../../common/Icons";

const handleClickBubble = (dispatch, bubble) => {
  if (bubble.disabled) return;

  switch (bubble.event) {
    case BUBBLE_EVENTS.ADD_NEW_MEDIA:
      dispatch(toggleMediaModal());
      break;
    case BUBBLE_EVENTS.ADD_NEW_ARTICLE:
      dispatch(toggleArticleModal());
      break;
    case BUBBLE_EVENTS.IMPORT_ARTICLE:
      dispatch(toggleTamtamitModal());
      break;
      return;
  }
};

export function Bubble({ bubble }) {
  const dispatch = useDispatch();
  const classes = classnames(
    styles.bubble,
    styles[bubble.icon],
    bubble.disabled ? styles["disabled"] : "",
    {
      "d-none": bubble.hidden,
    }
  );
  const renderIcon = (icon) => {
    switch (icon) {
      case "media":
        return <IconFolder size="24" />;
      case "article":
        return <IconPencil size="20" />;
      case "tamtamit":
        return <IconTamtamit size="20" />;
      default:
        return <span></span>;
    }
  };
  return (
    <div
      className={classes}
      onClick={() => {
        handleClickBubble(dispatch, bubble);
      }}
    >
      {renderIcon(bubble.icon)}
      <span className={styles.label}>{bubble.label}</span>
    </div>
  );
}
