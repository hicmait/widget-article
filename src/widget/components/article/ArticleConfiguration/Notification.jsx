import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputMask from "react-input-mask";

import NotificationSwitch from "./NotificationSwitch";
import { setArticle } from "../../../redux/actions";
import styles from "./ArticleStatus.module.scss";

import _ from "../../../i18n";

const hoursOptions = [
  { value: 1, label: 1 + " " + _("article.hour") },
  { value: 2, label: 2 + " " + _("article.hours") },
  { value: 3, label: 3 + " " + _("article.hours") },
  { value: 4, label: 4 + " " + _("article.hours") },
  { value: 5, label: 5 + " " + _("article.hours") },
  { value: 6, label: 6 + " " + _("article.hours") },
];

export function RenderPublishedAt(props) {
  const { dispatch } = props;
  const notificationToSentAt = useSelector(
    (state) => state.articles.article.notificationToSentAt
  );

  let label = _("article.scheduled_for");

  let inputMaskProps = {
    mask: "99-99-9999 99:99",
    onChange: (e) =>
      dispatch(
        setArticle({ index: "notificationToSentAt", value: e.target.value })
      ),
    className: "published-at-input",
    autoComplete: "off",
    placeholder: _("Publication date (eg. 24-07-2017 12:00)"),
  };

  if (notificationToSentAt) {
    inputMaskProps.defaultValue = notificationToSentAt;
  }

  return (
    <div className={styles.publishRow}>
      <span className={styles.publishLabel}>{label} :</span>
      <InputMask {...inputMaskProps} />
    </div>
  );
}

export default function Notification(props) {
  const notification = useSelector(
    (state) => state.articles.article.notification
  );
  const notificationStored = useSelector(
    (state) => state.articles.article.notificationStored
  );
  const [hour, setHour] = useState(hoursOptions[0]);

  const dispatch = useDispatch();

  const handleNotificationChange = (newNotification) => {
    dispatch(setArticle({ index: "notification", value: newNotification }));
  };

  const handleSelect = (e) => {
    setHour(e);
    dispatch(
      setArticle({
        index: "notificationHour",
        value: e.value,
      })
    );
    return null;
  };

  let labels = [
    _("article.not_notify"),
    _("article.instant"),
    _("article.automatic"),
    _("article.scheduled"),
  ];
  let vals = ["NOT_NOTIFY", "INSTANT", "AUTO", "SCHEDULED"];

  return (
    <div>
      {notificationStored && (
        <label className={styles.notif_txt}>
          Programmé à être envoyé le : {notificationStored.toSentAt}
        </label>
      )}
      <NotificationSwitch
        labels={labels}
        vals={vals}
        selectedValue={notification}
        afterChange={handleNotificationChange}
        handleSelectHour={handleSelect}
        hoursOptions={hoursOptions}
        hour={hour}
      />

      {notification === "SCHEDULED" && (
        <RenderPublishedAt dispatch={dispatch} />
      )}
    </div>
  );
}
