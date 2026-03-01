import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Modal } from "antd";
import moment from "moment";

import Loader from "Common/Loader";
import Button from "Common/Button";
import { IconTwitter, IconLinkedin, IconFacebook } from "Common/Icons";
import _ from "i18n";
import { shareArticleOnSocialNetworks } from "Api";

import { SocialNetworkForm } from "./SocialNetworkForm";
import styles from "./Sidebar.module.scss";
import SharingHistory from "./SharingHistory";
// import StaticPickers from "./StaticPickers";

class SocialNetworksShare extends React.Component {
  constructor(props) {
    super(props);
    const userSocialNetworks = this.props.userSocialNetworks;
    this.state = {
      sharing: false,
      currentKey: null,
      dates: [],
      titles: getSocialNetworkAccounts(userSocialNetworks),
      personal: {
        facebook: {
          values: [],
          data: [],
          content: "",
        },
        twitter: {
          values: [],
          data: [],
          content: "",
        },
        linkedin: {
          values: [],
          data: [],
          content: "",
        },
      },
      community: {
        facebook: {
          values: [],
          data: [],
          content: "",
        },
        twitter: {
          values: [],
          data: [],
          content: "",
        },
        linkedin: {
          values: [],
          data: [],
          content: "",
        },
      },
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleValuesChange = this.handleValuesChange.bind(this);
    this.share = this.share.bind(this);
    this.cancel = this.cancel.bind(this);
    this.openCalendarModal = this.openCalendarModal.bind(this);
    this.removeDate = this.removeDate.bind(this);
  }

  handleTextChange(value, type, sn) {
    this.setState((prevstate) => {
      return {
        [type]: {
          ...prevstate[type],
          [sn]: {
            ...prevstate[type][sn],
            content: value,
          },
        },
      };
    });
  }

  handleValuesChange(values, data, type, sn) {
    if (values.length === 0) {
      this.setState({
        dates: [],
      });
    }
    this.setState((prevstate) => {
      return {
        [type]: {
          ...prevstate[type],
          [sn]: {
            ...prevstate[type][sn],
            values,
            data,
          },
        },
      };
    });
  }

  cancel() {
    this.props.handleFormCancel();
  }

  currentDate() {
    return moment.utc(new Date()).format("YYYY-MM-DD H:mm:ss");
  }

  parseSocialData() {
    const { personal, community, dates, titles } = this.state;
    let data = {};
    let facebookOrg = null;
    let twitterOrg = null;
    let linkedinOrg = null;

    if (community.facebook.data.length > 0) {
      facebookOrg = {};
      facebookOrg.message = community.facebook.content;
      facebookOrg.pages = community.facebook.data.map((item) => {
        return {
          key: item.key,
          title: titles["facebook"][item.key]
            ? titles["facebook"][item.key]
            : "",
          date: dates[item.key] ? dates[item.key] : this.currentDate(),
        };
      });
    }

    if (community.twitter.data.length > 0) {
      twitterOrg = {};
      twitterOrg.text = community.twitter.content;
      twitterOrg.pages = community.twitter.data.map((item) => {
        return {
          key: item.key,
          title: titles["tiwtter"][item.key] ? titles["tiwtter"][item.key] : "",
          date: dates[item.key] ? dates[item.key] : this.currentDate(),
        };
      });
    }

    if (community.linkedin.data.length > 0) {
      linkedinOrg = {};
      linkedinOrg.pages = community.linkedin.data.map((item) => {
        return {
          key: item.key,
          title: titles["linkedin"][item.key]
            ? titles["linkedin"][item.key]
            : "",
          date: dates[item.key] ? dates[item.key] : this.currentDate(),
        };
      });
    }

    let organization = {
      facebook: facebookOrg,
      twitter: twitterOrg,
      linkedin: linkedinOrg,
    };

    let facebookUsr = null;
    let twitterUsr = null;
    let linkedinUsr = null;

    if (personal.facebook.data.length > 0) {
      facebookUsr = {};
      facebookUsr.message = personal.facebook.content;
      facebookUsr.pages = personal.facebook.data.map((item) => {
        return {
          key: item.key,
          title: titles["facebook"][item.key]
            ? titles["facebook"][item.key]
            : "",
          date: dates[item.key] ? dates[item.key] : this.currentDate(),
        };
      });
    }

    if (personal.twitter.data.length > 0) {
      twitterUsr = {};
      twitterUsr.text = personal.twitter.content;
      twitterUsr.pages = personal.twitter.data.map((item) => {
        return {
          key: item.key,
          title: titles["twitter"][item.key] ? titles["twitter"][item.key] : "",
          date: dates[item.key] ? dates[item.key] : this.currentDate(),
        };
      });
    }

    if (personal.linkedin.data.length > 0) {
      linkedinUsr = {};
      linkedinUsr.pages = personal.linkedin.data.map((item) => {
        return {
          key: item.key,
          title: titles["linkedin"][item.key]
            ? titles["linkedin"][item.key]
            : "",
          date: dates[item.key] ? dates[item.key] : this.currentDate(),
        };
      });
    }

    let user = {
      facebook: facebookUsr,
      twitter: twitterUsr,
      linkedin: linkedinUsr,
    };

    return { organization, user };
  }

  share() {
    let data = this.parseSocialData();
    const { article, handleFormCancel, token } = this.props;

    this.setState({
      sharing: true,
    });
    let self = this;

    shareArticleOnSocialNetworks(token, {
      id: article.id,
      social: data,
    }).then(() => {
      self.setState({
        sharing: false,
      });
      handleFormCancel();
      toast.success("Success");
    });
  }

  renderSNSection(type, sn, icon, color, title, hasText = true) {
    const socialNetworksTreesData =
      type === "personal"
        ? this.props.userSocialNetworks
        : this.props.communitySocialNetworks;
    const treeData = socialNetworksTreesData[sn];

    let itemToRender = null;
    let timelineToRender = null;

    if (!treeData) {
      itemToRender = (
        <div className={`${styles.share_row} ${styles.disabled} `}>
          <div className={`${styles.share_social_icon} ${styles[icon]}`}>
            {icon === "twitter" && <IconTwitter />}
            {icon === "facebook" && <IconFacebook />}
            {icon === "linkedin" && <IconLinkedin />}
          </div>
          <div className={styles.social_section}>
            {_("article.no_account_found")}
          </div>
        </div>
      );
    } else {
      let snState = this.state[type][sn];
      let text = hasText ? snState.content : null;
      let selectedValues = snState.values;
      let data = snState.data;

      itemToRender = (
        <div className={styles.share_row}>
          <div className={`${styles.share_social_icon} ${styles[icon]}`}>
            {icon === "twitter" && <IconTwitter />}
            {icon === "facebook" && <IconFacebook />}
            {icon === "linkedin" && <IconLinkedin />}
          </div>
          <SocialNetworkForm
            hasText={hasText}
            text={text}
            type={type}
            socialNetwork={sn}
            treeData={treeData}
            checkedKeys={selectedValues}
            onTextChange={this.handleTextChange}
            onValuesChange={this.handleValuesChange}
            openCalendarModal={this.openCalendarModal}
            dates={this.state.dates}
            removeDate={this.removeDate}
          />
        </div>
      );
    }

    return (
      <div className="small-4 sn-div">
        <div className={styles.share_title} style={{ color }}>
          {sn}
        </div>
        {itemToRender}
        {/* {timelineToRender} */}
      </div>
    );
  }

  renderSectionByType(type, label) {
    const { historyData } = this.props;
    const data = historyData.filter((item) => {
      if (type === "personal") return item.type === "USER";
      else return item.type === "ORGANIZATION";
    });
    return (
      <div className={styles.configColumn}>
        <div className={styles["wrap-title"]}>
          <h4 className={styles.share_type_title}>{_(label)}</h4>
          {data && data.length > 0 && <SharingHistory data={data} />}
        </div>
        {this.renderSNSection(
          type,
          "facebook",
          "facebook",
          "#4267B2",
          "Facebook",
        )}
        {this.renderSNSection(type, "twitter", "twitter", "#1DA1F2", "Twitter")}
        {this.renderSNSection(
          type,
          "linkedin",
          "linkedin",
          "#2867B2",
          "LinkedIn",
          false,
        )}
      </div>
    );
  }

  openCalendarModal(social, key) {
    this.setState({
      currentKey: key,
    });
    const removeDate = this.removeDate.bind(this);
    Modal.confirm({
      icon: null,
      zIndex: 9999,
      content: (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          {/* <StaticPickers selectDate={this.selectDate.bind(this)} /> */}
        </div>
      ),
      onOk() {},
      onCancel() {
        removeDate(key);
      },
    });
  }

  selectDate(date) {
    let dates = this.state.dates;

    dates[this.state.currentKey] = moment
      .utc(date)
      .format("YYYY-MM-DD H:mm:ss");

    this.setState({
      dates: dates,
    });
  }

  removeDate(key) {
    let dates = this.state.dates;

    delete dates[key];

    this.setState({
      dates: dates,
    });
  }

  render() {
    const { sharing } = this.state;
    return (
      <div>
        <div className={styles.configRow}>
          {this.renderSectionByType("personal", "Personal")}

          {this.renderSectionByType("community", "Community")}
        </div>
        <div className={styles.controls}>
          <Button onClick={this.cancel} variant="default">
            {_("article.close")}
          </Button>
          <div className={styles.saveContainer}>
            <div className={`${styles.savelabel} hide-for-small-only`}>
              {_("article.save_sharing")}
            </div>
            {sharing ? (
              <Button
                variant="primary"
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
                className={styles.controls__ok}
              >
                <Loader
                  style={{
                    height: "10px",
                  }}
                  color={"#fff"}
                />
              </Button>
            ) : (
              <Button
                onClick={this.share}
                className={styles.controls__ok}
                variant="primary"
              >
                Partager
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const getSocialNetworkAccounts = (obj) => {
  if (Array.isArray(obj)) {
    return [];
  }

  if (!(obj.facebook || obj.twitter || obj.linkedin)) {
    return [];
  }

  let data = { facebook: {}, twitter: {}, linkedin: {} };

  if (obj.facebook) {
    obj.facebook.forEach((sn) => {
      sn.children.forEach((page) => {
        data["facebook"][page.key] = page.title;
      });
    });
  }

  if (obj.twitter) {
    obj.twitter.forEach((page) => {
      data["twitter"][page.key] = page.title;
    });
  }

  if (obj.linkedin) {
    obj.linkedin.forEach((page) => {
      data["linkedin"][page.key] = page.title;
    });
  }

  return data;
};

const convertSocialNetworksToTreeData = (obj) => {
  if (Array.isArray(obj) || obj === undefined) {
    return {};
  }

  if (!(obj.facebook || obj.twitter || obj.linkedin)) {
    return {};
  }

  let data = {};

  if (obj.facebook) {
    let treeData = extractFacebookTree(obj.facebook);
    data.facebook = treeData;
  }

  if (obj.twitter) {
    let treeData = extractTwitterTree(obj.twitter);
    data.twitter = treeData;
  }

  if (obj.linkedin) {
    let treeData = extractLinkedInTree(obj.linkedin);
    data.linkedin = treeData;
  }

  return data;
};

const extractFacebookTree = (obj) => {
  let treeData = [];
  let sn = "facebook";

  for (let key in obj) {
    let tree = [];
    // tree.key = "$$" + key;
    // tree.title = obj[key].username;

    // tree.children = [];

    let profile = {
      key: key,
      title: obj[key].username,
      disabled: true,
      image: obj[key].profile_picture_medium,
    };

    // tree.children.push(profile);

    let objPages = obj[key].pages;
    if (objPages !== null && typeof objPages === "object") {
      let pages = {};
      pages.key = "$$pages" + key;
      pages.title = profile.title + " Pages";

      pages.children = [];

      for (let pKey in objPages) {
        let page = {};
        page.key = objPages[pKey].id;
        page.isPage = true;
        page.title = objPages[pKey].name;
        page.image = objPages[pKey].picture_medium;
        pages.children.push(page);
      }
      if (pages.children.length > 0) {
        treeData.push(pages);
      }
    }
  }
  return treeData;
};

const extractTwitterTree = (obj) => {
  let treeData = [];
  let sn = "twitter";
  for (let key in obj) {
    let tree = {};
    tree.key = key;
    tree.title = obj[key].username;

    treeData.push(tree);
  }

  return treeData;
};

const extractLinkedInTree = (obj) => {
  let treeData = [];
  let sn = "linkedin";
  for (let key in obj) {
    let tree = {};
    tree.key = key;
    tree.title = obj[key].username;

    treeData.push(tree);
  }

  return treeData;
};

const mapStateToProps = (store, ownProps) => {
  return {
    token: store.auth.token,
    lng: store.params.lng,
    userSocialNetworks: convertSocialNetworksToTreeData(
      store.auth.user.socialNetworks,
    ),
    communitySocialNetworks: {},
    article: store.tamtamit.article,
  };
};
export default connect(mapStateToProps)(SocialNetworksShare);
