import axios from "axios";

import { throwCatchedError } from "../services/utils";
import { TTP_API_URL } from "../services/config";

export const tamtamIt = (token, { url }) => {
  const requestUrl = `${TTP_API_URL}/blog/parser/parse`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("url", url);

  return axios.post(requestUrl, formData);
};

export const saveTamtamIt = (token, data) => {
  const requestUrl = `${TTP_API_URL}/blog/article/save-external-article`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("title", data.title);
  if (data.content) {
    formData.append("content", data.content);
  }
  if (data.categoryId) {
    formData.append("category", data.categoryId);
  }
  if (data.themeId) {
    formData.append("theme", data.themeId);
  }
  formData.append("organization", data.communityId);
  formData.append("language", data.lng);
  formData.append("status", data.status);
  formData.append("externalUrl", data.shortened_url);
  formData.append("publishedAt", data.publishedAt);
  formData.append("targetedUser", data.assignedRedactor);

  if (data.id) {
    formData.append("id", data.id);
  }
  if (data.csScope) {
    formData.append("csScope", data.csScope);
  }
  if (data.groups) {
    formData.append("groups", data.groups);
  }

  const nameAttr = `name${
    data.lng.charAt(0).toUpperCase() + data.lng.slice(1)
  }`;
  // if (data.tags && data.tags.length > 0) {
  //     for (let i = 0; i < data.tags.length; i++) {
  //         formData.append(`tag[${i}][${nameAttr}]`, data.tags[i][nameAttr]);
  //         if (data.tags[i].id) {
  //             formData.append(`tag[${i}][id]`, data.tags[i].id);
  //         }
  //     }
  // }
  if (data.tags && data.tags.length > 0) {
    data.tags.forEach((tag, i) => {
      formData.append(`tag[${i}][${nameAttr}]`, tag.label);
      if (tag.id) {
        formData.append(`tag[${i}][id]`, tag.id);
      }
    });
  }

  formData.append("social", JSON.stringify({}));

  if (data.media && data.media.length > 0) {
    for (let i = 0; i < data.media.length; i++) {
      if (data.media[i].id) {
        formData.append(`mediaUrl[${i}][id]`, data.media[i].id);
      } else {
        formData.append(`mediaUrl[${i}][url]`, data.media[i].url);
        formData.append(`mediaUrl[${i}][isMain]`, data.media[i].isMain);
      }
    }
  }

  if (data.pages && data.pages.length > 0) {
    for (let i = 0; i < data.pages.length; i++) {
      formData.append(`pages[${i}]`, data.pages[i].id);
    }
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
          author.signature.title
        );

        if (
          author.signature.head &&
          author.signature.head !== undefined &&
          author.signature.head.trim() !== "undefined"
        ) {
          formData.append(
            `articleBlogRole[${i}][signature][head]`,
            author.signature.head
          );
        } else {
          formData.append(`articleBlogRole[${i}][signature][head]`, "");
        }

        formData.append(
          `articleBlogRole[${i}][enableAvatar]`,
          author.enableAvatar ? 1 : 0
        );
        formData.append(`articleBlogRole[${i}][priority]`, author.priority);
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

  return axios.post(requestUrl, formData);
};

export const shareArticleOnSocialNetworks = (token, data) => {
  const requestUrl = `${TTP_API_URL}/blog/article/share-on-social-networks`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("id", data.id);

  formData.append("social", JSON.stringify(data.social));

  return axios.post(requestUrl, formData);
};

export const getSharingHistory = (token, organizationId) => {
  const requestUrl = `${TTP_API_URL}/blog/tamtamit-queue/${organizationId}`;

  return axios
    .get(requestUrl, {
      params: {
        access_token: token,
      },
    })
    .catch(function (thrown) {
      throwCatchedError(thrown);
    });
};

export const checkTamtamitUrl = (token, organizationId, url) => {
  const requestUrl = `${TTP_API_URL}/blog/tamtamit-queue/check-url/by-organization/${organizationId}`;

  return axios
    .get(requestUrl, {
      params: {
        access_token: token,
        url: url,
      },
    })
    .catch(function (thrown) {
      throwCatchedError(thrown);
    });
};

export const apiUploadTmpMedia = ({ token, data }) => {
  const requestUrl = `${TTP_API_URL}/blog/article/upload-tmp-media`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("file", data);

  return axios.post(requestUrl, formData, {
    Warning: "413",
  });
};
