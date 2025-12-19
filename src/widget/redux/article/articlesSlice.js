import { createSlice } from "@reduxjs/toolkit";
import {
  fetchArticle,
  fetchTranslateArticle,
  fetchTranslateArticleNoContent,
  fetchGeneratedArticle,
  fetchTitleIA,
  fetchSuperTagTheme,
} from "./articlesThunk";
import moment from "moment";

import { convertDateFromUTC, getTagName } from "../../services/utils";

const DATE_FORMAT = "DD-MM-YYYY HH:mm";
const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

const initialState = {
  openedModal: false,
  mediaMedia: null,
  mediaIsAlbum: false,
  isSaving: false,
  isSavingShare: false,
  fetching: false,
  items: [],
  error: null,
  tagNames: {},
  allowCreateTags: false,
  translateLanguage: null,
  isCloning: false,
  article: {
    id: null,
    main_media: null,
    mainMediaArticleId: null,
    title: "",
    contentState: null,
    content: "",
    category: null,
    community: null,
    type: null,
    theme: null,
    pages: [],
    selectedLanguage: null,
    scope: ["PUBLIC"],
    groups: [],
    specCollaborators: [],
    specClients: [],
    specContacts: [],
    authors: [],
    comment: "",
    isPrivate: false,
    privateGroups: [],
    status: "DRAFT",
    publishedAt: moment().format(DATE_FORMAT),
    publishOnWorkflow: false,
    attachments: [],
    uploadingAttachment: false,
    tags: [],
    relevance: 3,
    externalUrl: "",
    relatedArticles: null,
    fffLibrary: "",
    isfffLibrary: false,
    canBeShared: false,
    isRecurrent: false,
    recurrence: null,
    recurrentNextDate: null,
    notification: "NOT_NOTIFY",
    notificationHour: 1,
    notificationToSentAt: moment().format(DATE_FORMAT),
    notificationStored: "",
  },
};

