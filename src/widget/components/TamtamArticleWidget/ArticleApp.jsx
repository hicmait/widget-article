import { useEffect } from "react";
import { useDispatch } from "react-redux";

import _ from "../../i18n";

import { setAuth, setTtpApiUrl, setTtpAiUrl } from "../../redux/actions";
import { BUBBLE_EVENTS } from "../../services/config";
import { BubblesList } from "../BubblesList";
import { AddArticle } from "../article/AddArticle";
// import "../../styles/index.css";
import styles from "./TamtamArticleWidget.module.scss";

export const ArticleApp = (props) => {
  const dispatch = useDispatch();
  const language = props.lng ? props.lng : "fr";

  useEffect(() => {
    dispatch(setAuth(props.auth));
  }, [dispatch, props.auth]);
  dispatch(setAuth(props.auth));

  dispatch(setTtpApiUrl(props.ttpApiUrl));
  dispatch(setTtpAiUrl(props.ttpAiUrl));

  const renderFloatLayout = (bubbles) => {
    return (
      <div className={styles.floatWidget}>
        <BubblesList bubbles={bubbles} />
      </div>
    );
  };

  const renderStaticLayout = (bubbles) => {
    return bubbles.map((bubble, index) => {
      return (
        <div
          key={`bubble-${index}`}
          onClick={() => {
            handleClickBubble(dispatch, bubble);
          }}
          className={`ttp-widget-btn ttp-widget-${bubble.icon}`}
        >
          {bubble.label}
        </div>
      );
    });
  };

  const bubbles = [];
  if (props.media) {
    bubbles.push({
      icon: "media",
      label: _("media.medias"),
      event: BUBBLE_EVENTS.ADD_NEW_MEDIA,
    });
  }
  if (props.article) {
    bubbles.push({
      icon: "article",
      label: _("article.add_new_article"),
      event: BUBBLE_EVENTS.ADD_NEW_ARTICLE,
    });
  }
  if (props.tamtamit) {
    bubbles.push({
      icon: "tamtamit",
      label: _("article.import"),
      event: BUBBLE_EVENTS.IMPORT_ARTICLE,
    });
  }
  const layout = props.layout ? props.layout : "float"; // float | static

  return (
    <div id="ttp-widget">
      {layout === "float" ? renderFloatLayout(bubbles) : renderStaticLayout()}
      {props.article && (
        <AddArticle
          language={language}
          selectArticles={props.selectArticles}
          articleId={props.articleId || null}
          articleSharingOptions={props.articleSharingOptions || []}
          onExpiredToken={props.onExpiredToken || null}
        />
      )}
      {/* {props.tamtamit && <TamtamIt language={language} />} */}
    </div>
  );
};
