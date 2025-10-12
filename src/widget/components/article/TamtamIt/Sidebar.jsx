import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Modal } from "antd";
import "antd/dist/antd.css";

import Loader from "Common/Loader";
import Button from "Common/Button";
import { IconClose } from "Common/Icons";
import { isSocialNetworkExpired } from "Utils";
import { TTP_HOME_URL } from "Config";
import { fetchThemes, fetchCategories, setAuthUser } from "Actions";
import { tamtamIt, getSharingHistory, checkTamtamitUrl, getTTPUser } from "Api";
import _ from "i18n";

import SocialNetworksShare from "./SocialNetworksShare";
import TamtamItForm from "./TamtamItForm";
import ProgramItForm from "./ProgramItForm";
import styles from "./Sidebar.module.scss";
import homeStyles from "./TamtamIt.module.scss";

const DATE_FORMAT = "DD-MM-YYYY HH:mm";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // socialModalOpened: props.socialNetwork
      //   ? isSocialNetworkExpired(props.socialNetwork)
      //   : false,
      socialModalOpened: false,
      openingHome: false,
      historyData: [],
      socialStep: false,
      showUrlInput: true,
      fetchingShareUser: false,
      url: "",
      feed: {
        community: props.navCommunity
          ? {
              value: props.navCommunity.id,
              label: props.navCommunity.name,
            }
          : null,
        category: null,
        language: "fr",
        theme: null,
        pages: [],
        tags: [],
        media: [],
        images: [],
        title: "",
        description: "",
        shortened_url: "",
        selectedImageIndex: -1,
        publishedAt: moment().format(DATE_FORMAT),
        status: "DRAFT",
        scope: ["PUBLIC"],
        groups: [],
      },
      parsing: false,
      updated: false,
      isProgrammed: false,
    };
    this.parseData = this.parseData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleParse = this.handleParse.bind(this);
    this.checkUrl = this.checkUrl.bind(this);
    this.setImages = this.setImages.bind(this);
    this.handleCommunityChange = this.handleCommunityChange.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.cancel = this.cancel.bind(this);
    this.closeSocialModal = this.closeSocialModal.bind(this);
    this.handleOpeningHome = this.handleOpeningHome.bind(this);
    this.handleShowSocialStep = this.handleShowSocialStep.bind(this);
  }

  componentDidMount() {
    const { dispatch, categories } = this.props;
    const { language, community } = this.state.feed;

    // if (community) {
    //   dispatch(fetchThemes({ communityId: community.value, language }));
    // }
    if (categories.length === 0) {
      dispatch(fetchCategories({ language: language }));
    }
  }

  closeSocialModal() {
    // this.setState({ socialModalOpened: false });
    this.handleShowSocialStep();
  }

  handleOpeningHome() {
    this.setState({ openingHome: true });
    window.open(`${TTP_HOME_URL}/profile#networks`, "_blank").focus();
  }

  cancel() {
    this.setState({
      socialStep: false,
      showUrlInput: true,
      url: "",
      feed: {
        community: this.props.navCommunity
          ? {
              value: this.props.navCommunity.id,
              label: this.props.navCommunity.name,
            }
          : null,
        category: null,
        language: "fr",
        theme: null,
        pages: [],
        tags: [],
        media: [],
        images: [],
        title: "",
        description: "",
        shortened_url: "",
        selectedImageIndex: -1,
        publishedAt: moment().format(DATE_FORMAT),
        status: "DRAFT",
        scope: ["PUBLIC"],
        groups: [],
      },
      parsing: false,
      updated: false,
    });
    this.props.hideSidebar();
  }

  parseData(parsedData) {
    let feed = this.state.feed;

    if (parsedData) {
      let { provided_url, url_information } = parsedData;

      let tags = (url_information && url_information.tags) || [];
      let images = (url_information && url_information.images) || [];
      let existing_article =
        (parsedData && parsedData.existing_article) || null;

      tags = tags.map((tag) => {
        return { label: tag.name, value: tag.id };
      });

      images = images.map((image, index) => {
        return {
          url: image,
          isMain: index == 0,
        };
      });

      feed = {
        community: this.props.navCommunity
          ? {
              value: this.props.navCommunity.id,
              label: this.props.navCommunity.name,
            }
          : null,
        category: null,
        language: "fr",
        theme: null,
        pages: [],
        tags: tags,
        images: images,
        title: url_information.title,
        description: url_information.description,
        shortened_url: url_information.shortened_url,
        externalUrl: provided_url,
        publishedAt: moment().format(DATE_FORMAT),
        status: "DRAFT",
        scope: ["PUBLIC"],
        groups: [],
        existing_article,
      };
    }

    return feed;
  }

  handleChange({ target }) {
    this.setState({
      url: target.value,
    });
  }
  checkUrl() {
    let { token, community } = this.props;
    let url = this.state.url;
    let me = this;
    if (!community) {
      this.handleParse();
    } else if (url.length > 0) {
      this.setState({
        parsing: true,
      });
      let urlHasProtocolHttp = url.toLowerCase().startsWith("http");
      if (!urlHasProtocolHttp) {
        url = "http://" + url;
      }

      checkTamtamitUrl(token, community, url)
        .then((resp) => {
          this.setState({
            parsing: false,
          });
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
              me.handleParse();
            },
            onCancel() {
              me.setState({
                url: "",
              });
            },
          });
        })
        .catch((e) => {
          tamtamIt(token, {
            url,
          }).then((resp) => {
            this.setState({
              parsing: false,
              showUrlInput: false,
              feed: this.parseData(resp.data.data),
            });
          });
        });
    }
  }

  handleParse() {
    let { token } = this.props;
    let url = this.state.url;

    if (url.length > 0) {
      this.setState({
        parsing: true,
      });
      let urlHasProtocolHttp = url.toLowerCase().startsWith("http");
      if (!urlHasProtocolHttp) {
        url = "http://" + url;
      }
      tamtamIt(token, {
        url,
      }).then((resp) => {
        this.setState({
          parsing: false,
          showUrlInput: false,
          feed: this.parseData(resp.data.data),
        });
      });
      // this.setState({
      //   parsing: false,
      //   showUrlInput: false,
      //   feed: this.parseData({
      //     provided_url:
      //       "https://www.lalibre.be/sports/football/comment-romelu-lukaku-s-est-transforme-pour-devenir-l-un-des-attaquants-les-plus-complets-au-monde-60caff067b50a6318dd39146",
      //     url_information: {
      //       domain: "www.lalibre.be",
      //       shortened_url:
      //         "https://www.lalibre.be/sports/football/comment-romelu-lukaku-s-est-transforme-pour-devenir-l-un-des-attaquants-les-plus-complets-au-monde-60caff067b50a6318dd39146",
      //       title:
      //         "Comment Romelu Lukaku s\u0027est transform\u00e9 pour devenir l\u0027un des attaquants les plus complets au monde",
      //       description:
      //         "Romelu Lukaku sera l\u0027un des hommes de l\u0027Euro. Pourquoi ? Car il s\u0027est transform\u00e9 pour se perfectionner ces derni\u00e8res ann\u00e9es. Pour devenir l\u0027attaquant ultime.",
      //       language: "fr",
      //       url_type: { type: "URL", provider: null, id: null },
      //       images: [
      //         "https://t3.llb.be/uyjgeFObjXK-1sXoc9zGJE5OMYo=/0x1180:4399x3373/1280x640/60ca253d9978e26ce1a455cb.jpg",
      //         "https://t3.ldh.be/IseDN7fn3RUsMUQt-0cmxJmZXOs=/796x260:2241x1705/430x430/5dcad748d8ad58130da8794b.jpg",
      //       ],
      //       tags: [{ id: 4875, name: "Monde" }],
      //       objectType: "FLUX",
      //       objectId: 0,
      //     },
      //   }),
      // });
    }
  }

  renderUrlInput() {
    const { url, parsing, isProgrammed } = this.state;
    const { user } = this.props;
    return (
      <div className={styles.urlBox}>
        <input
          type="text"
          value={url}
          onChange={this.handleChange}
          placeholder="TamtamIt: Insérer URL"
        />
        <div className={styles.actions}>
          {user && user.id === 8650 && (
            <>
              {" "}
              {parsing && isProgrammed ? (
                <Button
                  variant="primary"
                  style={{ paddingTop: "15px", paddingBottom: "15px" }}
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
                  variant="primary"
                  onClick={() => {
                    this.setState({
                      isProgrammed: true,
                    });
                    this.checkUrl();
                  }}
                >
                  {_("article.program")}
                </Button>
              )}
            </>
          )}

          {parsing && !isProgrammed ? (
            <Button
              variant="primary"
              style={{ paddingTop: "15px", paddingBottom: "15px" }}
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
            <Button variant="primary" onClick={this.checkUrl}>
              Tamtam-it
            </Button>
          )}
        </div>
      </div>
    );
  }

  setImages({ images, selectedIndex }) {
    this.setState((prevState) => {
      const imgs = images ? images : prevState.images;
      const selectedImageIndex = selectedIndex
        ? selectedIndex
        : prevState.selectedImageIndex;

      return {
        feed: {
          ...this.state.feed,
          images: imgs,
          selectedImageIndex,
        },
      };
    });
  }

  handleCommunityChange(value) {
    this.props.dispatch(
      fetchThemes({
        communityId: value.value,
        language: this.state.feed.language,
      })
    );
    this.setState({
      feed: {
        ...this.state.feed,
        community: value,
        theme: null,
        pages: [],
      },
    });
  }

  handleLanguageChange(value) {
    this.props.dispatch(
      fetchThemes({
        communityId: this.state.feed.community.value,
        language: value,
      })
    );

    this.setState({
      feed: {
        ...this.state.feed,
        language: value,
        theme: null,
        pages: [],
      },
    });
  }

  handleShowSocialStep() {
    const { user, token, setAuthUser } = this.props;
    this.setState({ fetchingShareUser: true });
    getTTPUser({
      userId: user.id,
      token: token,
    }).then((resp) => {
      setAuthUser(resp.data.data[0]);
      this.setState({
        fetchingShareUser: false,
        socialStep: true,
        socialModalOpened: false,
      });
      document.getElementById("ttp-tamtamit").scrollTo(0, 0);
    });
    this.getHistoryData();
  }

  getHistoryData() {
    let { token } = this.props;
    const { feed } = this.state;
    const organizationId = feed.community ? feed.community.value : 0;
    getSharingHistory(token, organizationId)
      .then((resp) => {
        this.setState({
          historyData: resp.data.data ? resp.data.data : [],
        });
      })
      .catch((e) => {
        this.setState({
          historyData: [],
        });
      });
  }

  render() {
    const { isOpened, language } = this.props;
    const {
      showUrlInput,
      url,
      feed,
      socialStep,
      historyData,
      socialModalOpened,
      openingHome,
      fetchingShareUser,
    } = this.state;

    return (
      <div className={styles.sidebar}>
        <div className={styles.title}>{_("article.import_article")}</div>
        <p className={styles.subtitle}>
          {showUrlInput ? (
            _("article.import_article_subtitle")
          ) : (
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          )}
        </p>
        {showUrlInput ? (
          this.renderUrlInput()
        ) : !socialStep ? (
          <>
            {this.state.isProgrammed ? (
              <ProgramItForm
                language={language}
                setImages={this.setImages}
                feed={feed}
                url={url}
                handleFormCancel={this.cancel}
                handleTagsChange={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      tags: e,
                    },
                  })
                }
              />
            ) : (
              <TamtamItForm
                lng={language}
                handleCommunityChange={this.handleCommunityChange}
                handleLanguageChange={this.handleLanguageChange}
                setImages={this.setImages}
                feed={feed}
                url={url}
                handleCategoryChange={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      category: e,
                    },
                  })
                }
                handleThemeChange={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      theme: e,
                      pages: [],
                    },
                  })
                }
                handlePagesChange={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      pages: e,
                    },
                  })
                }
                handleTagsChange={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      tags: e,
                    },
                  })
                }
                setPublishedAt={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      publishedAt: e,
                    },
                  })
                }
                setStatus={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      status: e,
                    },
                  })
                }
                setPublishOnWorkflow={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      publishOnWorkflow: e,
                    },
                  })
                }
                handleScopeChange={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      scope: e,
                    },
                  })
                }
                handleGroupsChange={(e) =>
                  this.setState({
                    feed: {
                      ...this.state.feed,
                      groups: e,
                    },
                  })
                }
                handleFormCancel={this.cancel}
                setShowUpdateSocialModal={(e) =>
                  this.setState({ socialModalOpened: e })
                }
                showSocialStep={() => this.handleShowSocialStep()}
              />
            )}
          </>
        ) : (
          <SocialNetworksShare
            handleFormCancel={this.cancel}
            historyData={historyData}
          />
        )}

        <Modal
          closable={false}
          visible={socialModalOpened}
          maskClosable={false}
          width="50vw"
          height="50vh"
          footer={null}
          onCancel={this.closeSocialModal}
          destroyOnClose={true}
          zIndex="9999"
          bodyStyle={{ padding: "0" }}
        >
          <div className={homeStyles.modal_header}>
            {_("article.social_network")}
          </div>
          <div
            className={homeStyles.modal_close}
            onClick={this.closeSocialModal}
          >
            <IconClose />
          </div>
          <div className={homeStyles.modal_body}>
            {_("article.share_expired")}
          </div>
          <div className={homeStyles.controls}>
            {openingHome ? (
              <span></span>
            ) : (
              <Button
                onClick={this.handleOpeningHome}
                variant="primary"
                className={homeStyles.controls__cancel}
              >
                {_("article.update")}
              </Button>
            )}

            {fetchingShareUser ? (
              <Button
                variant="primary"
                style={{ paddingTop: "15px", paddingBottom: "15px" }}
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
              <Button onClick={this.closeSocialModal} variant="primary">
                {_("article.continue")}
              </Button>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    lng: store.params.lng,
    // community: store.articles.article.community,
    navCommunity: store.auth.navCommunity,
    communities: store.auth.user !== null ? store.auth.user.communities : [],
    user: store.auth.user,
    token: store.auth.token,
    saving: store.tamtamit.saving,
    categories: store.categories.items,
    socialNetworks: store.auth.user.socialNetworks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthUser: (user) => dispatch(setAuthUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