export const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setMediaMedia: (state, { payload }) => {
      state.mediaMedia = payload;
    },
    setIsSaving: (state, { payload }) => {
      state.isSaving = payload;
    },
    setIsSavingShare: (state, { payload }) => {
      state.isSavingShare = payload;
    },
    toggleArticleModal: (state) => {
      state.openedModal = !state.openedModal;
    },
    resetArticle: (state) => {
      return {
        ...initialState,
      };
    },
    setArticle: (state, { payload }) => {
      state.article[payload.index] = payload.value;
    },
    setTranslateLanguage: (state, { payload }) => {
      state.translateLanguage = payload;
    },
    setIsCloning: (state, { payload }) => {
      state.isCloning = payload;
    },
    setAllowCreateTags: (state, { payload }) => {
      state.allowCreateTags = payload;
    },
    changeTagsLanguage: (state, { payload }) => {
      if (state.article.tags.length > 0) {
        const nameAttr = `name${
          payload.charAt(0).toUpperCase() + payload.slice(1)
        }`;
        state.article.tags = state.article.tags.map((tag) => {
          if (tag?.tag[nameAttr]) {
            return {
              ...tag,
              label: tag.tag.isSuperTag
                ? "⚡︎ " + tag.tag[nameAttr]
                : tag.tag[nameAttr],
              name: tag.tag[nameAttr],
            };
          }
          return tag;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchArticle.pending, (state, action) => {
      state.fetching = true;
      state.tagNames = {};
    });
    builder.addCase(fetchArticle.fulfilled, (state, action) => {
      state.fetching = false;
      const article = action.payload.data.data[0];
      state.article.id = article.id;
      state.article.title = article.title;
      state.article.contentState = article.contentState;
      state.article.content = article.content;
      state.article.main_media = article.main_media;
      state.article.mainMediaArticleId = article.main_media
        ? article.main_media.id
        : null;
      state.article.relevance = article.relevance;
      state.article.externalUrl = article.externalUrl;
      state.article.relatedArticles = article.relatedArticles;

      if (article.organization && article.organization.id && article.language) {
        state.article.community = {
          value: article.organization.id,
          label: article.organization.name,
        };
      }
      const nameAttr = `name${
        article.language.charAt(0).toUpperCase() + article.language.slice(1)
      }`;
      const categoryName =
        article.category[nameAttr] ||
        article.category["nameFr"] ||
        article.category["nameEn"] ||
        article.category["nameNl"];
      state.article.category = {
        id: article.category.id,
        name: categoryName,
      };
      state.article.selectedLanguage = article.language;
      state.article.scope = article.csScope;
      if (article.groups) {
        state.article.groups = article.groups;
      }
      if (article.specCollaborators) {
        state.article.specCollaborators = article.specCollaborators;
      }
      if (article.specClients) {
        state.article.specClients = article.specClients;
      }
      if (article.specContacts) {
        state.article.specContacts = article.specContacts;
      }

      if (article.type) {
        const typeName =
          article.type[nameAttr] ||
          article.type["nameFr"] ||
          article.type["nameEn"] ||
          article.type["nameNl"];
        state.article.type = {
          id: article.type.id,
          name: typeName,
        };
      } else {
        state.article.type = {
          id: null,
          name: "",
        };
      }

      const titleAttr = `title${
        article.language.charAt(0).toUpperCase() + article.language.slice(1)
      }`;
      if (article.theme) {
        const themeTitle =
          article.theme[titleAttr] ||
          article.theme["titleFr"] ||
          article.theme["titleEn"] ||
          article.theme["titleNl"];
        state.article.theme = {
          id: article.theme.id,
          title: themeTitle,
        };
      }
      if (article.pages && article.pages.length > 0) {
        state.article.pages = article.pages.map((page) => {
          const pageTitle =
            page[titleAttr] ||
            page["titleFr"] ||
            page["titleEn"] ||
            page["titleNl"];
          return {
            id: page.id,
            title: pageTitle,
          };
        });
      } else {
        state.article.pages = [];
      }

      state.article.publishOnWorkflow = article.publishOnWorkflow;

      let sortedAuthors = article.author
        ? article.author.sort((a, b) => a.priority - b.priority)
        : [];
      let avatars = article.chains
        ? article.chains.map((chain) => {
            let avatar = null;
            let avatarUrl = null;
            if (chain.mediaChain) {
              let media = chain.mediaChain.filter(
                (item) =>
                  item.language === article.language && item?.type === "AVATAR"
              );
              if (media && media.length === 1) {
                avatar = media[0].avatar;
                avatarUrl = media[0].avatarUrl;
              }
            }
            return {
              ...chain,
              avatar: avatarUrl,
              avatarUrl: avatarUrl,
              enableAvatar: true,
            };
          })
        : [];
      sortedAuthors = sortedAuthors.map((author) => {
        return { ...author, isAuthor: true };
      });
      sortedAuthors = [...sortedAuthors, ...avatars];
      state.article.authors = sortedAuthors;
      state.article.status = article.status;
      state.article.publishedAt = article.publishedAt
        ? convertDateFromUTC(article.publishedAt, API_DATE_FORMAT, DATE_FORMAT)
        : "";
      if (article.mobileNotification) {
        state.article.notification = article.mobileNotification.type;
        state.article.notificationStored = article.mobileNotification;
        if (article.mobileNotification.toSentAt) {
          state.article.notificationStored.toSentAt = convertDateFromUTC(
            article.mobileNotification.toSentAt,
            API_DATE_FORMAT,
            DATE_FORMAT
          );
        }
      }
      state.article.isPrivate = article.isPrivate;
      if (article.privateGroups) {
        state.article.privateGroups = article.privateGroups;
      }
      state.article.comment = article.comment || "";

      if (article.tags.length > 0) {
        state.article.tags = article.tags.map((tag) => {
          state.tagNames[tag.id] = {
            en: tag.nameEn,
            fr: tag.nameFr,
            nl: tag.nameNl,
          };
          let tab = {
            label: tag[nameAttr],
            name: tag[nameAttr],
            value: tag.id,
            tag: {
              id: tag.id,
              nameEn: tag.nameEn,
              nameFr: tag.nameFr,
              nameNl: tag.nameNl,
            },
          };

          let emptyTagName = false;
          if (
            tag.nameFr?.length === 0 ||
            tag.nameNl?.length === 0 ||
            tag.nameEn?.length === 0
          ) {
            emptyTagName = true;
          }

          if (emptyTagName) {
            tab.color = "#fed493";
          }
          return tab;
        });

        state.article.fffLibrary = article?.fffLibrary;
        if (
          article?.fffLibrary === "PROPOSED" ||
          article?.fffLibrary === "ACCEPTED"
        ) {
          state.article.isfffLibrary = true;
        }
        if (article.canBeShared) {
          state.article.canBeShared = true;
        }
        if (article.isRecurrent) {
          state.article.isRecurrent = true;
        }
        if (article.isRecurrent && article?.recurrence) {
          state.article.recurrence = article.recurrence;
        }
        if (article?.recurrentNextDate) {
          state.article.recurrentNextDate = article.recurrentNextDate;
        }
      }

      let mediaArticles = article.media_articles || [];
      let attachments = mediaArticles.filter(
        (m) => m.isAttachment && !m.inHistory
      );
      state.article.attachments = attachments;
      state.error = null;
    });
    builder.addCase(fetchArticle.rejected, (state, action) => {
      state.fetching = false;
      state.error = action.payload;
    });

    builder.addCase(fetchTranslateArticle.pending, (state, action) => {
      state.fetching = true;
      state.tagNames = {};
    });
    builder.addCase(fetchTranslateArticle.fulfilled, (state, action) => {
      state.fetching = false;
      const article = action.payload.data.data[0];
      const translateContent = article.content.split("~~~~");
      state.article.id = article.id;
      state.article.title = translateContent[0];
      state.article.contentState = article.contentState;
      state.article.content = translateContent[1];
      state.article.main_media = article.main_media;
      state.article.mainMediaArticleId = article.main_media
        ? article.main_media.id
        : null;

      if (article.organization && article.organization.id && article.language) {
        state.article.community = {
          value: article.organization.id,
          label: article.organization.name,
        };
      }
      const nameAttr = `name${
        state.translateLanguage.charAt(0).toUpperCase() +
        state.translateLanguage.slice(1)
      }`;
      const categoryName =
        article.category[nameAttr] ||
        article.category["nameFr"] ||
        article.category["nameEn"] ||
        article.category["nameNl"];
      state.article.category = {
        id: article.category.id,
        name: categoryName,
      };
      if (article.type) {
        const typeName =
          article.type[nameAttr] ||
          article.type["nameFr"] ||
          article.type["nameEn"] ||
          article.type["nameNl"];
        state.article.type = {
          id: article.type.id,
          name: typeName,
        };
      } else {
        state.article.type = {
          id: null,
          name: "",
        };
      }

      const titleAttr = `title${
        state.translateLanguage.charAt(0).toUpperCase() +
        state.translateLanguage.slice(1)
      }`;
      if (article.theme) {
        const themeTitle =
          article.theme[titleAttr] ||
          article.theme["titleFr"] ||
          article.theme["titleEn"] ||
          article.theme["titleNl"];
        state.article.theme = {
          id: article.theme.id,
          title: themeTitle,
        };
      }
      if (article.pages && article.pages.length > 0) {
        state.article.pages = article.pages.map((page) => {
          const pageTitle =
            page[titleAttr] ||
            page["titleFr"] ||
            page["titleEn"] ||
            page["titleNl"];
          return {
            id: page.id,
            title: pageTitle,
          };
        });
      }

      state.article.relevance = article.relevance;
      state.article.selectedLanguage = state.translateLanguage;
      state.article.scope = article.csScope;
      if (article.groups) {
        state.article.groups = article.groups;
      }
      if (article.specCollaborators) {
        state.article.specCollaborators = article.specCollaborators;
      }
      if (article.specClients) {
        state.article.specClients = article.specClients;
      }
      if (article.specContacts) {
        state.article.specContacts = article.specContacts;
      }
      state.article.publishOnWorkflow = article.publishOnWorkflow;

      // let sortedAuthors = article.author
      //   ? article.author.sort((a, b) => a.priority - b.priority)
      //   : [];
      // let avatars = article.avatars
      //   ? article.avatars.map((avatar) => {
      //       return { ...avatar, enableAvatar: 1 };
      //     })
      //   : [];
      // sortedAuthors = sortedAuthors.map((author) => {
      //   return { ...author, isAuthor: true };
      // });
      // sortedAuthors = [...sortedAuthors, ...avatars];
      // state.article.authors = sortedAuthors;
      let sortedAuthors = article.author
        ? article.author.sort((a, b) => a.priority - b.priority)
        : [];
      let avatars = article.chains
        ? article.chains.map((chain) => {
            let avatar = null;
            let avatarUrl = null;
            if (chain.mediaChain) {
              let media = chain.mediaChain.filter(
                (item) =>
                  item.language === state.translateLanguage &&
                  item?.type === "AVATAR"
              );
              if (media && media.length === 1) {
                avatar = media[0].avatar;
                avatarUrl = media[0].avatarUrl;
              }
            }
            return {
              ...chain,
              avatar: avatarUrl,
              avatarUrl: avatarUrl,
              enableAvatar: true,
            };
          })
        : [];
      sortedAuthors = sortedAuthors.map((author) => {
        return { ...author, isAuthor: true };
      });
      sortedAuthors = [...sortedAuthors, ...avatars];
      state.article.authors = sortedAuthors;

      state.article.status = article.status;
      state.article.publishedAt = article.publishedAt
        ? convertDateFromUTC(article.publishedAt, API_DATE_FORMAT, DATE_FORMAT)
        : "";
      state.article.isPrivate = article.isPrivate;
      if (article.privateGroups) {
        state.article.privateGroups = article.privateGroups;
      }
      state.article.comment = article.comment || "";

      if (article.tags.length > 0) {
        state.article.tags = article.tags.map((tag) => {
          state.tagNames[tag.id] = {
            en: tag.nameEn,
            fr: tag.nameFr,
            nl: tag.nameNl,
          };
          let tagName = tag[nameAttr];
          if (!tagName || tagName.trim() === "") {
            tagName = getTagName(tag, nameAttr);
          }
          let tab = {
            label: tagName,
            name: tag[nameAttr],
            value: tag.id,
            tag: {
              id: tag.id,
              nameEn: tag.nameEn,
              nameFr: tag.nameFr,
              nameNl: tag.nameNl,
            },
          };

          let emptyTagName = false;
          if (
            tag.nameFr?.length === 0 ||
            tag.nameNl?.length === 0 ||
            tag.nameEn?.length === 0
          ) {
            emptyTagName = true;
          }

          if (emptyTagName) {
            tab.color = "#fed493";
          }

          return tab;
        });
      }

      let mediaArticles = article.media_articles || [];
      let attachments = mediaArticles.filter(
        (m) => m.isAttachment && !m.inHistory
      );
      state.article.attachments = attachments;
      state.error = null;
    });
    builder.addCase(fetchTranslateArticle.rejected, (state, action) => {
      state.fetching = false;
      state.error = action.payload;
    });

    builder.addCase(fetchTitleIA.pending, (state, action) => {
      state.fetching = false;
      state.tagNames = {};
    });
    builder.addCase(fetchTitleIA.fulfilled, (state, action) => {
      state.fetching = false;
      state.article.originalTitle = action.payload.data.originalTitle;
      state.article.attractiveTitle = action.payload.data.attractiveTitle;
    });

    builder.addCase(fetchGeneratedArticle.fulfilled, (state, action) => {
      state.fetching = false;
      const article = action.payload.data.data;
      state.article.title = article.title;
      state.article.content = article.content;
    });

    // translate article without content
    builder.addCase(fetchTranslateArticleNoContent.pending, (state, action) => {
      state.fetching = true;
      state.tagNames = {};
    });
    builder.addCase(
      fetchTranslateArticleNoContent.fulfilled,
      (state, action) => {
        state.fetching = false;
        const article = action.payload.data.data[0];
        state.article.id = article.id;
        state.article.main_media = article.main_media;
        state.article.mainMediaArticleId = article.main_media
          ? article.main_media.id
          : null;

        if (
          article.organization &&
          article.organization.id &&
          article.language
        ) {
          state.article.community = {
            value: article.organization.id,
            label: article.organization.name,
          };
        }
        const nameAttr = `name${
          state.translateLanguage.charAt(0).toUpperCase() +
          state.translateLanguage.slice(1)
        }`;
        const categoryName =
          article.category[nameAttr] ||
          article.category["nameFr"] ||
          article.category["nameEn"] ||
          article.category["nameNl"];
        state.article.category = {
          id: article.category.id,
          name: categoryName,
        };
        if (article.type) {
          const typeName =
            article.type[nameAttr] ||
            article.type["nameFr"] ||
            article.type["nameEn"] ||
            article.type["nameNl"];
          state.article.type = {
            id: article.type.id,
            name: typeName,
          };
        } else {
          state.article.type = {
            id: null,
            name: "",
          };
        }

        const titleAttr = `title${
          state.translateLanguage.charAt(0).toUpperCase() +
          state.translateLanguage.slice(1)
        }`;
        if (article.theme) {
          const themeTitle =
            article.theme[titleAttr] ||
            article.theme["titleFr"] ||
            article.theme["titleEn"] ||
            article.theme["titleNl"];
          state.article.theme = {
            id: article.theme.id,
            title: themeTitle,
          };
        }
        if (article.pages && article.pages.length > 0) {
          state.article.pages = article.pages.map((page) => {
            const pageTitle =
              page[titleAttr] ||
              page["titleFr"] ||
              page["titleEn"] ||
              page["titleNl"];
            return {
              id: page.id,
              title: pageTitle,
            };
          });
        }

        state.article.relevance = article.relevance;
        state.article.selectedLanguage = state.translateLanguage;
        state.article.scope = article.csScope;
        if (article.groups) {
          state.article.groups = article.groups;
        }
        if (article.specCollaborators) {
          state.article.specCollaborators = article.specCollaborators;
        }
        if (article.specClients) {
          state.article.specClients = article.specClients;
        }
        if (article.specContacts) {
          state.article.specContacts = article.specContacts;
        }
        state.article.publishOnWorkflow = article.publishOnWorkflow;

        // let sortedAuthors = article.author
        //   ? article.author.sort((a, b) => a.priority - b.priority)
        //   : [];
        // let avatars = article.avatars
        //   ? article.avatars.map((avatar) => {
        //       return { ...avatar, enableAvatar: 1 };
        //     })
        //   : [];
        // sortedAuthors = sortedAuthors.map((author) => {
        //   return { ...author, isAuthor: true };
        // });
        // sortedAuthors = [...sortedAuthors, ...avatars];
        // state.article.authors = sortedAuthors;
        let sortedAuthors = article.author
          ? article.author.sort((a, b) => a.priority - b.priority)
          : [];
        let avatars = article.chains
          ? article.chains.map((chain) => {
              let avatar = null;
              let avatarUrl = null;
              if (chain.mediaChain) {
                let media = chain.mediaChain.filter(
                  (item) =>
                    item.language === state.translateLanguage &&
                    item?.type === "AVATAR"
                );
                if (media && media.length === 1) {
                  avatar = media[0].avatar;
                  avatarUrl = media[0].avatarUrl;
                }
              }
              return {
                ...chain,
                avatar: avatarUrl,
                avatarUrl: avatarUrl,
                enableAvatar: true,
              };
            })
          : [];
        sortedAuthors = sortedAuthors.map((author) => {
          return { ...author, isAuthor: true };
        });
        sortedAuthors = [...sortedAuthors, ...avatars];
        state.article.authors = sortedAuthors;

        state.article.status = article.status;
        state.article.publishedAt = article.publishedAt
          ? convertDateFromUTC(
              article.publishedAt,
              API_DATE_FORMAT,
              DATE_FORMAT
            )
          : "";
        state.article.isPrivate = article.isPrivate;
        if (article.privateGroups) {
          state.article.privateGroups = article.privateGroups;
        }
        state.article.comment = article.comment || "";

        if (article.tags.length > 0) {
          state.article.tags = article.tags.map((tag) => {
            state.tagNames[tag.id] = {
              en: tag.nameEn,
              fr: tag.nameFr,
              nl: tag.nameNl,
            };
            let tagName = tag[nameAttr];
            if (!tagName || tagName.trim() === "") {
              tagName = getTagName(tag, nameAttr);
            }
            let tab = {
              label: tagName,
              name: tag[nameAttr],
              value: tag.id,
              tag: {
                id: tag.id,
                nameEn: tag.nameEn,
                nameFr: tag.nameFr,
                nameNl: tag.nameNl,
              },
            };

            let emptyTagName = false;
            if (
              tag.nameFr?.length === 0 ||
              tag.nameNl?.length === 0 ||
              tag.nameEn?.length === 0
            ) {
              emptyTagName = true;
            }

            if (emptyTagName) {
              tab.color = "#fed493";
            }

            return tab;
          });
        }

        let mediaArticles = article.media_articles || [];
        let attachments = mediaArticles.filter(
          (m) => m.isAttachment && !m.inHistory
        );
        state.article.attachments = attachments;
        state.error = null;
      }
    );
    builder.addCase(
      fetchTranslateArticleNoContent.rejected,
      (state, action) => {
        state.fetching = false;
        state.error = action.payload;
      }
    );

    builder.addCase(fetchSuperTagTheme.fulfilled, (state, action) => {
      const tag = action.payload.data.data[0];
      const titleAttr = `title${
        state.article.selectedLanguage.charAt(0).toUpperCase() +
        state.article.selectedLanguage.slice(1)
      }`;
      if (tag.theme) {
        const themeTitle =
          tag.theme[titleAttr] ||
          tag.theme["titleFr"] ||
          tag.theme["titleEn"] ||
          tag.theme["titleNl"];
        state.article.theme = {
          id: tag.theme.id,
          title: themeTitle,
        };
      }
      if (tag.pages && tag.pages.length > 0) {
        state.article.pages = tag.pages.map((page) => {
          const pageTitle =
            page[titleAttr] ||
            page["titleFr"] ||
            page["titleEn"] ||
            page["titleNl"];
          return {
            id: page.id,
            title: pageTitle,
          };
        });
      }
    });
  },
});

export const {
  toggleArticleModal,
  setMediaMedia,
  setIsSaving,
  setIsSavingShare,
  resetArticle,
  setArticle,
  setTranslateLanguage,
  changeTagsLanguage,
  setAllowCreateTags,
  setIsCloning,
} = articlesSlice.actions;

export default articlesSlice.reducer;
