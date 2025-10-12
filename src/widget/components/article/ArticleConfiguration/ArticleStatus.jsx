import React from "react";
import { useSelector, useDispatch } from "react-redux";
import InputMask from "react-input-mask";

import MultiSwitch from "../../common/Switch/MultiSwitch";
import DisabledSwitch from "../../common/Switch/Switch/DisabledSwitch";
import { setArticle } from "../../../redux/actions";
import styles from "./ArticleStatus.module.scss";

import _ from "../../../i18n";

export function RenderPublishedAt(props) {
  const { selectedStatus, dispatch } = props;
  const publishedAt = useSelector(
    (state) => state.articles.article.publishedAt
  );

  let label =
    selectedStatus === "PUBLISHED"
      ? _("article.published_on")
      : _("article.scheduled_for");

  let inputMaskProps = {
    mask: "99-99-9999 99:99",
    onChange: (e) =>
      dispatch(setArticle({ index: "publishedAt", value: e.target.value })),
    className: "published-at-input",
    autoComplete: "off",
    placeholder: _("Publication date (eg. 24-07-2017 12:00)"),
  };

  if (publishedAt) {
    inputMaskProps.defaultValue = publishedAt;
  }

  return (
    <div className={styles.publishRow}>
      <span className={styles.publishLabel}>{label} :</span>
      <InputMask {...inputMaskProps} />
    </div>
  );
}

export default function ArticleStatus(props) {
  let { community } = props;
  const status = useSelector((state) => state.articles.article.status);

  const dispatch = useDispatch();

  const handleStatusChange = (newStatus) => {
    const { setPublishOnWorkflow, setPublishOnTalk } = props;

    if (newStatus === "SCHEDULED") {
      dispatch(setArticle({ index: "publishOnWorkflow", value: true }));
    } else if (newStatus !== "PUBLISHED") {
      dispatch(setArticle({ index: "publishOnWorkflow", value: true }));
    }

    dispatch(setArticle({ index: "status", value: newStatus }));
  };

  let labels = [_("article.draft"), _("article.ready")];
  let vals = ["DRAFT", "READY"];

  if (
    community &&
    community.blogs &&
    community.blogs.length > 0 &&
    (community.blogs[0].role === "CHIEF_EDITOR" ||
      community.blogs[0].mandated == 1)
  ) {
    labels.push(_("article.scheduled"), _("article.published"));

    vals.push("SCHEDULED", "PUBLISHED");
  }

  return (
    <div>
      <MultiSwitch
        labels={labels}
        vals={vals}
        name="status"
        selectedValue={status}
        afterChange={handleStatusChange}
      />
      {status === "PUBLISHED" && (
        <>
          <RenderPublishedAt
            selectedStatus={status}
            publishedAt={props.publishedAt}
            setPublishedAt={props.setPublishedAt}
            dispatch={dispatch}
          />
          <div className={styles.publishRow}>
            <span className={styles.publishLabel}>
              {_("Publier aussi sur Workflow")} :
            </span>
            <DisabledSwitch isChecked={true} />
          </div>
        </>
      )}
      {status === "SCHEDULED" && (
        <RenderPublishedAt
          selectedStatus={status}
          publishedAt={props.publishedAt}
          setPublishedAt={props.setPublishedAt}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}
