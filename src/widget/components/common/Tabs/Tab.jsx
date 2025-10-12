import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import styles from "./Tabs.module.scss";

class Tab extends PureComponent {
  static propTypes = {
    activeTab: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onClickTabItem = this.onClickTabItem.bind(this);
  }

  onClickTabItem() {
    const { onClick, indexTab } = this.props;
    onClick(indexTab);
  }

  render() {
    const { activeTab, indexTab, label, icon } = this.props;

    return (
      <li
        className={classnames(
          styles["tab-list-item"],
          activeTab === indexTab ? styles["tab-list-active"] : ""
        )}
        onClick={this.onClickTabItem}
      >
        <div>
          {icon ? <img src={icon} alt={label} /> : null}
          <span className={styles["tab-btn"]}>{label}</span>
        </div>
      </li>
    );
  }
}

export default Tab;
