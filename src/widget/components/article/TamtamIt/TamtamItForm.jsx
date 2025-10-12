import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import Select from "react-select";
import moment from "moment";
import { Modal } from "antd";

import Loader from "Common/Loader";
import Button from "Common/Button";
import {
  persistTamtamIt,
  persistShareTamtamIt,
  startTamtamit,
  stopTamtamit,
} from "Actions";
import MultiSwitch from "Common/Switch/MultiSwitch";
import { convertDateToUTC, isSocialNetworkExpired } from "Utils";
import _ from "i18n";
import { checkTamtamitUrl } from "Api";

import MediaZone from "./MediaZone";
import CategorySelect from "./CategorySelect";
import ThemeSelect from "./ThemeSelect";
import PagesSelect from "./PagesSelect";
import TagsSelect from "./TagsSelect";
import ArticleStatus from "./ArticleStatus";
import Scope from "./Scope";
import styles from "./Sidebar.module.scss";

const DATE_FORMAT = "DD-MM-YYYY HH:mm";
const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "none",
    backgroundColor: state.isDisabled ? "#e6e6e6" : "#fff",
    boxShadow: "none",
    border: "none",
    borderBottom: state.isFocused ? "1px solid #2495E1" : "1px solid #CED4DB",
    "&:hover": {
      borderColor: state.isFocused ? "#18A0FB" : "#DFE2E6",
    },
    padding: 0,
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: "12px",
    lineHeight: "14px",
    color: "#6D7F92",
    fontWeight: 400,
  }),
  menuList: (provided, state) => ({
    ...provided,
    paddingTop: "0",
    paddingBottom: "0",
  }),
  menu: (provided, state) => ({
    ...provided,
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
    fontSize: "12px",
    lineHeight: "14px",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: "#F1F2F4",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    fontSize: ".75rem",
    textTransform: "uppercase",
    color: "inherit",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#29394D",
    fontWeight: 500,
  }),
};

