import React from "react";

import { convertDateTimeZone } from "Utils";
import Switch from "Common/Switch/Switch";
import { IconTime } from "Common/Icons";

import styles from "./Sidebar.module.scss";
// import { SocialNetworkLabel } from './SocialNetworkLabel';

export class SocialNetworkForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);

    let fbPagesKey = "";
    let fbPages = [];
    if (props.socialNetwork === "facebook") {
      props.treeData.map((item) => {
        if (item.key.startsWith("$$")) {
          if (item.children) {
            const node = item.children.filter((it) =>
              it.key.startsWith("$$pages")
            );
            if (node && node.length > 0) {
              fbPagesKey = node[0].key;
              if (node[0].children) {
                node[0].children.map((child) => {
                  fbPages.push(child.key);
                });
              }
            }
          } else if (item.key.startsWith("$$pages")) {
            fbPagesKey = item.key;
            if (item.children) {
              item.children.map((child) => {
                fbPages.push(child.key);
              });
            }
          }
        }
      });
    }

    this.state = {
      checkedKeys: props.checkedKeys,
      fbAllPagesChecked: false,
      fbPagesKey,
      fbPages,
      content: props.text,
      showDetails: {
        facebook: false,
        twitter: false,
        linkedin: false,
      },
      count: {
        facebook: 0,
        twitter: 0,
        linkedin: 0,
      },
    };
  }

  extractDataFromCheckedNodes(checkedNodes) {
    return checkedNodes
      .filter((item) => !item.key.startsWith("$$"))
      .map((item) => {
        return { key: item.key, title: item.props.dataRef.title };
      });
  }

  onCheck(checkedKeys, e) {
    const { type, socialNetwork } = this.props;
    this.setState({ checkedKeys });

    const data = this.extractDataFromCheckedNodes(e.checkedNodes);

    this.props.onValuesChange(checkedKeys, data, type, socialNetwork);
  }

  handleTextChange({ target }) {
    const { type, socialNetwork } = this.props;
    this.setState({
      content: target.value,
    });
    this.props.onTextChange(target.value, type, socialNetwork);
  }

  handleFBChange(checked, item) {
    const { type, socialNetwork } = this.props;
    const { checkedKeys, count, fbPagesKey, fbPages } = this.state;
    let currentCount = count[socialNetwork];
    let selected = checkedKeys;
    let items = {};

    // if (item.key.startsWith("$$")) {
    if (item.key.startsWith("$$pages")) {
      this.setState({
        showDetails: {
          ...this.state.showDetails,
          facebook: checked,
        },
      });
      if (!checked) {
        currentCount = 0;
        selected = [];
      } else if (item.children) {
        item.children.map((pageItem) => {
          selected.push(pageItem.key);
          items[pageItem.key] = pageItem.title;
          currentCount++;
        });
        selected.push(item.key);
        items[item.key] = item.title;
      }
      // }
      // else {
      //     item.children.map((childItem) => {
      //         if (childItem.children) {
      //             childItem.children.map((pageItem) => {
      //                 if (!checked) {
      //                     selected = selected.filter(
      //                         (it) => it !== pageItem.key
      //                     );
      //                 } else {
      //                     selected.push(pageItem.key);
      //                 }
      //                 items[pageItem.key] = pageItem.title;
      //             });
      //         }
      //         if (!checked && checkedKeys.includes(childItem.key)) {
      //             selected = selected.filter((it) => it !== childItem.key);
      //             currentCount--;
      //         } else if (checked && !checkedKeys.includes(childItem.key)) {
      //             selected.push(childItem.key);
      //             currentCount++;
      //         }
      //         items[childItem.key] = childItem.title;
      //     });
      //     if (!checked) {
      //         selected = selected.filter((it) => it !== item.key);
      //     } else {
      //         selected.push(item.key);
      //     }
      //     this.setState({ fbAllPagesChecked: checked });
      //     items[item.key] = item.title;
      // }
    } else {
      if (!checked) {
        selected = selected.filter((it) => it !== item.key);
        currentCount--;
        if (item.isPage) {
          selected = selected.filter((it) => it !== fbPagesKey);
        }
      } else {
        selected.push(item.key);
        currentCount++;
        // if (item.isPage) {
        //     const containsAll = fbPages.every((arr2Item) =>
        //         selected.includes(arr2Item)
        //     );
        //     if (containsAll) {
        //         selected.push(fbPagesKey);
        //     }
        // }
      }
      items[item.key] = item.title;
    }
    if (currentCount === 0) {
      selected = [];
    }
    this.setState({
      checkedKeys: selected,
      count: {
        ...this.state.count,
        facebook: currentCount,
      },
    });
    if (currentCount === 0) {
      this.setState({
        showDetails: {
          ...this.state.showDetails,
          facebook: false,
        },
      });
    }
    const data = selected
      .filter((it) => !it.startsWith("$$"))
      .map((itemKey) => {
        return { key: itemKey, title: items[itemKey] };
      });

    this.props.onValuesChange(selected, data, type, socialNetwork);
  }

  handleChange(checked, item) {
    const { type, socialNetwork } = this.props;
    const { checkedKeys, count } = this.state;
    let currentCount = count[socialNetwork];
    let selected = checkedKeys;
    let items = {};

    if (!checked) {
      selected = selected.filter((it) => it !== item.key);
      currentCount--;
    } else {
      currentCount++;
      selected.push(item.key);
    }
    // selected.push(item.key);
    items[item.key] = item.title;
    this.setState({ checkedKeys: selected });
    const data = selected
      .filter((it) => !it.startsWith("$$"))
      .map((itemKey) => {
        return { key: itemKey, title: items[itemKey] };
      });
    if (checked) {
      this.setState({
        showDetails: {
          ...this.state.showDetails,
          [socialNetwork]: checked,
        },
        count: {
          ...this.state.count,
          [socialNetwork]: currentCount,
        },
      });
    } else {
      this.setState({
        count: {
          ...this.state.count,
          [socialNetwork]: currentCount,
        },
      });
      if (currentCount === 0) {
        this.setState({
          showDetails: {
            ...this.state.showDetails,
            [socialNetwork]: false,
          },
        });
      }
    }
    this.props.onValuesChange(selected, data, type, socialNetwork);
  }

  renderFBNodes(data) {
    const { checkedKeys } = this.state;
    const { dates, removeDate } = this.props;

    let tab = data.map((item) => {
      return (
        <div key={item.key}>
          <div className={styles.share_first_row_box}>
            {item.title}
            <Switch
              isChecked={checkedKeys.includes(item.key)}
              onChange={(value) => this.handleFBChange(value, item)}
            />
          </div>
          {checkedKeys.includes(item.key) && item.children && (
            <div className={styles.share_row_parent}>
              {item.children.map((childItem) => {
                return (
                  <>
                    <div className={styles.share_row_box}>
                      {childItem.title}
                      <div
                        style={{
                          display: "flex",
                          fontSize: "20px",
                          alignItems: "center",
                        }}
                      >
                        {checkedKeys.includes(childItem.key) && (
                          <>
                            <span
                              style={{
                                fontSize: "12px",
                                marginRight: "2px",
                              }}
                            >
                              {dates[childItem.key]
                                ? convertDateTimeZone(dates[childItem.key])
                                : "immediately"}
                            </span>
                            {dates[childItem.key] && (
                              <span
                                style={{
                                  fontSize: "16px",
                                  marginRight: "6px",
                                  cursor: "pointer",
                                }}
                                onClick={() => removeDate(childItem.key)}
                              >
                                x
                              </span>
                            )}
                            <span
                              style={{
                                margin: "0 6px",
                                fontSize: "1.125rem",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                this.props.openCalendarModal(
                                  this.props.socialNetwork,
                                  childItem.key
                                );
                              }}
                            >
                              <IconTime size="17" />
                            </span>
                          </>
                        )}
                        <Switch
                          isChecked={checkedKeys.includes(childItem.key)}
                          onChange={(value) =>
                            this.handleFBChange(value, childItem)
                          }
                        />
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      );
    });
    return tab;
  }

  renderTreeNodes(data) {
    const { checkedKeys } = this.state;
    const { dates, removeDate } = this.props;

    let tab = data.map((item) => {
      return (
        <div key={item.key}>
          <div className={styles.share_first_row_box}>
            {item.title}
            <div
              style={{
                display: "flex",
                fontSize: "20px",
                alignItems: "center",
              }}
            >
              {checkedKeys.includes(item.key) && (
                <>
                  <span
                    style={{
                      fontSize: "12px",
                      marginRight: "2px",
                    }}
                  >
                    {dates[item.key]
                      ? convertDateTimeZone(dates[item.key])
                      : "immediately"}
                  </span>
                  {dates[item.key] && (
                    <span
                      style={{
                        fontSize: "16px",
                        marginRight: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() => removeDate(item.key)}
                    >
                      x
                    </span>
                  )}
                  <span
                    style={{
                      margin: "0 6px",
                      fontSize: "1.125rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      this.props.openCalendarModal(
                        this.props.socialNetwork,
                        item.key
                      );
                    }}
                  >
                    <IconTime size="17" />
                  </span>
                </>
              )}
              <Switch
                isChecked={checkedKeys.includes(item.key)}
                onChange={(value) => this.handleChange(value, item)}
              />
            </div>
          </div>
        </div>
      );
    });
    return tab;
  }

  render() {
    const { text, hasText, treeData, socialNetwork } = this.props;
    const { showDetails } = this.state;

    return (
      <div className={styles.social_section}>
        {socialNetwork === "facebook"
          ? this.renderFBNodes(treeData)
          : this.renderTreeNodes(treeData)}
        {hasText && showDetails[socialNetwork] && (
          <div className={styles.social_intro_text}>
            <label className={styles.configLabel}>Votre texte</label>
            <textarea
              rows={6}
              value={text}
              onChange={this.handleTextChange}
              placeholder={"Saisissez votre texte ..."}
            ></textarea>
          </div>
        )}
      </div>
    );
  }
}
