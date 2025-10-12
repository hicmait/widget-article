import React, { Component } from "react";

import styles from "./Switch.module.scss";

export default class DisabledSwitch extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { name } = this.props;

    return (
      <div className="switch-container">
        <label>
          <input
            ref="switch"
            name={name}
            checked={this.props.isChecked}
            onChange={this._handleChange.bind(this)}
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
  }

  _handleChange() {}
}
