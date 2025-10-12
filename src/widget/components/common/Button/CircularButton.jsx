import React, { PureComponent } from "react";

import Button from "Common/Button/Button";

export default class CircularButton extends PureComponent {
  render() {
    const { children, style, ...props } = this.props;

    return <Button {...props} style={{ ...style, borderRadius: "50%" }} />;
  }
}
