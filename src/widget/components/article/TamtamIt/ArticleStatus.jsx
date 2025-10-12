import React from "react";
import { useSelector } from "react-redux";
import InputMask from "react-input-mask";

import MultiSwitch from "Common/Switch/MultiSwitch";
import Switch from "Common/Switch/Switch";
import DisabledSwitch from "Common/Switch/Switch/DisabledSwitch";
import _ from "i18n";

import styles from "./ArticleStatus.module.scss";

function RenderPublishedAt(props) {
  const { selectedStatus, publishedAt } = props;

  let label =
    selectedStatus === "PUBLISHED" ? _("published_on") : _("scheduled_for");

  let inputMaskProps = {
    mask: "99-99-9999 99:99",
    onChange: (e) => props.onChange(e.target.value),
    className: "published-at-input",
    autoComplete: "off",
    placeholder: `${_("publication_date")} (eg. 24-07-2017 12:00)`,
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
  let { community, status } = props;
  const auth = useSelector((state) => state.auth);

  const handleStatusChange = (newStatus) => {
    const { setPublishOnWorkflow, setStatus } = props;

    if (newStatus === "SCHEDULED") {
      setPublishOnWorkflow(true);
    } else if (newStatus !== "PUBLISHED") {
      setPublishOnWorkflow(true);
    }
    setStatus(newStatus);
  };

  let labels = [_("draft"), _("ready")];
  let vals = ["DRAFT", "READY"];

  if (
    auth.user &&
    community &&
    auth.user.communities &&
    auth.user.communities.length > 0
  ) {
    const currentCommunity = auth.user.communities.filter(
      (com) => com.id === community.value
    )[0];
    if (currentCommunity) {
      if (
        currentCommunity.blogs &&
        currentCommunity.blogs.length > 0 &&
        (currentCommunity.blogs[0].role === "CHIEF_EDITOR" ||
          currentCommunity.blogs[0].mandated == 1)
      ) {
        labels.push(_("scheduled"), _("published"));
        vals.push("SCHEDULED", "PUBLISHED");
      }
    }
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
            onChange={props.setPublishedAt}
          />
          <div className={styles.publishRow}>
            <span className={styles.publishLabel}>
              {_("publish_on_workflow")} :
            </span>
            <DisabledSwitch isChecked={true} />
          </div>
        </>
      )}
      {status === "SCHEDULED" && (
        <RenderPublishedAt
          selectedStatus={status}
          publishedAt={props.publishedAt}
          onChange={props.setPublishedAt}
        />
      )}
    </div>
  );
}
