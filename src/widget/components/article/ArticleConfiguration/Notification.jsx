import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import InputMask from "react-input-mask";

import NotificationSwitch from "./NotificationSwitch";
import { setArticle } from "../../../redux/actions";
import { getAutoNotifications } from "../../../api";
import {
  convertDateToUTC,
  convertDateFromUTC,
  getArticleFullUrl,
} from "../../../services/utils";
import Loader from "../../common/Loader";
import styles from "./ArticleStatus.module.scss";

import _ from "../../../i18n";

const DATE_FORMAT = "DD-MM-YYYY HH:mm";
const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

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
  const auth = useSelector((state) => state.auth);
  const ttpApiUrl = useSelector((state) => state.params.ttpApiUrl);
  const selectedLanguage = useSelector(
    (state) => state.articles.article.selectedLanguage
  );
  const notification = useSelector(
    (state) => state.articles.article.notification
  );
  const notificationStored = useSelector(
    (state) => state.articles.article.notificationStored
  );
  const publishedAt = useSelector(
    (state) => state.articles.article.publishedAt
  );
  const community = useSelector((state) => state.articles.article.community);
  const [hour, setHour] = useState(hoursOptions[0]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false);
  const [notifsArticles, setNotifsArticles] = useState([]);
  const editArticleId = useSelector((state) => state.articles.article.id);

  const dispatch = useDispatch();

  const handleNotificationChange = (newNotification) => {
    dispatch(setArticle({ index: "notification", value: newNotification }));
  };

  useEffect(() => {
    if (notification === "AUTO" && props.activeTab === "CONFIGURATION") {
      if (publishedAt && community) {
        setIsLoadingNotifs(true);
        getAutoNotifications(
          ttpApiUrl,
          auth.token,
          selectedLanguage,
          community.value,
          convertDateToUTC(publishedAt, DATE_FORMAT, API_DATE_FORMAT),
          editArticleId
        )
          .then((response) => {
            setIsLoadingNotifs(false);
            if (response.data.data) {
              setNotifsArticles(response.data.data);
            }
          })
          .catch(() => {
            setIsLoadingNotifs(false);
          });
      }
    }
  }, [notification]);

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
      {notification === "AUTO" && (
        <div>
          <div className={styles.notif_txt_mar}>
            Liste des notifications automatiques à envoyer:
          </div>
          {isLoadingNotifs && (
            <div className={styles.loader}>
              <Loader
                style={{
                  height: "10px",
                }}
                color={"#6d7f92"}
              />
            </div>
          )}
          {notifsArticles.length > 0 && (
            <ul>
              {notifsArticles.map((i) => {
                const currentArticleUrl = i.article
                  ? getArticleFullUrl(i.article)
                  : "";
                return (
                  <li className={styles.notifs_list_item}>
                    <span>
                      {currentArticleUrl ? (
                        <a href={currentArticleUrl} target="_blank">
                          {i.article.title}
                        </a>
                      ) : (
                        "Cet article"
                      )}
                    </span>
                    <span>
                      {i.toSentAt
                        ? convertDateFromUTC(
                            i.toSentAt,
                            API_DATE_FORMAT,
                            DATE_FORMAT
                          )
                        : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
