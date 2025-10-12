import axios from "axios";
import { TTP_API_URL } from "../../services/config";

export const getMedias = ({
  token,
  limit,
  offset = 0,
  type,
  community,
  filterBy,
  allowedMediaTypes,
  lng,
  isFavorite = 0,
  languages = ["FR", "EN", "NL"].sort(),
}) => {
  let fields = [
    "*",
    "meta",
    "webPath",
    "title",
    "description",
    "preview",
    "tags",
    "creator",
    "taggedUsers",
    "social",
    "organization",
  ];

  let filter = [];

  if (community && community.id) {
    filter.push({
      property: "organization",
      operator: "eq",
      value: community.id,
    });
  } else {
    fields.push("organization");
  }

  filter.push({
    property: "languages",
    operator: "flike",
    value: lng,
  });

  if (!allowedMediaTypes || allowedMediaTypes.length === 0) {
    allowedMediaTypes = ["IMAGE", "VIDEO", "PPT", "PDF"];
  }

  if (type) {
    if (type === "MASK" || type === "LOGO") {
      filter.push({
        property: "objectType",
        operator: "eq",
        value: type,
      });
    } else {
      filter.push({
        property: "objectType",
        operator: "nin",
        value: ["LOGO", "MASK"],
      });

      if (type.toUpperCase() !== "ALL") {
        if (type === "DOC") {
          const docType = [];
          if (allowedMediaTypes.includes("PDF")) docType.push("PDF");
          if (allowedMediaTypes.includes("PPT")) docType.push("PPT");
          filter.push({
            property: "docType",
            operator: "in",
            value: docType.length > 0 ? docType : ["NOT_ALLOWED_TYPE"],
          });
        } else {
          filter.push({
            property: "docType",
            operator: "in",
            value: allowedMediaTypes.includes(type)
              ? [type]
              : ["NOT_ALLOWED_TYPE"],
          });
        }
      } else {
        filter.push({
          property: "docType",
          operator: "in",
          value:
            allowedMediaTypes.length > 0
              ? allowedMediaTypes
              : ["NOT_ALLOWED_TYPE"],
        });
      }
    }
  }

  if (filterBy && filterBy.type) {
    if (filterBy.type.toUpperCase() !== "ALL") {
      if (filterBy.type === "DOC") {
        filter.push({
          property: "docType",
          operator: "in",
          value:
            allowedMediaTypes.includes("PDF") &&
            allowedMediaTypes.includes("PPT")
              ? ["PDF", "PPT"]
              : ["NOT_ALLOWED_TYPE"],
        });
      } else {
        filter.push({
          property: "docType",
          operator: "in",
          value: allowedMediaTypes.includes(filterBy.type)
            ? [filterBy.type]
            : ["NOT_ALLOWED_TYPE"],
        });
      }
    } else if (filterBy.type.toUpperCase() === "ALL") {
      filter.push({
        property: "docType",
        operator: "in",
        value:
          allowedMediaTypes.length > 0
            ? allowedMediaTypes
            : ["NOT_ALLOWED_TYPE"],
      });
    }
    filter.push({
      property: "objectType",
      operator: "nin",
      value: ["LOGO", "MASK"],
    });
  }

  if (filterBy && filterBy.search) {
    //TODO search in other fields
    filter.push({
      property: `title${lng.charAt(0).toUpperCase() + lng.slice(1)}`,
      operator: "like",
      value: filterBy.search,
    });
  }

  if (filterBy && filterBy.tags && filterBy.tags.length > 0) {
    filter.push({
      property: "tag.id",
      operator: "in",
      value: filterBy.tags.map((tag) => tag.id),
    });
  }

  if (filterBy && filterBy.creator) {
    filter.push({
      property: "creator",
      operator: "eq",
      value: filterBy.creator.id,
    });
  }
  if (filterBy && filterBy.category) {
    filter.push({
      property: "category.id",
      operator: "eq",
      value: filterBy.category.id,
    });
  }

  if (filterBy && filterBy.isPrivate) {
    filter.push({
      property: "isPrivate",
      operator: Array.isArray(filterBy.isPrivate) ? "in" : "eq",
      value: filterBy.isPrivate,
    });
  } else {
    filter.push({
      property: "isPrivate",
      operator: "eq",
      value: "0",
    });
  }

  if (filterBy && filterBy.inTheNews) {
    filter.push({
      property: "inTheNews",
      operator: "eq",
      value: filterBy.inTheNews,
    });
  }

  const sort = [
    {
      property: "createdAt",
      dir: "desc",
    },
  ];

  const requestUrl = `${TTP_API_URL}/media/media${
    isFavorite === 1 ? "/favorite" : ""
  }`;

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
      fields: fields.join(","),
      limit,
      start: offset,
      workspace: "ua",
    },
  });
};

export const getMedia = ({ token, mediaId }) => {
  const filter = [{ property: "id", value: mediaId, operator: "eq" }];

  let fields = [
    "*",
    "meta",
    "webPath",
    "title",
    "description",
    "preview",
    "tags",
    "creator",
    "taggedUsers",
    "social",
    "organization",
  ];

  const requestUrl = `${TTP_API_URL}/media/media`;

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      filter: JSON.stringify(filter),
      fields: fields.join(","),
    },
  });
};

