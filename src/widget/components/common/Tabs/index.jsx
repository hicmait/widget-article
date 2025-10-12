import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Tab from "./Tab";
import classnames from "classnames";

import styles from "./Tabs.module.scss";

class TabsComponent extends PureComponent {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };
  }

  onClickTabItem = (tab) => {
    this.setState({ activeTab: tab });
  };
  render() {
    const {
      onClickTabItem,
      props: { children, theme },
      state: { activeTab },
    } = this;
    if (children.length > 0) {
      return (
        <div className={classnames(styles.tabs, theme ? styles[theme] : "")}>
          <ol className={styles["tab-list"]}>
            {children.map((child, i) => {
              const { label, icon } = child.props;
              return (
                <Tab
                  indexTab={i}
                  activeTab={activeTab}
                  icon={icon}
                  key={label}
                  label={label}
                  onClick={onClickTabItem}
                />
              );
            })}
          </ol>
          <div className={styles["tab-content"]}>
            {children.map((child, index) => {
              const { label } = child.props;
              //if (child.props.label !== activeTab) return undefined;
              return (
                <div
                  className={index !== activeTab ? styles["tab-hidden"] : ""}
                  key={`content-${label}`}
                >
                  {child.props.children}
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default TabsComponent;