class TamtamItForm extends Component {
  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
  }

  // componentDidMount() {
  //     const { dispatch, community } = this.props;
  //     const { language } = this.state.feed;

  //     if (community) {
  //         let communities = [community];
  //         let languages = [language];
  //         dispatch(fetchThemes({ communities, languages }));
  //     }
  // }

  validate() {
    let {
      title,
      tags,
      theme,
      category,
      community,
      publishedAt,
      pages,
      images,
    } = this.props.feed;

    const DATE_FORMAT = "DD-MM-YYYY HH:mm";
    let errors = [];

    if (!images || images.length < 1) {
      errors.push(_("article.image_required"));
    }

    if (title.trim().length === 0) {
      errors.push(_("article.validate_title"));
    }

    if (!category) {
      errors.push(_("article.validate_category"));
    }

    if (!theme) {
      errors.push(_("article.validate_theme"));
    }

    if (!community) {
      errors.push(_("article.validate_community"));
    }

    if (!tags || tags.length < 2) {
      errors.push(_("article.validate_tags"));
    }

    if (!pages || pages.length < 1) {
      errors.push(_("article.validate_page"));
    }

    if (publishedAt.trim() !== "") {
      if (
        publishedAt.indexOf("_") !== -1 ||
        !moment(publishedAt, [DATE_FORMAT]).isValid()
      ) {
        errors.push(_("article.validate_publish_date"));
      }
    }

    return errors;
  }
  validateForm() {
    let errors = this.validate();
    if (errors && errors.length > 0) {
      let ErrorsContainer = ({ errors }) => (
        <div>
          <span>{_("article.errors") + " :"}</span>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      );
      toast.error(<ErrorsContainer errors={errors} />, {
        autoClose: true,
      });
      return false;
    }
    return true;
  }

  checkUrl(hasShowSocialStep) {
    const { startTamtamit, stopTamtamit, community } = this.props;
    if (!this.validateForm()) {
      return;
    }
    let me = this;
    const { token, feed, url, handleFormCancel } = this.props;
    if (community && community === feed.community.value) {
      this.save(hasShowSocialStep);
    } else {
      startTamtamit(hasShowSocialStep);

      checkTamtamitUrl(token, feed.community.value, url)
        .then((resp) => {
          // if (payload.statusCode && payload.statusCode === 400) {
          //   toast.error(payload.title, { autoClose: true });
          // } else if (
          console.log("=====", resp);

          stopTamtamit(hasShowSocialStep);
          Modal.confirm({
            icon: null,
            zIndex: 9999,
            content: (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "2rem",
                }}
              >
                {_("article.article_already_imported")} &nbsp;
                {resp.data.data.createdAt}. <br />
                {_("article.do_you_want_reimported")}
              </div>
            ),
            onOk() {
              me.save(hasShowSocialStep);
            },
            onCancel() {
              handleFormCancel();
            },
          });
        })
        .catch((e) => {
          me.save(hasShowSocialStep);
        });
    }
  }

  save(hasShowSocialStep) {
    const {
      showSocialStep,
      feed,
      persistTamtamIt,
      persistShareTamtamIt,
      handleFormCancel,
      setShowUpdateSocialModal,
      socialNetwork,
    } = this.props;
    let {
      id,
      community,
      category,
      language,
      theme,
      pages,
      tags,
      images,
      title,
      description,
      publishedAt,
      status,
      shortened_url,
      scope,
      groups,
    } = feed;

    let selectedGroups = groups.map((item) => {
      return item.id;
    });

    let data = {
      communityId: community.value,
      categoryId: category.id,
      language,
      themeId: theme.id,
      pages,
      tags,
      images,
      title,
      description,
      shortened_url,
      publishedAt: publishedAt
        ? convertDateToUTC(publishedAt, DATE_FORMAT, API_DATE_FORMAT)
        : "",
      status,
      id,
      scope,
      groups: selectedGroups,
    };

    if (hasShowSocialStep) {
      persistShareTamtamIt(data).then((resp) => {
        if (resp.error) {
          toast.error("Error", { autoClose: true });
        } else {
          if (!socialNetwork || isSocialNetworkExpired(socialNetwork)) {
            setShowUpdateSocialModal(true);
          } else {
            showSocialStep();
          }
        }
      });
    } else {
      persistTamtamIt(data).then((resp) => {
        if (resp.error) {
          toast.error("Error", { autoClose: true });
        } else {
          handleFormCancel();
        }
      });
    }
  }

  handleDropCover(acceptedFiles, rejectedFiles) {
    if (acceptedFiles.length === 0) return;

    const coverFile = Object.assign(acceptedFiles[0], {
      preview: URL.createObjectURL(acceptedFiles[0]),
    });
    this.setState((prevState) => ({
      userMeta: { ...prevState.userMeta, coverFile },
    }));
  }

  render() {
    const {
      communities,
      auth,
      lng,
      community,
      saving,
      shareSaving,
      feed,
    } = this.props;

    const communityOptions = [];
    communities.map((com) => {
      communityOptions.push({
        value: com.id,
        label: com.name,
      });
    });

    let themeCommunities =
      community && community.value !== undefined ? [community.value] : [];
    const languages = [
      { key: "en", label: _("english") },
      { key: "fr", label: _("french") },
      { key: "nl", label: _("dutch") },
    ];
    const languageLabels = languages.map((lang) => lang.label);
    const languageVals = languages.map((lang) => lang.key);

    return (
      <div>
        <MediaZone
          images={feed.images}
          selectedIndex={0}
          setImages={this.props.setImages}
        />

        <div className={styles.form_row}>
          <label className={styles.configLabel}>{_("article.title")}</label>

          <textarea
            className={styles.tt_title}
            rows={2}
            value={feed.title}
            onChange={(e) =>
              this.setState({
                feed: {
                  ...this.state.feed,
                  title: e.target.value,
                },
              })
            }
          />
        </div>

        <div className={styles.form_row}>
          <label className={styles.configLabel}>
            {_("article.description")}
          </label>

          <textarea
            rows={3}
            value={feed.description}
            onChange={(e) =>
              this.setState({
                feed: {
                  ...this.state.feed,
                  description: e.target.value,
                },
              })
            }
          />
        </div>

        <div className={styles.configRow}>
          <div className={`${styles.configColumn}`}>
            <label className={styles.configLabel}>
              {_("article.community")}
            </label>
            <Select
              styles={selectStyles}
              options={communityOptions}
              isSearchable={false}
              placeholder={_("select_community")}
              value={feed.community}
              onChange={this.props.handleCommunityChange}
            />
          </div>
          <div className={`${styles.configColumn}`}>
            <label className={styles.configLabel}>
              {_("article.category")}
            </label>
            <CategorySelect
              lng={lng}
              selectedValue={feed.category}
              selectStyles={selectStyles}
              onChange={this.props.handleCategoryChange}
            />
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={`${styles.configColumn}`}>
            <label className={styles.configLabel}>{_("article.theme")}</label>
            <ThemeSelect
              selectStyles={selectStyles}
              communities={themeCommunities}
              lng={lng}
              selectedValue={feed.theme}
              onChange={this.props.handleThemeChange}
            />
          </div>
          <div className={`${styles.configColumn}`}>
            <label className={styles.configLabel}>{_("article.page")}</label>
            <PagesSelect
              selectStyles={selectStyles}
              selectedValues={feed.pages}
              onChange={this.props.handlePagesChange}
              theme={feed.theme}
              language={lng}
            />
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={`${styles.configColumn} ${styles.mswitch}`}>
            <label className={styles.configLabel}>
              {_("article.language")}
            </label>
            <MultiSwitch
              labels={languageLabels}
              vals={languageVals}
              name="language"
              selectedValue={feed.language}
              afterChange={this.props.handleLanguageChange}
            />
          </div>

          <div className={`${styles.configColumn} ${styles.mswitch}`}>
            <label className={styles.configLabel}>{_("article.status")}</label>
            <ArticleStatus
              status={feed.status}
              community={feed.community}
              publishedAt={feed.publishedAt}
              setPublishedAt={this.props.setPublishedAt}
              setStatus={this.props.setStatus}
              setPublishOnWorkflow={this.props.setPublishOnWorkflow}
              publishOnWorkflow={feed.publishOnWorkflow}
            />
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={styles.configColumn}>
            <label className={styles.configLabel}>{_("article.tags")}</label>
            <TagsSelect
              language={lng}
              selectedCommunity={feed.community}
              selectedTags={feed.tags}
              selectStyles={selectStyles}
              onChange={this.props.handleTagsChange}
            />
          </div>
          <div className={styles.configColumn}>
            <label className={styles.configLabel}>{_("article.scope")}</label>
            <Scope
              auth={auth}
              community={feed.community}
              selectStyles={selectStyles}
              scope={feed.scope}
              groups={feed.groups}
              handleChange={this.props.handleScopeChange}
              handleGroupsChange={this.props.handleGroupsChange}
            />
          </div>
        </div>

        <div className={styles.controls}>
          <Button onClick={this.props.handleFormCancel} variant="default">
            {_("article.cancel")}
          </Button>
          <div className={styles.saveContainer}>
            {saving ? (
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
                onClick={() => this.checkUrl(false)}
                className={styles.controls__ok}
                variant="primary"
              >
                {_("article.save")}
              </Button>
            )}
            {/* {["PUBLISHED", "SCHEDULED"].includes(feed.status) && (
              <>
                {shareSaving ? (
                  <Button
                    variant="secondary"
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
                    onClick={() => this.checkUrl(true)}
                    className={styles.controls__ok}
                    variant="secondary"
                  >
                    {_("article.save_and_share")}
                  </Button>
                )}
              </>
            )} */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    community: store.auth.currentCommunity,
    navCommunity: store.auth.navCommunity,
    communities: store.auth.user !== null ? store.auth.user.communities : [],
    auth: store.auth,
    user: store.auth.user,
    token: store.auth.token,
    saving: store.tamtamit.saving,
    shareSaving: store.tamtamit.shareSaving,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    startTamtamit: (share) => dispatch(startTamtamit(share)),
    stopTamtamit: (share) => dispatch(stopTamtamit(share)),
    persistTamtamIt: (data) => dispatch(persistTamtamIt(data)),
    persistShareTamtamIt: (data) => dispatch(persistShareTamtamIt(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TamtamItForm);
