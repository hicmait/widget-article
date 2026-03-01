import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-date-picker";
import moment from "moment";
import Select from "react-select";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import { setArticle } from "../../../redux/actions";
import styles from "./ArticleConfiguration.module.scss";

import _ from "../../../i18n";

const API_DATE_FORMAT = "YYYY-MM-DD";

const recurrentOptions = [
  { value: null, label: _("article.never") },
  { value: "MONTH", label: _("article.every_month") },
  { value: "3_MONTH", label: _("article.every_3_month") },
  { value: "6_MONTH", label: _("article.every_6_month") },
  { value: "YEAR", label: _("article.every_year") },
];

export default function RecurrentDate(props) {
  const articleRecurrence = useSelector(
    (state) => state.articles.article.recurrence,
  );
  const [endDate, setEndDate] = useState(null);
  const [recurrence, setRecurrence] = useState(recurrentOptions[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (articleRecurrence?.type) {
      const t = recurrentOptions.filter(
        (i) => i.value == articleRecurrence.type,
      );
      if (t?.length > 0) {
        setRecurrence(t[0]);
        setShowDatePicker(true);
        if (articleRecurrence?.endDate) {
          setEndDate(new Date(articleRecurrence.endDate));
        }
      }
    }
  }, []);

  const handleSelect = (e) => {
    setRecurrence(e);
    const value = e.value ? { type: e.value } : null;
    setShowDatePicker(e.value ? true : false);
    if (articleRecurrence?.endDate) {
      value.endDate = articleRecurrence.endDate;
    }

    dispatch(
      setArticle({
        index: "recurrence",
        value: value,
      }),
    );
    return null;
  };

  const handleSelectEndDate = (dateValue) => {
    setEndDate(dateValue);
    let data = {
      type: articleRecurrence.type,
    };
    if (dateValue) {
      data.endDate = moment(dateValue).format(API_DATE_FORMAT);
    }
    dispatch(
      setArticle({
        index: "recurrence",
        value: data,
      }),
    );
  };

  return (
    <div className={styles.recurrent}>
      <Select
        styles={props.selectStyles}
        options={recurrentOptions}
        isSearchable={false}
        value={recurrence}
        onChange={handleSelect}
      />

      {showDatePicker && (
        <div className={styles.recurrentBar}>
          <label className={styles.configLabel}>
            {_("article.end_recurrence")}
          </label>
          <DatePicker
            format="d/M/y"
            value={endDate}
            onChange={handleSelectEndDate}
            className={styles.dateInput}
            minDate={new Date()}
            placeholder={_("article.never")}
          />
        </div>
      )}
    </div>
  );
}
