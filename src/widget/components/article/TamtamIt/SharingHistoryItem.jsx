import React, { Component } from "react";
import classnames from "classnames";

import { getDateLabel, convertDateTimeZone } from "Utils";
//import _ from "i18n";

import styles from "./SharingHistory.module.scss";

export default class SharingHistoryItem extends Component {
  renderContent() {
    const { title, text, network, networkAccount } = this.props;

    return (
      <div>
        <div className={styles.history_title}>{title}</div>
        <div>{text}</div>
        <div className={styles[network.toLowerCase()]}>
          <span>
            <i class={`icon-ttp-${network.toLowerCase()}`}></i>
          </span>
          <div>{networkAccount}</div>
        </div>
      </div>
    );
  }

  render() {
    const { date, status } = this.props;
    const dateLabel = getDateLabel(convertDateTimeZone(date)).split(",");
    return (
      <div className={`${styles.history_item} grid-x`}>
        <div className="small-6">
          <div
            className={classnames(
              styles.history_box,
              styles[`status_${status.toLowerCase()}`]
            )}
          >
            <div className={classnames(styles.history_box_content)}>
              {this.renderContent()}
            </div>
            <div className={classnames(styles.history_box_circle)}></div>
            <div className={styles.history_box_date}>
              <span>{dateLabel[0]}</span>
              <span>{dateLabel[1]}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
