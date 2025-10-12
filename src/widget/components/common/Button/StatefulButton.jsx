import React, { PureComponent, Fragment } from "react";

import Button from "Common/Button/Button";
import Loader from "Common/Loader/Loader";

import _ from "i18n";

//TODO FIXME styles, animation ...
class StatefulButton extends PureComponent {
  static defaultProps = {
    state: "default",
    defaultText: "Submit",
    loadingText: "Loading",
    successText: "Success",
    errorText: "Error",
  };

  // state = {
  //   state: "default"
  // };

  reset = () => {
    this.setState({ state: "default" });
  };

  handleClick = () => {
    const { state } = this.state;
    const { onClick } = this.props;

    if (state !== "default") {
      return;
    }

    this.setState({ state: "loading" });

    // TODO Validate that onClick is a Promise
    // onClick()
    //   .then(() => {
    //     this.setState({ state: "success" });
    //   })
    //   .catch(e => {
    //     this.setState({ state: "error" });
    //     setTimeout(this.reset, 3000);

    //     throw e;
    //   });

    // setTimeout(() => {
    //   this.setState({ state: "success" });
    //   setTimeout(this.reset, 3000);
    // }, 3000);
  };

  render() {
    // const { state } = this.state;
    const {
      state,
      defaultText,
      loadingText,
      successText,
      errorText,
      onClick,
    } = this.props;

    const variant =
      state === "error"
        ? "danger"
        : state === "success"
        ? "success"
        : "primary";

    return (
      <Button variant={variant} onClick={onClick}>
        {state === "default" && <span>{_(defaultText)}</span>}
        {state === "loading" && (
          <Fragment>
            <span>{_(loadingText)}</span>
            <Loader
              style={{
                width: "1.5rem",
                height: "1.5rem",
                marginLeft: loadingText ? "1.5rem" : "0rem",
              }}
            />
          </Fragment>
        )}
        {state === "success" && (
          <Fragment>
            <span>{_(successText)}</span>
            <span className="icon-check" style={{ marginLeft: "1.5rem" }} />
          </Fragment>
        )}
        {state === "error" && (
          <Fragment>
            <span>{_(errorText)}</span>
            {/* <span className="icon-close" style={{ marginLeft: "0.5rem" }} /> */}
          </Fragment>
        )}
      </Button>
    );
  }
}

export default StatefulButton;
