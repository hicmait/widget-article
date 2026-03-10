import axios from "axios";

import {
  getWarningHeader,
  trimStr,
  getRequestCancellationToken,
  getRequestConfig,
  generateCancellationTokenSource,
  throwCatchedError,
} from "../services/utils";

let getTagsCTS;
let getAvatarsUsersCTS;
let getCollaboratorsCTS;
let getClientsCTS;
let getContactsCTS;
let getThemesCTS;

export const getCategories = ({
  ttpApiUrl,
  token,
  language = "fr",
  customFilter = null,
}) => {
  const requestUrl = `${ttpApiUrl}/blog/category`;

  let filter = [];

  // filter.push({
  //   property: "language",
  //   value: language,
  //   operator: Array.isArray(language) ? "in" : "like",
  // });

  if (customFilter !== null) {
    if (Array.isArray(customFilter)) {
      filter.push(...customFilter);
    } else {
      filter.push(customFilter);
    }
  }

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      nolimit: 1,
    },
  });
};

export const getTypes = ({ ttpApiUrl, token, language = null }) => {
  const requestUrl = `${ttpApiUrl}/blog/type`;

  /*let filters = [];
  if (language) {
    filters.push({
      property: "language",
      value: language,
      operator: "eq",
    });
  }
  if (communityId) {
    filters.push({
      property: "organization",
      value: communityId,
      operator: "inWithNull",
    });
  }*/

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      //filter: JSON.stringify(filters),
      fields: "*",
    },
  });
};

export const getThemes = ({
  ttpApiUrl,
  token,
  communityId = null,
  customFilter = null,
  sortField = null,
}) => {
  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getThemesCTS,
    cancellationTokenSource,
  );
  getThemesCTS = cancellationTokenSource;

  const requestUrl = `${ttpApiUrl}/blog/theme`;

  let filters = [
    {
      property: "isDefault",
      value: 0,
      operator: "eq",
    },
  ];

  if (customFilter !== null) {
    if (Array.isArray(customFilter)) {
      filters.push(...customFilter);
    } else {
      filters.push(customFilter);
    }
  }

  if (communityId) {
    filters.push({
      property: "organization",
      value: communityId,
      operator: "eq",
    });
  }

  let params = {
    access_token: token,
    filter: JSON.stringify(filters),
    fields: "*,mediaThemes,pages",
    limit: 20,
  };

  if (sortField) {
    params.sort = JSON.stringify([
      {
        property: sortField,
        dir: "asc",
      },
    ]);
  }

  let requestConfig = getRequestConfig(params, requestCancellationToken);
  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const getTheme = ({ ttpApiUrl, token, themeId }) => {
  const filter = [{ property: "id", value: themeId, operator: "eq" }];

  const requestUrl = `${ttpApiUrl}/blog/theme`;

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: "*,mediaThemes,pages",
    },
  });
};

export const getTags = ({
  ttpApiUrl,
  token,
  language = null,
  customFilter = null,
}) => {
  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getTagsCTS,
    cancellationTokenSource,
  );
  getTagsCTS = cancellationTokenSource;

  const requestUrl = `${ttpApiUrl}/blog/tag`;
  let filter = [];

  if (customFilter !== null) {
    if (Array.isArray(customFilter)) {
      filter.push(...customFilter);
    } else {
      filter.push(customFilter);
    }
  }

  let params = {
    access_token: token,
    nolimit: 1,
    fields:
      "id, nameFr, nameEn, nameNl, counter, parent, isSynonym, isSuperTag, superTag",
    filter: JSON.stringify(filter),
    sort: JSON.stringify([
      {
        property: "counter",
        dir: "desc",
      },
    ]),
  };

  let requestConfig = getRequestConfig(params, requestCancellationToken);
  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const getSearchTags = ({
  ttpApiUrl,
  token,
  textFilter,
  lng,
  lngs,
  limit = 50,
}) => {
  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getTagsCTS,
    cancellationTokenSource,
  );
  getTagsCTS = cancellationTokenSource;

  const requestUrl = `${ttpApiUrl}/blog/tag/searchByName`;

  let params = {
    access_token: token,
    start: 0,
    limit,
    fields:
      "id, nameFr, nameEn, nameNl, counter, parent, isSynonym, isSuperTag, superTag",
    // filter: JSON.stringify(filter),
    search: textFilter,
    lng,
    lngs,
  };

  let requestConfig = getRequestConfig(params, requestCancellationToken);
  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const getTag = ({ ttpApiUrl, token, id }) => {
  const requestUrl = `${ttpApiUrl}/blog/tag`;
  let filter = [
    {
      property: "id",
      value: id,
      operator: "eq",
    },
  ];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      fields:
        "id, nameFr, nameEn, nameNl, isSynonym, isSuperTag, themeAndPages,superTag",
      filter: JSON.stringify(filter),
    },
  });
};

