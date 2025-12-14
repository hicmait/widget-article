import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IMaskInput } from "react-imask";

import MultiSwitch from "../../common/Switch/MultiSwitch";
import DisabledSwitch from "../../common/Switch/Switch/DisabledSwitch";
import { setArticle } from "../../../redux/actions";
import styles from "./ArticleStatus.module.scss";

import _ from "../../../i18n";

export default function ArticleStatus(props) {
  let { community } = props;
  const status = useSelector((state) => state.articles.article.status);
  const publishedAt = useSelector(
    (state) => state.articles.article.publishedAt
  );
  const scheduledRef = useRef(null);
  const publishedRef = useRef(null);

  const dispatch = useDispatch();

  const handleStatusChange = (newStatus) => {
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
          <div className={styles.publishRow}>
            <span className={styles.publishLabel}>
              {_("article.published_on")} :
            </span>
            <IMaskInput
              mask="0`0`-0`0`-0`0`0`0` 0`0`:0`0`"
              lazy={false}
              placeholderChar="_"
              value={publishedAt}
              unmask={false}
              inputRef={publishedRef}
              onAccept={(value, mask) =>
                dispatch(setArticle({ index: "publishedAt", value: value }))
              }
              // placeholder="24-07-2017 12:00"
            />
          </div>

          <div className={styles.publishRow}>
            <span className={styles.publishLabel}>
              {_("Publier aussi sur Workflow")} :
            </span>
            <DisabledSwitch isChecked={true} />
          </div>
        </>
      )}
      {status === "SCHEDULED" && (
        <div className={styles.publishRow}>
          <span className={styles.publishLabel}>
            {_("article.scheduled_for")} :
          </span>
          <IMaskInput
            mask="0`0`-0`0`-0`0`0`0` 0`0`:0`0`"
            lazy={false}
            placeholderChar="_"
            value={publishedAt}
            unmask={false}
            inputRef={scheduledRef}
            onAccept={(value, mask) =>
              dispatch(setArticle({ index: "publishedAt", value: value }))
            }
            // placeholder="24-07-2017 12:00"
          />
        </div>
      )}
    </div>
  );
}