export const saveMedia = ({
  token,
  lng,
  id,
  community,
  file,
  titleFR,
  titleEN,
  titleNL,
  descriptionFR,
  descriptionEN,
  descriptionNL,
  altFR,
  altEN,
  altNL,
  copyrightFR,
  copyrightEN,
  copyrightNL,
  tags,
  creator,
  taggedUsers,
  isPrivate,
  inTheNews,
  mediaStatus,
  csScope,
  overrideMainImage = false,
  onProgress,
  docType,
  mask,
  logo = null,
  logoPosition = null,
  logoSize = null,
  width,
  height,
  languages,
}) => {
  const requestUrl = `${TTP_API_URL}/media/media`;
  let config = {};
  // if (onProgress) {
  //   config.onUploadProgress = progressEvent => {
  //     let percentCompleted = Math.floor(
  //       (progressEvent.loaded * 100) / progressEvent.total
  //     );
  //     onProgress(percentCompleted);
  //   };
  // }
  let formData = new FormData();
  formData.append("access_token", token);
  formData.append("organization", community.id);
  if (languages && languages.includes("FR")) {
    formData.append("titleFr", titleFR || file.name);
  }
  if (languages && languages.includes("NL")) {
    formData.append("titleNl", titleNL || file.name);
  }
  if (languages && languages.includes("EN")) {
    formData.append("titleEn", titleEN || file.name);
  }
  formData.append("overrideMainImage", overrideMainImage);
  descriptionFR && formData.append("descriptionFr", descriptionFR);
  descriptionEN && formData.append("descriptionEn", descriptionEN);
  descriptionNL && formData.append("descriptionNl", descriptionNL);
  altFR && formData.append("altFr", altFR);
  altEN && formData.append("altEn", altEN);
  altNL && formData.append("altNl", altNL);
  copyrightFR && formData.append("copyrightFr", copyrightFR);
  copyrightEN && formData.append("copyrightEn", copyrightEN);
  copyrightNL && formData.append("copyrightNl", copyrightNL);
  creator && formData.append("creator", creator.id);
  // file && formData.append("file", dataURLtoBlob(file));
  file && formData.append("file", file);
  docType && formData.append("docType", docType);
  mask && formData.append("mask", mask.id);
  formData.append("isPrivate", isPrivate ? 1 : 0);
  formData.append("inTheNews", inTheNews ? 1 : 0);
  mediaStatus && formData.append("mediaStatus", mediaStatus);
  csScope && formData.append("csScope", csScope);
  languages && formData.append("languages", languages.join(","));
  if (logo && logoPosition && logoSize) {
    formData.append("logo", logo.id);
    const x = logoPosition.i * 25;
    const y = logoPosition.j * 25;
    formData.append("logoData", `${x}x${y}_${logoSize}`);
  }

  if (taggedUsers && taggedUsers.length > 0) {
    const ids = taggedUsers.map((user) => user.id).join(",");
    formData.append("taggedUsers", ids);
  }

  width && formData.append("width", width);
  height && formData.append("height", height);
  id && formData.append("id", id);

  if (tags && tags.length > 0) {
    // const nameAttr = `name${data.language.charAt(0).toUpperCase() + data.language.slice(1)}`;
    tags.forEach((tag, i) => {
      if (tag.id) {
        formData.append(`tags[${i}][id]`, tag.id);
      } else {
        formData.append(`tags[${i}][nameFr]`, tag["nameFr"] || "");
        formData.append(`tags[${i}][nameEn]`, tag["nameEn"] || "");
        formData.append(`tags[${i}][nameNl]`, tag["nameNl"] || "");
      }
    });
  }
  // const $return = axios.post(requestUrl, formData, config);
  // console.log($return);
  // $return.then((res) => {
  //   console.log(res);
  // });
  return axios.post(requestUrl, formData, config);
};

export const getBlogTags = ({ token, lng = "fr", filter = null }) => {
  //TODO add language in fields
  const requestUrl = `${TTP_API_URL}/blog/tag`;
  return axios.get(requestUrl, {
    // cancelToken: getTagsSourceToken.token,
    params: {
      access_token: token,
      fields: "id, nameFr, nameEn, nameNl, sanitizedNameFr, parent, isSynonym",
      filter: JSON.stringify(filter),
    },
  });
  // .catch(function(thrown) {
  //   // throwCatchedError(thrown);
  // });
};

export const getUsers = ({ token, search }) => {
  const requestUrl = `${TTP_API_URL}/organization/user`;

  const filter = [];

  if (search) {
    filter.push({
      property: "name",
      operator: "like",
      value: search,
    });
  }

  const sort = [
    {
      property: "firstName",
      dir: "asc",
    },
  ];

  return axios.get(requestUrl, {
    params: {
      access_token: token,
      fields: "*, avatar",
      filter: JSON.stringify(filter),
      sort: JSON.stringify(sort),
    },
  });
};