export const uploadTmpMedia = ({ ttpApiUrl, token, data }) => {
  const requestUrl = `${ttpApiUrl}/blog/article/upload-tmp-media`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("file", data);

  return axios.post(requestUrl, formData, {
    Warning: "413",
  });
};

export const deleteTmpMedias = (ttpApiUrl, token) => {
  const requestUrl = `${ttpApiUrl}/blog/article/delete-tmp-medias`;

  var formData = new FormData();
  formData.append("access_token", token);

  return axios.post(requestUrl, formData);
};

export const getAvatarsAndAuthors = ({
  ttpApiUrl,
  token,
  word,
  organizationId,
  usersOnly = false,
}) => {
  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getAvatarsUsersCTS,
    cancellationTokenSource,
  );
  getAvatarsUsersCTS = cancellationTokenSource;

  const fields = [
    "*",
    "email",
    "mediaChain",
    "avatar",
    "blogRoleInOrganization",
  ];

  let requestUrl = `${ttpApiUrl}/blog/avatar/avatars-and-authors`;

  let filter = [];

  if (word !== "" && word.length >= 3) {
    filter.push({
      property: "name",
      value: word,
      operator: "like",
    });
  }

  let params = {
    access_token: token,
    filter: JSON.stringify(filter),
    fields: fields.join(","),
    limit: 5,
    start: 0,
    organization_id: organizationId,
  };

  if (usersOnly) {
    params.users_only = 1;
  }

  let requestConfig = getRequestConfig(params, requestCancellationToken);
  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const translateContent = async ({
  token,
  content,
  translateLanguage,
  ttpAiUrl,
}) => {
  const requestUrl = `${ttpAiUrl}/article/translate-article`;

  return axios.post(
    requestUrl,
    JSON.stringify({
      content,
      targetLanguage: translateLanguage,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const GenerateArticleWithAI = ({
  ttpApiUrl,
  token,
  content,
  language = "en", // default to English
}) => {
  const requestUrl = `${ttpApiUrl}/blog/article/generate-article`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("content", content);
  formData.append("language", language);
  return axios.post(requestUrl, formData);
};

export const getTitle = async ({ ttpAiUrl, token, title }) => {
  // const requestUrl = `${ttpApiUrl}/blog/article/generate-title`;

  // var formData = new FormData();
  // formData.append("access_token", token);
  // formData.append("title", title);

  // return axios.post(requestUrl, formData);

  const requestUrl = `${ttpAiUrl}/article/generate-title`;

  return axios.post(
    requestUrl,
    JSON.stringify({
      title,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export const getArticle = ({ ttpApiUrl, token, articleId }) => {
  const filter = [
    { property: "id", value: articleId, operator: "eq" },
    {
      property: "status",
      value: ["DRAFT", "READY", "SCHEDULED", "PUBLISHED", "PROGRAMMED"],
      operator: "in",
    },
  ];

  const fields = [
    "*",
    "content",
    "introduction",
    "author",
    "contactEmail",
    "contactSocialNetworks",
    "main_media",
    "tags",
    "category",
    "organization",
    "media_articles",
    "theme",
    "type",
    "social",
    "image_cropped",
    "contentState",
    "comment",
    "url",
    "isSharedInWorkflow",
    "chains",
    "pages",
    "specCollaborators",
    "specClients",
    "specContacts",
    "relatedArticles",
    "fffLibrary",
    "canBeShared",
    "isRecurrent",
    "recurrence",
    "recurrentNextDate",
    "mobileNotification",
    "aiFrom",
  ];

  const requestUrl = `${ttpApiUrl}/blog/article`;

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
    },
  });
};

export const saveArticle = (ttpApiUrl, token, data) => {
  const requestUrl = `${ttpApiUrl}/blog/article`;

  var formData = new FormData(); //TODO polyfill ?
  formData.append("access_token", token);
  formData.append("title", trimStr(data.title));
  formData.append("content", trimStr(data.content));
  formData.append("contentState", data.contentState);
  formData.append("category", data.categoryId);
  formData.append("theme", data.themeId);
  formData.append("relevance", data.relevance ? data.relevance : 0);
  if (data.creator) {
    formData.append("creator", data.creator);
  }
  if (data.csScope) {
    formData.append("csScope", data.csScope);
  }
  if (data.groups) {
    formData.append("groups", data.groups);
  }
  if (data.typeId) {
    formData.append("type", data.typeId);
  }
  formData.append("specCollaborators", data.specCollaborators.join());
  formData.append("specClients", data.specClients.join());
  formData.append("specContacts", data.specContacts.join());
  formData.append("organization", data.communityId);
  formData.append("language", data.language);
  formData.append("publishedAt", data.publishedAt);
  formData.append("comment", data.comment);
  formData.append("isPrivate", data.isPrivate ? 1 : 0);
  formData.append("fffLibrary", data.fffLibrary);
  formData.append("canBeShared", data.canBeShared ? 1 : 0);

  if (data.aiFrom !== undefined) {
    formData.append("aiFrom", data.aiFrom);
  }

  formData.append("isRecurrent", data.isRecurrent ? 1 : 0);
  formData.append("recurrence", JSON.stringify(data.recurrence));
  formData.append(
    "recurrentNextDate",
    data.recurrentNextDate ? data.recurrentNextDate : "",
  );

  if (data.privateGroups) {
    formData.append("privateGroups", data.privateGroups);
  }
  if (data.notification) {
    formData.append("notification", data.notification);
  }
  if (data.notificationToSentAt) {
    formData.append("notificationToSentAt", data.notificationToSentAt);
  }

  if (data.pages && data.pages.length > 0) {
    for (let i = 0; i < data.pages.length; i++) {
      formData.append(`pages[${i}]`, data.pages[i].id);
    }
  }

  if (data.tmpMedias) {
    data.tmpMedias.forEach((media, i) => {
      if (media) {
        if (typeof media === "string") {
          // Tmp Image
          formData.append(`tmpMedia[${i}]`, media);
        } else {
          // Tmp Attachment
          formData.append(`tmpMedia[${i}][isMain]`, 0);
          formData.append(`tmpMedia[${i}][isAttachment]`, 1);
          formData.append(`tmpMedia[${i}][name]`, media.name);
          formData.append(`tmpMedia[${i}][isTmp]`, 1);
          const urlParts = media.url.split("/");
          if (urlParts.length > 0) {
            formData.append(
              `tmpMedia[${i}][file]`,
              urlParts[urlParts.length - 1],
            );
          }

          let type = "FILE";
          let types = ["image", "video", "audio"];

          for (let i = 0; i < types.length; i++) {
            if (media.type.substr(0, types[i].length) === types[i]) {
              type = types[i].toUpperCase();
              break;
            }
          }
          formData.append(`tmpMedia[${i}][type]`, type);
        }
      }
    });
  }

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach((tag, i) => {
      if (tag.id) {
        formData.append(`tag[${i}][id]`, tag.id);
      } else {
        formData.append(`tag[${i}][nameFr]`, tag["nameFr"] || "");
        formData.append(`tag[${i}][nameEn]`, tag["nameEn"] || "");
        formData.append(`tag[${i}][nameNl]`, tag["nameNl"] || "");
      }
    });
  }

  let mediaArticleIndex = 0;

  if (data.coverFile) {
    formData.append(`mediaArticle[${mediaArticleIndex}][yPos]`, data.yPos);
    formData.append(
      `mediaArticle[${mediaArticleIndex}][yHeight]`,
      data.yHeight,
    );
    formData.append(`handleCropping`, data.handleCropping);

    if (data.coverFile instanceof File) {
      formData.append(`mediaArticle[${mediaArticleIndex}][isMain]`, 1);
      formData.append(
        `mediaArticle[${mediaArticleIndex}][file]`,
        data.coverFile,
      );
      formData.append(
        `mediaArticle[${mediaArticleIndex}][name]`,
        data.coverFile.name,
      );
    } else {
      if (
        data.mainMediaArticleId !== null &&
        undefined !== data.mainMediaArticleId
      ) {
        formData.append(
          `mediaArticle[${mediaArticleIndex}][id]`,
          data.mainMediaArticleId,
        );
      }
    }
    mediaArticleIndex++;
  } else if (data.mediaMedia && data.mediaMedia.id) {
    formData.append("media", data.mediaMedia.id);
  }

  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((attachment) => {
      if (!attachment.isTmp) {
        formData.append(
          `mediaArticle[${mediaArticleIndex}][id]`,
          attachment.id,
        );
        formData.append(
          `mediaArticle[${mediaArticleIndex}][inHistory]`,
          attachment.inHistory ? 1 : 0,
        );
        formData.append(
          `mediaArticle[${mediaArticleIndex}][name]`,
          attachment.name,
        );
        mediaArticleIndex++;
      }
    });
  }

  if (data.deletedMediasIds && data.deletedMediasIds.length > 0) {
    data.deletedMediasIds.forEach((deletedMediaId) => {
      formData.append(`mediaArticle[${mediaArticleIndex}][id]`, deletedMediaId);
      formData.append(`mediaArticle[${mediaArticleIndex}][inHistory]`, 1);
      mediaArticleIndex++;
    });
  }

  if (data.status) {
    formData.append("status", data.status);
  }
  if (data.recurrentParent) {
    formData.append("recurrentParent", data.recurrentParent);
  }
  if (data.authors && data.authors.length > 0) {
    let userIds = [];
    let users = data.authors.filter((user) => {
      const result =
        user.isAuthor === true &&
        user.enableAvatar != "D" &&
        userIds.indexOf(user.id) === -1;
      if (result) {
        userIds.push(user.id);
      }
      return result;
    });

    let chainIds = [];
    let chains = data.authors.filter((user) => {
      const result = !user.isAuthor && chainIds.indexOf(user.id) === -1;
      if (result) {
        chainIds.push(user.id);
      }
      return result;
    });

    if (users && users.length > 0) {
      users.forEach((author, i) => {
        formData.append(
          `articleBlogRole[${i}][signature][title]`,
          author.signature.title,
        );

        if (
          author.signature.head &&
          author.signature.head !== undefined &&
          author.signature.head.trim() !== "undefined"
        ) {
          formData.append(
            `articleBlogRole[${i}][signature][head]`,
            author.signature.head,
          );
        } else {
          formData.append(`articleBlogRole[${i}][signature][head]`, "");
        }

        formData.append(
          `articleBlogRole[${i}][enableAvatar]`,
          author.enableAvatar ? 1 : 0,
        );
        formData.append(`articleBlogRole[${i}][priority]`, i);
        formData.append(`articleBlogRole[${i}][action]`, "WRITE");
        formData.append(`articleBlogRole[${i}][user]`, author.id);
        if (author.status) {
          formData.append(`articleBlogRole[${i}][status]`, author.status);
        }
      });
    }

    if (chains && chains.length > 0) {
      chains.forEach((chain, i) => {
        if (chain.status === "DELETED" && data.id) {
          formData.append(`articleChain[${i}][chain]`, chain.id);
          formData.append(`articleChain[${i}][status]`, chain.status);
          formData.append(`articleChain[${i}][article]`, data.id);
        } else if (chain.status !== "DELETED") {
          formData.append(`articleChain[${i}][chain]`, chain.id);
        }
      });
    }
  }

  if (data.id) {
    formData.append("id", data.id);
    formData.append("changeIntro", data.shouldChangeIntro == true ? 1 : 0);
  }

  if (data.relatedArticle) {
    formData.append("relatedArticle", data.relatedArticle);
  }

  return axios.post(requestUrl, formData, getWarningHeader());
};

export const saveQuickArticle = ({
  ttpApiUrl,
  token,
  id,
  categoryId,
  typeId,
  publishedAt,
  tags,
  themeId,
  pages,
  authors,
  communityId,
  authorsRoles = null,
}) => {
  const requestUrl = `${ttpApiUrl}/blog/article/${id}`;

  let formData = new FormData();
  formData.append("access_token", token);
  formData.append("category", categoryId);
  formData.append("type", typeId);
  formData.append("theme", themeId);

  if (publishedAt) {
    formData.append("publishedAt", publishedAt);
  }

  if (pages && pages.length > 0) {
    for (let i = 0; i < pages.length; i++) {
      formData.append(`pages[${i}]`, pages[i].id);
    }
  }

  if (tags && tags.length > 0) {
    tags.forEach((tag, i) => {
      if (tag.id) {
        formData.append(`tag[${i}][id]`, tag.id);
      } else {
        formData.append(`tag[${i}][nameFr]`, tag["nameFr"] || "");
        formData.append(`tag[${i}][nameEn]`, tag["nameEn"] || "");
        formData.append(`tag[${i}][nameNl]`, tag["nameNl"] || "");
      }
    });
  }

  if (authors && authors.length > 0) {
    formData.append("organization", communityId);

    let userIds = [];
    let users = authors.filter((user) => {
      const result =
        user.isAuthor === true &&
        user.enableAvatar != "D" &&
        userIds.indexOf(user.id) === -1;
      if (result) {
        userIds.push(user.id);
      }
      return result;
    });

    let chainIds = [];
    let chains = authors.filter((user) => {
      const result = !user.isAuthor && chainIds.indexOf(user.id) === -1;
      if (result) {
        chainIds.push(user.id);
      }
      return result;
    });

    if (users && users.length > 0) {
      users.forEach((author, i) => {
        formData.append(
          `articleBlogRole[${i}][signature][title]`,
          author.signature.title,
        );

        if (authorsRoles[author.id]) {
          formData.append(
            `articleBlogRole[${i}][signature][head]`,
            authorsRoles[author.id],
          );
        } else {
          if (
            author.signature.head &&
            author.signature.head !== undefined &&
            author.signature.head.trim() !== "undefined"
          ) {
            formData.append(
              `articleBlogRole[${i}][signature][head]`,
              author.signature.head,
            );
          } else {
            formData.append(`articleBlogRole[${i}][signature][head]`, "");
          }
        }

        formData.append(
          `articleBlogRole[${i}][enableAvatar]`,
          author.enableAvatar ? 1 : 0,
        );
        formData.append(`articleBlogRole[${i}][priority]`, i);
        formData.append(`articleBlogRole[${i}][action]`, "WRITE");
        formData.append(`articleBlogRole[${i}][user]`, author.id);
        if (author.status) {
          formData.append(`articleBlogRole[${i}][status]`, author.status);
        }
      });
    }

    if (chains && chains.length > 0) {
      chains.forEach((chain, i) => {
        if (chain.status === "DELETED" && id) {
          formData.append(`articleChain[${i}][chain]`, chain.id);
          formData.append(`articleChain[${i}][status]`, chain.status);
          formData.append(`articleChain[${i}][article]`, id);
        } else if (chain.status !== "DELETED") {
          formData.append(`articleChain[${i}][chain]`, chain.id);
        }
      });
    }
  }

  return axios.post(requestUrl, formData);
};

export const saveTheme = (ttpApiUrl, token, data) => {
  const requestUrl = `${ttpApiUrl}/blog/theme`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("titleFr", trimStr(data.titleFr));
  formData.append("titleNl", trimStr(data.titleNl));
  formData.append("titleEn", trimStr(data.titleEn));
  formData.append("organization", data.organization);
  formData.append("isDefault", data.isDefault);

  if (data.coverFile) {
    formData.append(`mediaTheme[0][yPos]`, data.yPos);
    if (data.coverFile instanceof File) {
      formData.append(`mediaTheme[0][file]`, data.coverFile);
      formData.append(`mediaTheme[0][name]`, data.coverFile.name);
    }
  }

  if (data.id) {
    formData.append("id", data.id);
  }

  return axios.post(requestUrl, formData, getWarningHeader());
};

export const savePage = (ttpApiUrl, token, data) => {
  const requestUrl = `${ttpApiUrl}/blog/page`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("titleFr", trimStr(data.titleFr));
  formData.append("titleNl", trimStr(data.titleNl));
  formData.append("titleEn", trimStr(data.titleEn));
  formData.append("organization", data.organization);
  formData.append("theme", data.theme);

  if (data.coverFile) {
    formData.append(`mediaPage[0][yPos]`, data.yPos);
    if (data.coverFile instanceof File) {
      formData.append(`mediaPage[0][file]`, data.coverFile);
      formData.append(`mediaPage[0][name]`, data.coverFile.name);
    }
  }

  if (data.id) {
    formData.append("id", data.id);
  }

  return axios.post(requestUrl, formData, getWarningHeader());
};

export const getTagsFromArticle = (ttpApiUrl, token, data) => {
  const requestUrl = `${ttpApiUrl}/blog/article/widget-tags`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("language", data.language);
  formData.append("title", data.title);
  formData.append("content", data.content);

  return axios.post(requestUrl, formData, getWarningHeader());
};

export const getGroups = ({
  ttpApiUrl,
  token,
  clientId = null,
  customFilter = null,
}) => {
  const requestUrl = `${ttpApiUrl}/mailing/group`;
  let filter = [
    {
      property: "client.id",
      value: clientId,
      operator: "eq",
    },
  ];

  if (customFilter !== null && Array.isArray(customFilter)) {
    filter.push(...customFilter);
  }

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      nolimit: 1,
      fields: "id, name",
      filter: JSON.stringify(filter),
    },
  });
};

