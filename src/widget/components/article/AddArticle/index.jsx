import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";
import { Modal as AntModal } from "antd";

import { toast } from "react-toastify";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import { NacnWidget } from "cockpit-ia";
import "cockpit-ia/main.css";

import Controls from "../Editor/Controls";
import EditorTab from "./EditorTab";
import ArticleConfiguration from "../ArticleConfiguration";
// import SocialNetworksShare from "../TamtamIt/SocialNetworksShare";

import {
  fetchArticle,
  fetchTranslateArticle,
  fetchTranslateArticleNoContent,
  toggleArticleModal,
  uploadTmpMedia,
  setArticle,
  resetArticle,
  setThemeCurrentLanguage,
  fetchArticleTags,
  setAllowFetchTags,
  setAuthUser,
  setTamtamitArticle,
  setIsSaving,
  setIsSavingShare,
  setTranslateLanguage,
  setIsCloning,
  setAllowCreateTags,
  setArticleTags,
  fetchSuperTagTheme,
  setMediaMedia,
} from "../../../redux/actions";
import {
  getAuthorAllHeadlines,
  getAuthorHeadlines,
  convertDateToUTC,
  isSocialNetworkExpired,
  findNextDate,
} from "../../../services/utils";
import {
  getTTPUser,
  checkUserTokenValidity,
  getGroups,
  getSharingHistory,
  getUsersByIds,
  saveQuickArticle,
  getUserHeadline,
  saveResetRecurrentArticle,
  getBlogRole,
  saveArticle,
} from "../../../api";
import { IconClose } from "../../common/Icons";
import Button from "../../common/Button";
import Loader from "../../common/Loader";
import { TTP_HOME_URL } from "../../../services/config";

import styles from "./AddArticle.module.scss";
import homeStyles from "../TamtamIt/TamtamIt.module.scss";
import _ from "../../../i18n";

const DATE_FORMAT = "DD-MM-YYYY HH:mm";
const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

/*const getDefaultScope = (community) => {
  // let defaultScope = null;

  // if (community) {
  //   const { blogPreferences, csGeneralScope } = community;

  //   if (blogPreferences) {
  //     if (blogPreferences.cs_default_scope) {
  //       defaultScope = blogPreferences.cs_default_scope;
  //     } else if (blogPreferences.cs_app_scope) {
  //       defaultScope = blogPreferences.cs_app_scope;
  //     }
  //   }
  //   if (!defaultScope && csGeneralScope) {
  //     defaultScope = csGeneralScope;
  //   } else {
  //     defaultScope = "INTRA_SHARE";
  //   }
  // }
  // return defaultScope;
  const allowedScopes = getAllowedScopes(community);
  let defaultScope = allowedScopes[0];

  if (community) {
    const { blogPreferences } = community;

    if (blogPreferences && blogPreferences.cs_default_scope) {
      defaultScope = blogPreferences.cs_default_scope;
    }
  }
  return defaultScope;
};*/

const getDefaultLanguage = (community, language) => {
  let allowedLanguages = [];
  let defaultLanguage = "en";
  if (
    community &&
    community.blogs &&
    community.blogs.length > 0 &&
    community.blogs[0].preferences &&
    community.blogs[0].preferences.allowedLanguages
  ) {
    allowedLanguages = community.blogs[0].preferences.allowedLanguages;
  }

  if (allowedLanguages.length === 0) {
    defaultLanguage = language;
  } else {
    defaultLanguage =
      allowedLanguages.indexOf(language) > -1 ? language : allowedLanguages[0];
  }

  return defaultLanguage;
};

