import React from "react";

import styles from "./Switch.module.scss";

const DisabledSwitch = (props) => {
  return (
    <div className="switch-container">
      <label>
        <input
          name={props.name}
          checked={props.isChecked}
          className={`${styles["ttp-switch"]} ${styles.disabled}`}
          type="checkbox"
        />
        <div>
          <span>
            <g className="icon icon-toolbar grid-view" />
          </span>
          <span>
            <g className="icon icon-toolbar ticket-view" />
          </span>
          <div />
        </div>
      </label>
    </div>
  );
};

export default DisabledSwitch;