export const saveTag = (ttpApiUrl, token, data) => {
  const requestUrl = `${ttpApiUrl}/blog/tag`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("nameFr", data.nameFr);
  formData.append("nameNl", data.nameNl);
  formData.append("nameEn", data.nameEn);

  if (data.id) {
    formData.append("id", data.id);
  }

  return axios.post(requestUrl, formData);
};

export const saveSuperTag = (ttpApiUrl, token, data) => {
  const requestUrl = `${ttpApiUrl}/blog/tag`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("id", data.id);
  if (data.superTag) {
    formData.append("superTag", data.superTag);
  }
  if (data.theme) {
    formData.append("theme", data.theme);
  }
  if (data.pages && data.pages.length > 0) {
    for (let i = 0; i < data.pages.length; i++) {
      formData.append(`pages[${i}]`, data.pages[i].id);
    }
  }

  return axios.post(requestUrl, formData);
};

export const getClients = ({ ttpApiUrl, token, search }) => {
  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getClientsCTS,
    cancellationTokenSource,
  );
  getClientsCTS = cancellationTokenSource;

  let requestUrl = `${ttpApiUrl}/organization/folder`;

  let params = {
    access_token: token,
    fields: "id,legalRepresentative",
    start: 0,
    limit: 20,
  };

  if (search) {
    params.filter = JSON.stringify([
      { property: "name", value: search, operator: "like" },
    ]);
  }

  let requestConfig = getRequestConfig(params, requestCancellationToken);
  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const getCollaborators = ({
  ttpApiUrl,
  token,
  search,
  organizationId,
}) => {
  let cancellationTokenSource = generateCancellationTokenSource();
  // getGroupsCTS
  let requestCancellationToken = getRequestCancellationToken(
    getCollaboratorsCTS,
    cancellationTokenSource,
  );
  getCollaboratorsCTS = cancellationTokenSource;

  let requestUrl = `${ttpApiUrl}/organization/user`;

  const filter = [
    {
      property: "organization.id",
      value: organizationId,
      operator: "eq",
    },
  ];

  if (search) {
    filter.push({ property: "name", value: search, operator: "like" });
    filter.push({ property: "email.main", value: 1, operator: "eq" });
  }

  let params = {
    access_token: token,
    fields: "*",
    start: 0,
    filter: JSON.stringify(filter),
    limit: 20,
    workspace: "ua",
  };

  let requestConfig = getRequestConfig(params, requestCancellationToken);
  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const getContacts = ({ ttpApiUrl, token, search, organizationId }) => {
  let cancellationTokenSource = generateCancellationTokenSource();

  let requestCancellationToken = getRequestCancellationToken(
    getContactsCTS,
    cancellationTokenSource,
  );
  getContactsCTS = cancellationTokenSource;

  let requestUrl = `${ttpApiUrl}/mailing/contact`;
  const filter = [
    { property: "client.id", value: organizationId, operator: "eq" },
    { property: "firstName", value: "", operator: "neq" },
  ];
  if (search) {
    filter.push(
      ...[
        { property: "name", value: search, operator: "like" },
        { property: "email.main", value: 1, operator: "eq" },
      ],
    );
  }

  let params = {
    filter: JSON.stringify(filter),
    access_token: token,
    fields: "*",
    start: 0,
    limit: 20,
  };

  let requestConfig = getRequestConfig(params, requestCancellationToken);
  return axios.get(requestUrl, requestConfig).catch(function (thrown) {
    throwCatchedError(thrown);
  });
};

export const getUsersByIds = ({ ttpApiUrl, token, ids }) => {
  const requestUrl = `${ttpApiUrl}/organization/user`;

  const filter = [
    {
      property: "id",
      operator: "in",
      value: ids,
    },
  ];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      fields: "*",
      filter: JSON.stringify(filter),
      workspace: "ua",
    },
  });
};