export function AddArticle(props) {
  const [activeTab, setActiveTab] = useState("EDITOR");
  const [newContent, setNewContent] = useState("");
  const [content, setContent] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [yHeight, setYHeight] = useState(0);
  const [handleCropping, setHandleCropping] = useState(1);
  const [coverFile, setCoverFile] = useState(null);
  const [coverButtons, setCoverButtons] = useState("ICONS"); // 'ICONS', 'EDIT_POSITION'
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [imageHasChanged, setImageHasChanged] = useState(false);
  const [showUpdateSocialModal, setShowUpdateSocialModal] = useState(false);
  const [openingHome, setOpeningHome] = useState(false);
  const [shareStep, setShareStep] = useState(false);
  const [shareHistoryData, setShareHistoryData] = useState([]);
  const [fetchingShareUser, setFetchingShareUser] = useState(false);
  const tamtamItArticle = useSelector((state) => state.tamtamit.article);
  const ttpApiUrl = useSelector((state) => state.params.ttpApiUrl);
  const ttpAiUrl = useSelector((state) => state.params.ttpAiUrl);

  const editorRef = useRef();
  const ref = useRef({
    yPos: 0,
  });

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const defaultCommunity = useSelector((state) => state.params.community);
  const openedModal = useSelector((state) => state.articles.openedModal);
  const mediaMedia = useSelector((state) => state.articles.mediaMedia);
  const mediaIsAlbum = useSelector((state) => state.articles.mediaIsAlbum);
  const tamtamItModalOpen = useSelector((state) => state.tamtamit.openedModal);

  const community = useSelector((state) => state.articles.article.community);
  const authors = useSelector((state) => state.articles.article.authors);
  const title = useSelector((state) => state.articles.article.title);
  const category = useSelector((state) => state.articles.article.category);
  const theme = useSelector((state) => state.articles.article.theme);
  const pages = useSelector((state) => state.articles.article.pages);
  const type = useSelector((state) => state.articles.article.type);
  const tags = useSelector((state) => state.articles.article.tags);
  const relevance = useSelector((state) => state.articles.article.relevance);
  const scope = useSelector((state) => state.articles.article.scope);
  const selectedGroups = useSelector((state) => state.articles.article.groups);
  const specCollaborators = useSelector(
    (state) => state.articles.article.specCollaborators,
  );
  const specClients = useSelector(
    (state) => state.articles.article.specClients,
  );
  const specContacts = useSelector(
    (state) => state.articles.article.specContacts,
  );
  const status = useSelector((state) => state.articles.article.status);
  const selectedLanguage = useSelector(
    (state) => state.articles.article.selectedLanguage,
  );
  const mainMediaArticleId = useSelector(
    (state) => state.articles.article.mainMediaArticleId,
  );
  const publishedAt = useSelector(
    (state) => state.articles.article.publishedAt,
  );
  const comment = useSelector((state) => state.articles.article.comment);
  const isFromAi = useSelector((state) => state.articles.article.isFromAi);
  const isPrivate = useSelector((state) => state.articles.article.isPrivate);
  const privateGroups = useSelector(
    (state) => state.articles.article.privateGroups,
  );
  const publishOnWorkflow = useSelector(
    (state) => state.articles.article.publishOnWorkflow,
  );
  const attachments = useSelector(
    (state) => state.articles.article.attachments,
  );
  const translateLanguage = useSelector(
    (state) => state.articles.translateLanguage,
  );
  const isCloning = useSelector((state) => state.articles.isCloning);
  const relatedArticles = useSelector(
    (state) => state.articles.article.relatedArticles,
  );
  const editLoading = useSelector((state) => state.articles.fetching);
  const editArticleId = useSelector((state) => state.articles.article.id);
  const articleTitle = useSelector((state) => state.articles.article.title);
  const editContent = useSelector((state) => state.articles.article.content);

  const editMainMedia = useSelector(
    (state) => state.articles.article.main_media,
  );
  const [articleId, setArticleId] = useState(null);
  const allowFetchTags = useSelector((state) => state.tags.allowFetchTags);
  const fffLibrary = useSelector((state) => state.articles.article.fffLibrary);
  const isfffLibrary = useSelector(
    (state) => state.articles.article.isfffLibrary,
  );
  const canBeShared = useSelector(
    (state) => state.articles.article.canBeShared,
  );
  const recurrence = useSelector((state) => state.articles.article.recurrence);
  const notification = useSelector(
    (state) => state.articles.article.notification,
  );
  const notificationToSentAt = useSelector(
    (state) => state.articles.article.notificationToSentAt,
  );
  // const notificationHour = useSelector(
  //   (state) => state.articles.article.notificationHour
  // );

  const [defaultCategory, setDefaultCategory] = useState(null);
  const [defaultType, setDefaultType] = useState(null);
  const [defaultTheme, setDefaultTheme] = useState(null);
  const [defaultPages, setDefaultPages] = useState([]);
  const categories = useSelector((state) => state.categories.items);
  const themes = useSelector((state) => state.themes.items);
  const types = useSelector((state) => state.types.items);

  if (community === null) {
    let currentCommunity = null;
    let tabCurrentCommunity = null;
    if (
      auth.user &&
      auth.navCommunity &&
      auth.user.communities &&
      auth.user.communities.length > 0
    ) {
      tabCurrentCommunity = auth.user.communities.filter(
        (com) => com.id == auth.navCommunity.id,
      )[0];
      if (tabCurrentCommunity) {
        currentCommunity = {
          value: tabCurrentCommunity.id,
          label: tabCurrentCommunity.name,
        };
      }
      dispatch(setArticle({ index: "community", value: currentCommunity }));
      // dispatch(
      //   setArticle({
      //     index: "scope",
      //     value: getDefaultScope(tabCurrentCommunity),
      //   })
      // );
      dispatch(
        setArticle({
          index: "selectedLanguage",
          value: getDefaultLanguage(tabCurrentCommunity, props.language),
        }),
      );
      dispatch(setThemeCurrentLanguage(props.selectedLanguage));
    } else if (auth.user && !auth.navCommunity) {
      dispatch(
        setArticle({ index: "selectedLanguage", value: props.language }),
      );
    }
  }

  useEffect(() => {
    window.showEditArticle = function (id) {
      if (id) {
        setArticleId(id);
        dispatch(toggleArticleModal());
        dispatch(fetchArticle({ articleId: id }));
      }
    };
    window.showCloneArticle = function (id) {
      if (id) {
        setArticleId(id);
        dispatch(setIsCloning(true));
        dispatch(toggleArticleModal());
        dispatch(fetchArticle({ articleId: id }));
      }
    };
    window.showTranslateArticle = function (id, translateLanguage) {
      if (id) {
        setArticleId(id);
        dispatch(setTranslateLanguage(translateLanguage));
        dispatch(toggleArticleModal());
        dispatch(
          fetchTranslateArticle({
            articleId: id,
            translateLanguage: translateLanguage,
          }),
        );
      }
    };
    window.showTranslateArticleNoContent = function (id, translateLanguage) {
      if (id) {
        setArticleId(id);
        dispatch(setTranslateLanguage(translateLanguage));
        dispatch(toggleArticleModal());
        dispatch(fetchTranslateArticleNoContent({ articleId: id }));
      }
    };
  }, []);
  useEffect(() => {
    if (openedModal) {
      const fetchData = async () => {
        const userResponse = await checkUserTokenValidity({
          ttpApiUrl,
          userId: auth.user.id,
          token: auth.token,
        });
      };

      fetchData().catch((e) => {
        if (e.response?.status === 401 && props.onExpiredToken) {
          props.onExpiredToken();
        }
      });
    }
  }, [openedModal]);

  useEffect(() => {
    if (articleId && articleId === editArticleId) {
      setCoverFile(
        editMainMedia
          ? editMainMedia.fullMediaUrl ||
              ttpApiUrl + "/" + editMainMedia.webPath
          : null,
      );

      handleSetYPos(editMainMedia ? editMainMedia.yPos : 0);
      setYHeight(editMainMedia ? editMainMedia.yHeight : 0);
      setCoverButtons(editMainMedia ? "EDIT_POSITION" : "ICONS");

      if (specCollaborators && specCollaborators.length > 0) {
        getUsersByIds({
          ttpApiUrl,
          token: auth.token,
          ids: specCollaborators,
        }).then((result) => {
          if (result.data.data) {
            dispatch(
              setArticle({
                index: "specCollaborators",
                value: result.data.data,
              }),
            );
          }
        });
      }
      if (specClients && specClients.length > 0) {
        getUsersByIds({
          ttpApiUrl,
          token: auth.token,
          ids: specClients,
        }).then((result) => {
          if (result.data.data) {
            let tab = result.data.data.map((user) => {
              return {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
              };
            });
            dispatch(setArticle({ index: "specClients", value: tab }));
          }
        });
      }
      if (specContacts && specContacts.length > 0) {
        getUsersByIds({
          ttpApiUrl,
          token: auth.token,
          ids: specContacts,
        }).then((result) => {
          if (result.data.data) {
            dispatch(
              setArticle({ index: "specContacts", value: result.data.data }),
            );
          }
        });
      }
      if (selectedGroups && selectedGroups.length > 0) {
        let customFilter = [
          {
            property: "id",
            value: selectedGroups,
            operator: "in",
          },
        ];
        getGroups({
          token: auth.token,
          clientId: community ? community.value : null,
          customFilter,
        }).then((result) => {
          dispatch(setArticle({ index: "groups", value: result.data.data }));
        });
      }
      if (privateGroups && privateGroups.length > 0) {
        let customFilter = [
          {
            property: "id",
            value: privateGroups,
            operator: "in",
          },
        ];
        getGroups({
          token: auth.token,
          clientId: community ? community.value : null,
          customFilter,
        }).then((result) => {
          dispatch(
            setArticle({ index: "privateGroups", value: result.data.data }),
          );
        });
      }
      if (!translateLanguage) {
        setInitialContent(editContent);
        // mainMediaArticleId: article.main_media ? article.main_media.id : null,
      } else {
        // Fetch authors headline in translateLanguage
        if (community && authors.length > 0) {
          const userIds = [];
          authors.forEach((a) => {
            if (a.isAuthor) {
              userIds.push(a.id);
            }
          });
          if (userIds.length > 0) {
            const authorsTab = [...authors];
            getUserHeadline({
              ttpApiUrl,
              token: auth.token,
              userIds,
              organizationId: community.value,
            })
              .then((resp) => {
                const headlines = {};
                resp.data.data.forEach((a) => {
                  headlines[a.id] = {
                    title: a.firstName + " " + a.lastName,
                    head: getAuthorHeadlines(a, translateLanguage),
                  };
                });

                authorsTab.forEach((a, idx) => {
                  if (a.isAuthor && headlines[a.id] && headlines[a.id].head) {
                    authorsTab[idx] = { ...a, signature: headlines[a.id] };
                  }
                });
                dispatch(setArticle({ index: "authors", value: authorsTab }));
              })
              .catch((e) => {});
          }
        }
      }
      setInitialContent(editContent);
    }
  }, [editArticleId]);

  useEffect(() => {});

  useEffect(() => {
    if (!articleId && auth.user && defaultCommunity && !tamtamItModalOpen) {
      handleEmptyAuthors();
    } else if (articleId && auth.user && defaultCommunity) {
      handleAllowTags();
    }
  }, [defaultCommunity, tamtamItModalOpen, openedModal]);

  const setAttachments = (newAttachments) => {
    dispatch(setArticle({ index: "attachments", value: newAttachments }));
  };

  const handleAttachmentsChange = (newAttachment) => {
    setUploadingAttachment(true);
    dispatch(
      uploadTmpMedia({ ttpApiUrl, token: auth.token, data: newAttachment }),
    )
      .then((resp) => {
        const url = resp.payload.data.data.url;
        let attachment = {
          name: newAttachment.name,
          type: newAttachment.type,
          inHistory: 0,
          url: `${ttpApiUrl}/${url}`,
          isTmp: true,
        };
        let newAttachments = attachments.concat(attachment);
        setAttachments(newAttachments);
        setUploadingAttachment(false);
      })
      .catch(() => {
        setUploadingAttachment(false);
      });
  };

  const handleEditAttachment = (index, value) => {
    if (value.length <= 3) {
      return null;
    }

    let newAttachments = JSON.parse(JSON.stringify(attachments));
    newAttachments[index].name = value;
    setAttachments(newAttachments);
  };

  const handleDeleteAttachment = (index) => {
    if (!attachments || attachments.length === 0) return;

    if (attachments[index] && attachments[index] instanceof File) {
      setAttachments(attachments.filter((_, i) => i !== index));
    } else if (attachments[index] && !(attachments[index] instanceof File)) {
      let newAttachments = JSON.parse(JSON.stringify(attachments));

      newAttachments[index].inHistory = true;
      setAttachments(newAttachments);
    }
  };

  const handleDefaultScope = (preferences) => {
    const isMediaCommunity = community && community.value === 9;
    let tabScope = preferences.scope.map((s) => {
      if ("ALL_COLLABORATORS" === s) {
        return isMediaCommunity ? "FID_COLLABORATOR" : "ALL_COLLABORATORS";
      } else if ("ALL_CLIENTS" === s) {
        return isMediaCommunity ? "FID_CLIENT" : "ALL_CLIENTS";
      }

      if (
        s === "SPEC_COLLABORATOR" &&
        preferences.specCollaborators?.length > 0
      ) {
        getUsersByIds({
          ttpApiUrl,
          token: auth.token,
          ids: preferences.specCollaborators,
        }).then((result) => {
          if (result.data.data) {
            dispatch(
              setArticle({
                index: "specCollaborators",
                value: result.data.data,
              }),
            );
          }
        });
      } else if (s === "SPEC_CLIENT" && preferences.specClients?.length > 0) {
        getUsersByIds({
          ttpApiUrl,
          token: auth.token,
          ids: preferences.specClients,
        }).then((result) => {
          if (result.data.data) {
            let tab = result.data.data.map((user) => {
              return {
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
              };
            });
            dispatch(setArticle({ index: "specClients", value: tab }));
          }
        });
      } else if (s === "SPEC_CONTACT" && preferences.specContacts?.length > 0) {
        getUsersByIds({
          ttpApiUrl,
          token: auth.token,
          ids: preferences.specContacts,
        }).then((result) => {
          if (result.data.data) {
            dispatch(
              setArticle({
                index: "specContacts",
                value: result.data.data,
              }),
            );
          }
        });
      } else if (s === "GROUP" && preferences.groups?.length > 0) {
        let customFilter = [
          {
            property: "id",
            value: preferences.groups,
            operator: "in",
          },
        ];
        getGroups({
          token: auth.token,
          clientId: community ? community.value : null,
          customFilter,
        }).then((result) => {
          dispatch(setArticle({ index: "groups", value: result.data.data }));
        });
      }

      return s;
    });
    dispatch(
      setArticle({
        index: "scope",
        value: tabScope,
      }),
    );
  };

  const handleEmptyAuthors = async () => {
    const authorTitle =
      auth.user.defaultSignature && auth.user.defaultSignature.title
        ? auth.user.defaultSignature.title
        : auth.user.firstName + " " + auth.user.lastName;
    let head = getAuthorHeadlines(auth.user, props.language);

    let defaultChains = [];
    if (defaultCommunity) {
      const userResponse = await getTTPUser({
        ttpApiUrl,
        userId: auth.user.id,
        token: auth.token,
      });
      const user = userResponse.data.data ? userResponse.data.data[0] : null;
      const headlineAttr = `headline${
        props.language.charAt(0).toUpperCase() + props.language.slice(1)
      }`;
      const blogRole = user.blogRole
        ? user.blogRole.filter(
            (item) => item.organizationId === defaultCommunity,
          )[0]
        : null;
      if (blogRole && blogRole[headlineAttr]) {
        head = blogRole[headlineAttr].title ? blogRole[headlineAttr].title : "";
      }
      if (user && user.communities) {
        let selectedCommunity = user.communities.filter(
          (com) => com.id === defaultCommunity,
        );
        if (selectedCommunity.length > 0) {
          if (
            selectedCommunity[0] &&
            selectedCommunity[0].blogs &&
            selectedCommunity[0].blogs.length > 0 &&
            selectedCommunity[0].blogs[0].preferences &&
            selectedCommunity[0].blogs[0].preferences.allowCreateTags == 1
          ) {
            dispatch(setAllowCreateTags(true));
          }
        }
      }

      // handle author default values
      if (user.author) {
        let chainDefaultPreferences = null;
        if (user.author.chains) {
          defaultChains = user.author.chains.map((chain, idx) => {
            if (community && community.value !== chain.organization) {
              return null;
            }
            if (idx === 0 && chain.preferences) {
              chainDefaultPreferences = chain.preferences;
            }
            let avatar = null;
            let avatarUrl = null;
            if (chain.mediaChain) {
              let media = chain.mediaChain.filter(
                (item) =>
                  item.language === selectedLanguage && item?.type === "AVATAR",
              );
              if (media && media.length === 1) {
                avatar = media[0].avatar;
                avatarUrl = media[0].avatarUrl;
              }
            }

            return {
              id: chain.id,
              signature: {
                title: chain.company,
                head: chain.headline,
              },
              company: chain.company,
              head: chain.headline,
              enableAvatar: true,
              avatar: avatarUrl,
              avatarUrl: avatarUrl,
              nameFr: chain.nameFr,
              nameEn: chain.nameEn,
              nameNl: chain.nameNl,
              priority: idx + 1,
              isAvatar: true,
            };
          });
          defaultChains = defaultChains.filter((chain) => chain !== null);
        }
        if (user.author.preferences) {
          if (user.author.preferences.category) {
            setDefaultCategory(user.author.preferences.category);
          } else if (
            chainDefaultPreferences &&
            chainDefaultPreferences.category
          ) {
            setDefaultCategory(chainDefaultPreferences.category);
          }
          if (user.author.preferences.type) {
            setDefaultType(user.author.preferences.type);
          } else if (chainDefaultPreferences && chainDefaultPreferences.type) {
            setDefaultType(chainDefaultPreferences.type);
          }
          if (user.author.preferences.theme) {
            setDefaultTheme(user.author.preferences.theme);
          } else if (chainDefaultPreferences && chainDefaultPreferences.theme) {
            setDefaultTheme(chainDefaultPreferences.theme);
          }
          if (
            user.author.preferences.pages &&
            user.author.preferences.pages.length > 0
          ) {
            setDefaultPages(user.author.preferences.pages);
          } else if (chainDefaultPreferences && chainDefaultPreferences.pages) {
            setDefaultPages(chainDefaultPreferences.pages);
          }
          if (user.author.preferences.scope) {
            handleDefaultScope(user.author.preferences);
          } else if (chainDefaultPreferences && chainDefaultPreferences.scope) {
            handleDefaultScope(chainDefaultPreferences.preferences);
          }
        }
      }
    }
    let author = {
      id: auth.user.id,
      signature: {
        title: authorTitle,
        head: head,
      },
      avatar: auth.user.avatarUrl || null,
      avatarUrl: auth.user.avatarUrl || null,
      enableAvatar: true,
      priority: 0,
      firstName: auth.user.firstName,
      lastName: auth.user.lastName,
      headlines: getAuthorAllHeadlines(auth.user),
      isAuthor: true,
    };
    if (defaultChains.length > 0) {
      dispatch(
        setArticle({ index: "authors", value: [author, ...defaultChains] }),
      );
    } else {
      dispatch(setArticle({ index: "authors", value: [author] }));
      dispatch(setArticle({ index: "notification", value: "INSTANT" }));
    }
  };

  const handleAllowTags = async () => {
    if (defaultCommunity) {
      const userResponse = await getTTPUser({
        ttpApiUrl,
        userId: auth.user.id,
        token: auth.token,
      });
      const user = userResponse.data.data ? userResponse.data.data[0] : null;
      if (user && user.communities) {
        let selectedCommunity = user.communities.filter(
          (com) => com.id === defaultCommunity,
        );
        if (selectedCommunity.length > 0) {
          if (
            selectedCommunity[0] &&
            selectedCommunity[0].blogs &&
            selectedCommunity[0].blogs.length > 0 &&
            selectedCommunity[0].blogs[0].preferences &&
            selectedCommunity[0].blogs[0].preferences.allowCreateTags == 1
          ) {
            dispatch(setAllowCreateTags(true));
          }
        }
      }
    }
  };

  // handle author default values
  useEffect(() => {
    if (categories && defaultCategory) {
      let cat = categories.filter((c) => c.id === defaultCategory);
      if (cat && cat.length === 1) {
        const nameAttr = `name${
          selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
        }`;
        const categoryName =
          cat[0][nameAttr] ||
          cat[0]["nameFr"] ||
          cat[0]["nameEn"] ||
          cat[0]["nameNl"];
        dispatch(
          setArticle({
            index: "category",
            value: { id: cat[0].id, name: categoryName },
          }),
        );
      }
    }
  }, [categories, defaultCategory]);

  useEffect(() => {
    if (types && defaultType) {
      let typ = types.filter((t) => t.id === defaultType);
      if (typ && typ.length === 1) {
        const nameAttr = `name${
          selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
        }`;
        const typeName =
          typ[0][nameAttr] ||
          typ[0]["nameFr"] ||
          typ[0]["nameEn"] ||
          typ[0]["nameNl"];
        dispatch(
          setArticle({
            index: "type",
            value: { id: typ[0].id, name: typeName },
          }),
        );
      }
    }
  }, [types, defaultType]);

  useEffect(() => {
    if (!editArticleId && themes && defaultTheme) {
      let t = themes.filter((c) => c.id === defaultTheme);
      if (t && t.length === 1) {
        const titleAttr = `title${
          selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
        }`;
        const themeTitle =
          t[0][titleAttr] ||
          t[0]["titleFr"] ||
          t[0]["titleEn"] ||
          t[0]["titleNl"];
        dispatch(
          setArticle({
            index: "theme",
            value: { id: t[0].id, title: themeTitle },
          }),
        );
        dispatch(setArticle({ index: "pages", value: [] }));
      }
    }
  }, [themes, defaultTheme]);

  useEffect(() => {
    if (!editArticleId && theme && defaultPages && status !== "PROGRAMMED") {
      themes.map((t) => {
        if (t.id === theme.id) {
          const titleAttr = `title${
            selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
          }`;
          let tab = [];
          t.pages?.forEach((p) => {
            if (defaultPages.includes(p.id)) {
              const pageTitle =
                p[titleAttr] || p["titleFr"] || p["titleEn"] || p["titleNl"];
              tab.push({
                id: p.id,
                title: pageTitle,
              });
            }
          });
          dispatch(setArticle({ index: "pages", value: tab }));
        }
      });
    }
  }, [theme, defaultPages]);

  const handleDeleteAuthor = (author) => {
    let index = -1;
    for (let i = 0; i < authors.length; i++) {
      if (authors[i].id === author.id) {
        index = i;
        break;
      }
    }

    let newAuthors = authors.concat(); // For immutability
    // author.status = "DELETED";
    let newAuthor = Object.assign({}, author, { status: "DELETED" });

    if (index !== -1) {
      newAuthors[index] = newAuthor;
    }

    dispatch(setArticle({ index: "authors", value: newAuthors }));
  };

  const handleChangeAuthor = (newAuthor) => {
    let newAuthors = [...authors];

    let index = -1;
    for (let i = 0; i < newAuthors.length; i++) {
      if (
        newAuthors[i].id === newAuthor.id &&
        newAuthors[i].isAuthor === newAuthor.isAuthor
      ) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      newAuthors.push(newAuthor);
    } else {
      newAuthors[index] = newAuthor;
    }
    dispatch(setArticle({ index: "authors", value: newAuthors }));
  };

  // if (!articleId && auth.user && authors.length === 0) {
  //   handleEmptyAuthors();
  // }

  const getTmpMediasFromRawContent = () => {
    let tmpMedias = [];
    let images = editorRef.current.getImagesInfo();
    for (let i = 0; i < images.length; i++) {
      const mediaUrl = images[i].src;
      if (mediaUrl.indexOf("tmp-media-article") !== -1) {
        const urlParts = mediaUrl.split("/");
        if (urlParts.length > 0) {
          tmpMedias.push(urlParts[urlParts.length - 1]);
        }
      }
    }

    return tmpMedias;
  };

  const validate = () => {
    let errors = [];

    if (title.trim().length < 3) {
      errors.push(_("article.validate_title"));
    }

    if (!category) {
      errors.push(_("article.validate_category"));
    }

    if (!theme) {
      errors.push(_("article.validate_theme"));
    }

    if (!type) {
      errors.push(_("article.validate_type"));
    }

    if (!community) {
      errors.push(_("article.validate_community"));
    }

    if (content.trim().length === 0) {
      errors.push(_("article.validate_content"));
    }

    if (!tags || tags.length < 2) {
      errors.push(_("article.validate_tags"));
    }

    if (tags.length >= 2) {
      let emptyTagName = false;
      tags.forEach((tag) => {
        if (tag.name?.length === 0) {
          emptyTagName = true;
        }
      });
      if (emptyTagName) {
        errors.push(_("article.validate_tag_name"));
      }
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

    if (isPrivate && privateGroups.length === 0) {
      errors.push(_("article.validate_private_groups"));
    }

    if (notificationToSentAt.trim() !== "") {
      if (
        notificationToSentAt.indexOf("_") !== -1 ||
        !moment(notificationToSentAt, [DATE_FORMAT]).isValid()
      ) {
        errors.push(_("article.validate_notification_date"));
      } else {
        if (
          ["SCHEDULED", "PUBLISHED"].includes(status) &&
          notification === "SCHEDULED"
        ) {
          var notifTime = moment.utc(notificationToSentAt, DATE_FORMAT);
          var articleTime = moment.utc(publishedAt, DATE_FORMAT);
          if (!notifTime.isAfter(articleTime)) {
            errors.push(_("article.validate_notification_after_date"));
          }
        }
      }
    }

    return errors;
  };

  const resetAfterSave = (data) => {
    if (props.selectArticles) {
      props.selectArticles([data]);
    }
    dispatch(resetArticle());
    dispatch(setAllowFetchTags(true));
    setContent("");
    setInitialContent("");
    setYHeight(0);
    setHandleCropping(1);
    setCoverFile(null);
    setCoverButtons("ICONS");
    setImageHasChanged(false);
  };

  const handleSaveRelated = (data) => {
    // const tab = Object.values(relatedArticles);
    //   tab.forEach(async (translateArticle, idx) => {
    return new Promise(function (resolve, reject) {
      let tab = [];
      for (var key in relatedArticles) {
        tab.push({ key, translateArticle: relatedArticles[key] });
      }
      tab.forEach(async (item, idx) => {
        try {
          let userIds = [];
          authors.forEach((user) => {
            const result =
              user.isAuthor === true &&
              user.enableAvatar != "D" &&
              userIds.indexOf(user.id) === -1;
            if (result) {
              userIds.push(user.id);
            }
          });
          let users = {};
          if (userIds.length > 0) {
            const resp = await getBlogRole({
              ttpApiUrl,
              token: data.token,
              userIds,
              communityId: data.communityId,
            });

            resp.data.data.forEach((row) => {
              users[row.userId] = getAuthorHeadlines(row, item.key);
            });
          }

          const response = await saveQuickArticle({
            ttpApiUrl,
            token: data.token,
            id: item.translateArticle.id,
            categoryId: data.categoryId,
            typeId: data.typeId,
            tags: data.tags,
            publishedAt: data.publishedAt,
            themeId: data.themeId,
            pages: data.pages,
            authors: data.authors,
            authorsRoles: users,
            communityId: data.communityId,
          });
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    });
  };

  const save = async (hasShowSocialStep) => {
    let errors = validate();

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
      toast.error(<ErrorsContainer errors={errors} />, { autoClose: true });
      return;
    }

    const tmpImages = getTmpMediasFromRawContent();
    const tmpAttachments = attachments.filter((a) => a.isTmp && !a.inHistory);
    const tmpMedias = tmpImages.concat(tmpAttachments);

    const formatedTags = [];
    const nameAttr = `name${
      props.language.charAt(0).toUpperCase() + props.language.slice(1)
    }`;
    tags.forEach((tag) => {
      if (tag["__isNew__"]) {
        let newTag = {};
        newTag[nameAttr] = tag.value;
        formatedTags.push(newTag);
      } else {
        formatedTags.push({ id: tag.value });
      }
    });

    let groups = selectedGroups?.map((item) => {
      return item.id;
    });

    let tabPrivateGroups = privateGroups.map((item) => {
      return item.id;
    });

    const isRecurrent = recurrence ? true : false;
    let fffLib = fffLibrary ? fffLibrary : isfffLibrary ? "PROPOSED" : "";
    if (!scope.includes("PUBLIC")) {
      fffLib = "";
    }

    let data = {
      title,
      content,
      tmpMedias,
      categoryId: category.id,
      themeId: theme.id,
      typeId: type ? type.id : null,
      communityId: community.value,
      language: selectedLanguage,
      csScope: scope,
      groups,
      specCollaborators:
        specCollaborators.length > 0
          ? specCollaborators.map((el) => el.id)
          : [],
      specClients: specClients.length > 0 ? specClients.map((el) => el.id) : [],
      specContacts:
        specContacts.length > 0 ? specContacts.map((el) => el.id) : [],
      tags: formatedTags,
      pages,
      coverFile: translateLanguage || isCloning ? null : coverFile,
      authors,
      attachments,
      status,
      publishedAt: publishedAt
        ? convertDateToUTC(publishedAt, DATE_FORMAT, API_DATE_FORMAT)
        : "",
      yPos: parseFloat(ref.current.yPos),
      yHeight,
      handleCropping,
      comment,
      isPrivate,
      isFromAi,
      privateGroups: tabPrivateGroups,
      publishOnWorkflow,
      mediaIsAlbum,
      mediaMedia,
      relevance: relevance ? relevance : 3,
      fffLibrary: fffLib,
      canBeShared: canBeShared,
      isRecurrent,
      recurrence,
    };

    if (!editArticleId && auth.user) {
      data.creator = auth.user.id;
    }

    if (["SCHEDULED", "PUBLISHED"].includes(status)) {
      data.notification = notification;
      if (notification === "INSTANT") {
        data.notificationToSentAt = convertDateToUTC(
          publishedAt,
          DATE_FORMAT,
          API_DATE_FORMAT,
        );
      } else if (notification === "AUTO") {
        data.notificationToSentAt = convertDateToUTC(
          publishedAt,
          DATE_FORMAT,
          API_DATE_FORMAT,
        );
      } else if (notification === "SCHEDULED") {
        data.notificationToSentAt = notificationToSentAt
          ? convertDateToUTC(notificationToSentAt, DATE_FORMAT, API_DATE_FORMAT)
          : "";
      }
    }

    if (isRecurrent) {
      data.recurrentNextDate = findNextDate(
        recurrence,
        publishedAt
          ? convertDateToUTC(publishedAt, DATE_FORMAT, API_DATE_FORMAT)
          : "",
      );
    }

    if (
      articleId &&
      articleId === editArticleId &&
      !translateLanguage &&
      !isCloning
    ) {
      data.id = editArticleId;
      // data.deletedMediasIds = this.getDeletedMediasIdsFromRawContent(rawContent);
    }
    if (!imageHasChanged && !translateLanguage && !isCloning) {
      data.mainMediaArticleId = mainMediaArticleId;
    }
    if (translateLanguage) {
      data.relatedArticle = editArticleId;
      if (!imageHasChanged) {
        data.mediaMedia = { id: mainMediaArticleId };
      }
    }
    if (isCloning) {
      data.mediaMedia = { id: mainMediaArticleId };
      data.recurrentParent = articleId;
    }

    dispatch(setIsSaving(true));
    try {
      const response = await saveArticle(ttpApiUrl, auth.token, data);

      if (isCloning) {
        try {
          await saveResetRecurrentArticle(ttpApiUrl, auth.token, {
            isRecurrent: 0,
            id: articleId,
          });
        } catch (e) {}
      }
      if (relatedArticles) {
        try {
          await handleSaveRelated({
            ttpApiUrl,
            token: auth.token,
            categoryId: category.id,
            typeId: type ? type.id : null,
            tags: formatedTags,
            publishedAt: data.publishedAt,
            themeId: theme.id,
            pages,
            authors,
            communityId: community.value,
          });
        } catch (e) {}
      }

      resetAfterSave(response.data.data);

      dispatch(setIsSaving(false));
    } catch (e) {
      console.log(e);

      dispatch(setIsSaving(false));

      if (e.response?.status === 400) {
        // toast.error(_("invalid_credentials"));
        toast.error(e?.response?.data?.detail, { autoClose: true });
      } else {
        if (e?.response?.status >= 500) {
          toast.error(_("server_error"));
        } else {
          toast.error("Erreur");
        }
      }

      /*
      if (payload.statusCode && payload.statusCode === 500) {
        let ErrorsContainer = ({ error }) => (
          <div>
            <span>{_("article.errors") + " :"}</span>
            <ul>{error.detail}</ul>
          </div>
        );
        toast.error(<ErrorsContainer error={payload} />, { autoClose: true });
        return null;
      }*/

      // if (payload.statusCode && payload.statusCode === 400) {
      //   toast.error(payload.title, { autoClose: true });
      // }
    }
  };

  const handleConfigTab = () => {
    setActiveTab("CONFIGURATION");

    if (!editArticleId && allowFetchTags && (articleTitle || content)) {
      const { language } = props;
      dispatch(
        fetchArticleTags({
          language,
          title: articleTitle,
          content: content.replace(/<[^>]+>/g, ""),
        }),
      ).then((resp) => {
        if (resp.payload) {
          const nameAttr = `name${
            language.charAt(0).toUpperCase() + language.slice(1)
          }`;
          const data = resp.payload.data.data;
          if (data) {
            const length = data.length;
            let tags = [];
            let moreTags = [];
            let supertagCount = 0;
            let supertagId = null;
            if (length < 8) {
              tags = data.map((tag) => {
                if (tag.isSuperTag) {
                  supertagCount++;
                  supertagId = tag.id;
                }
                let tmp = {
                  label: tag.isSuperTag ? "⚡︎ " + tag[nameAttr] : tag[nameAttr],
                  name: tag[nameAttr],
                  value: tag.id,
                  tag: {
                    id: tag.id,
                    isSuperTag: tag.isSuperTag,
                    nameFr: tag.nameFr,
                    nameNl: tag.nameNl,
                    nameEn: tag.nameEn,
                  },
                };
                if (!tag.isSuperTag && !tag.superTag) {
                  tmp.color = "#acd4f9";
                }
                let emptyTagName = false;
                if (
                  tag.nameFr?.length === 0 ||
                  tag.nameNl?.length === 0 ||
                  tag.nameEn?.length === 0
                ) {
                  emptyTagName = true;
                }

                if (emptyTagName) {
                  tmp.color = "#fed493";
                }

                return tmp;
              });
            } else {
              for (let i = 0; i < 7; i++) {
                if (data[i].isSuperTag) {
                  supertagCount++;
                  supertagId = data[i].id;
                }
                let tmp = {
                  label: data[i].isSuperTag
                    ? "⚡︎ " + data[i][nameAttr]
                    : data[i][nameAttr],
                  name: data[i][nameAttr],
                  value: data[i].id,
                  tag: {
                    id: data[i].id,
                    isSuperTag: data[i].isSuperTag,
                    nameFr: data[i].nameFr,
                    nameNl: data[i].nameNl,
                    nameEn: data[i].nameEn,
                  },
                };
                if (!data[i].isSuperTag && !data[i].superTag) {
                  tmp.color = "#acd4f9";
                }
                let emptyTagName = false;
                if (
                  data[i].nameFr?.length === 0 ||
                  data[i].nameNl?.length === 0 ||
                  data[i].nameEn?.length === 0
                ) {
                  emptyTagName = true;
                }

                if (emptyTagName) {
                  tmp.color = "#fed493";
                }
                tags.push(tmp);
              }
              for (let i = 7; i < length; i++) {
                let tmp = {
                  label: data[i].isSuperTag
                    ? "⚡︎ " + data[i][nameAttr]
                    : data[i][nameAttr],
                  name: data[i][nameAttr],
                  value: data[i].id,
                  tag: {
                    id: data[i].id,
                    isSuperTag: data[i].isSuperTag,
                    nameFr: data[i].nameFr,
                    nameNl: data[i].nameNl,
                    nameEn: data[i].nameEn,
                  },
                };
                if (!data[i].isSuperTag && !data[i].superTag) {
                  tmp.color = "#acd4f9";
                }
                let emptyTagName = false;
                if (
                  data[i].nameFr?.length === 0 ||
                  data[i].nameNl?.length === 0 ||
                  data[i].nameEn?.length === 0
                ) {
                  emptyTagName = true;
                }

                if (emptyTagName) {
                  tmp.color = "#fed493";
                }

                moreTags.push(tmp);
              }
            }
            dispatch(
              setArticle({
                index: "tags",
                value: tags,
              }),
            );
            dispatch(setArticleTags(moreTags));
            if (supertagCount === 1) {
              dispatch(fetchSuperTagTheme({ tagId: 6616 }));
            }
          }
        }
      });
    }
  };

  const handleCloseModal = () => {
    dispatch(toggleArticleModal());
    dispatch(resetArticle());
    dispatch(setAllowFetchTags(true));
    setContent("");
    setInitialContent("");
    setYHeight(0);
    setHandleCropping(1);
    setCoverFile(null);
    setCoverButtons("ICONS");
    setImageHasChanged(false);
    // handleEmptyAuthors();
    setActiveTab("EDITOR");
  };

  const handleSetYPos = (pos) => {
    ref.current.yPos = pos;
  };

  const closeSocialModal = () => {
    setFetchingShareUser(true);
    handleShowSocialStep();
  };

  const handleOpeningHome = () => {
    setOpeningHome(true);
    window.open(`${TTP_HOME_URL}/profile#networks`, "_blank").focus();
  };

  const handleShowSocialStep = () => {
    getTTPUser({
      ttpApiUrl,
      userId: auth.user.id,
      token: auth.token,
    }).then((resp) => {
      dispatch(setAuthUser(resp.data.data[0]));
      setFetchingShareUser(false);
      setShowUpdateSocialModal(false);
      setShareStep(true);
      document.getElementById("ttp-widget-article").scrollTo(0, 0);
    });
    getHistoryData();
  };

  const getHistoryData = () => {
    const organizationId = community ? community.value : 0;
    getSharingHistory(auth.token, organizationId)
      .then((resp) => {
        setShareHistoryData(resp.data.data ? resp.data.data : []);
      })
      .catch((e) => {
        setShareHistoryData([]);
      });
  };

  const cancelShare = () => {
    if (props.selectArticles) {
      props.selectArticles([tamtamItArticle]);
    }
    handleCloseModal();
    setShareStep(false);
    setOpeningHome(false);
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={openedModal}
      onRequestClose={handleCloseModal}
      className={{
        base: styles.modalContent,
        afterOpen: styles.modalContentAfterOpen,
        beforeClose: styles.modalContentBeforeClose,
      }}
      overlayClassName={{
        base: styles.modalOverlay,
        afterOpen: styles.modalOverlayAfterOpen,
        beforeClose: styles.modalOverlayBeforeClose,
      }}
      closeTimeoutMS={300}
      contentLabel={_("article.add_article")}
    >
      <div className={styles.modal}>
        <div className={styles.close} onClick={handleCloseModal}>
          <IconClose size={17} />
        </div>
        <div id="ttp-widget-article" className={styles.body}>
          <div
            style={{
              position: "fixed",
              bottom: "70px",
              right: "20px",
              zIndex: "99999",
            }}
          >
            <NacnWidget
              appTarget="ARTICLE"
              onPost={(e) => {
                console.log(e);
                if (e?.type === "ARTICLE_DATA") {
                  console.log("=====", e.data.content);
                  setNewContent(e.data.content);
                } else if (e?.type === "PICTURE_MEDIA") {
                  setYHeight(0);
                  setHandleCropping(1);
                  setCoverFile(null);
                  setCoverButtons("ICONS");
                  setImageHasChanged(false);
                  dispatch(setMediaMedia(e.data.content));
                }
              }}
              token={auth.token}
              apiUrl={ttpApiUrl}
              aiUrl={ttpAiUrl}
              blogSearchUrl="https://seo.tamtam.pro/blog/_msearch"
              lng={props.language}
              organizationId={community ? community.value : 9}
            />
          </div>
          <div className={styles.title}>{_("article.write_article")}</div>
          <p className={styles.subtitle}>{_("article.write_subtitle")}</p>

          <ul className={styles.tabs}>
            <li
              className={activeTab === "EDITOR" ? styles.activated : ""}
              onClick={() => setActiveTab("EDITOR")}
            >
              {_("article.tab_EDITOR")}
            </li>
            <li
              className={activeTab === "CONFIGURATION" ? styles.activated : ""}
              onClick={() => handleConfigTab()}
            >
              {_("article.tab_CONFIGURATION")}
            </li>
          </ul>

          {editLoading && (
            <div>
              <Skeleton height={400} />
              <div
                style={{
                  marginTop: "30px",
                  borderBottom: "1px solid rgba(109, 127, 146, 0.3)",
                  paddingBottom: "10px",
                }}
              >
                <Skeleton height={40} />
              </div>
            </div>
          )}

          {!editLoading && !shareStep && (
            <>
              <EditorTab
                activeTab={activeTab}
                editorRef={editorRef}
                content={content}
                setContent={setContent}
                initialContent={initialContent}
                setInitialContent={setInitialContent}
                language={props.language}
                coverButtons={coverButtons}
                setCoverButtons={setCoverButtons}
                setHandleCropping={setHandleCropping}
                coverFile={coverFile}
                setCoverFile={setCoverFile}
                setImageHasChanged={setImageHasChanged}
                mediaMedia={mediaMedia}
                mediaIsAlbum={mediaIsAlbum}
                yPos={ref.current.yPos}
                setYPos={handleSetYPos}
                setYHeight={setYHeight}
                mainMedia={editMainMedia}
                handleAttachmentsChange={handleAttachmentsChange}
                newContent={newContent}
                setNewContent={setNewContent}
              />

              <ArticleConfiguration
                activeTab={activeTab}
                community={community}
                selectedLanguage={selectedLanguage}
                // setSelectedLanguage={setSelectedLanguage}
                content={content}
                language={props.language}
                onChangeAuthor={handleChangeAuthor}
                onDeleteAuthor={handleDeleteAuthor}
                attachments={attachments}
                uploadingAttachment={uploadingAttachment}
                handleAttachmentsChange={handleAttachmentsChange}
                handleDeleteAttachment={handleDeleteAttachment}
                handleEditAttachment={handleEditAttachment}
                articleSharingOptions={props.articleSharingOptions || []}
              />

              <Controls
                progressMessage={_("Creating in progress...")}
                successMessage={_("Created successfully!")}
                onCancel={() => handleCloseModal()}
                action={(hasShowSocialStep) => save(hasShowSocialStep)}
              />
            </>
          )}
          {/* {shareStep && (
            <SocialNetworksShare
              handleFormCancel={cancelShare}
              historyData={shareHistoryData}
            />
          )} */}
        </div>
      </div>
      <AntModal
        closable={false}
        open={showUpdateSocialModal}
        maskClosable={false}
        width="50vw"
        height="50vh"
        footer={null}
        onCancel={closeSocialModal}
        destroyOnHidden={true}
        zIndex="9999"
        styles={{ body: { padding: "0" } }}
      >
        <div className={homeStyles.modal_header}>
          {_("article.social_network")}
        </div>
        <div className={homeStyles.modal_close} onClick={closeSocialModal}>
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
              onClick={handleOpeningHome}
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
            <Button onClick={closeSocialModal} variant="primary">
              {_("article.continue")}
            </Button>
          )}
        </div>
      </AntModal>
    </Modal>
  );
}