export const getUserHeadline = ({
  ttpApiUrl,
  token,
  userIds,
  organizationId,
}) => {
  const requestUrl = `${ttpApiUrl}/organization/user`;

  const filter = [
    {
      property: "id",
      operator: "in",
      value: userIds,
    },
  ];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      fields: "*,blogRoleInOrganization",
      filter: JSON.stringify(filter),
      organization_id: organizationId,
      workspace: "ua",
    },
  });
};

export const mergeTags = ({ ttpApiUrl, token, data }) => {
  const requestUrl = `${ttpApiUrl}/blog/tag/merge`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("source", data.source);
  formData.append("destination", data.destination);
  formData.append("full_merge", data.fullMerge);

  return axios.post(requestUrl, formData);
};

export const saveResetRecurrentArticle = (ttpApiUrl, token, data) => {
  const requestUrl = `${ttpApiUrl}/blog/article`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("isRecurrent", data.isRecurrent);
  formData.append("id", data.id);

  return axios.post(requestUrl, formData);
};

export const getBlogRole = ({ ttpApiUrl, token, userIds, communityId }) => {
  const filter = [
    { property: "user", value: userIds, operator: "in" },
    { property: "organization", value: communityId, operator: "eq" },
  ];

  const requestUrl = `${ttpApiUrl}/blog/blog-role`;

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: "*,userId",
    },
  });
};

export const getAutoNotifications = (
  ttpApiUrl,
  token,
  lng,
  organizationId,
  date,
  articleId,
) => {
  const requestUrl = `${ttpApiUrl}/blog/article/list-auto-mobile-notification`;
  let params = {
    access_token: token,
    language: lng,
    organization: organizationId,
    date,
  };
  if (articleId) {
    params.articleId = articleId;
  }

  return axios.get(requestUrl, {
    params,
  });
};
