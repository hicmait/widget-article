import axios from "axios";
import {
  TTP_BLOG_URL,
  TTP_FFF_BLOG,
  TTP_DEG_BLOG,
  TTP_BE_ACCOUNTANTS_BLOG,
} from "../config";

// TODO review this
export function isServiceActivated(service, resources, activatedPrefix = true) {
  for (let resource of resources) {
    if (
      false === activatedPrefix &&
      undefined !== resource.service &&
      1 === resource.service * 1
    ) {
      return true;
    }

    if (
      true === activatedPrefix &&
      undefined !== resource[`${service}Activated`] &&
      1 === resource[`${service}Activated`] * 1
    ) {
      return true;
    }
  }
  return false;
}

export const slugify = (string) => {
  return string
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export const getDefaultLanguage = () => {
  let lng = navigator.language || navigator.userLanguage;
  lng = lng.split("-")[0];
  return ["fr", "en", "nl"].includes(lng) ? lng : "en";
};

export const getLanguage = () => {
  let lng = navigator.language || navigator.userLanguage;
  lng = lng.split("-")[0];
  let defaultLanguage = ["fr", "en", "nl"].includes(lng) ? lng : "en";
  return localStorage.getItem("lng") || defaultLanguage;
};

export const isServer = !(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const getDateLabel = (date, withAt = true) => {
  const d = new Date(date);

  const result = d.toDateString().split(" ");

  const hours =
    parseInt(d.getHours(), 10) < 10 ? "0" + d.getHours() : d.getHours();
  const minutes =
    parseInt(d.getMinutes(), 10) < 10 ? "0" + d.getMinutes() : d.getMinutes();

  let rlt = result[2] + " " + result[1] + " " + result[3];

  if (withAt) {
    return rlt + ", at " + hours + ":" + minutes;
  }
  return rlt;
};

export const randomIntBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function sortTags(tags, lng) {
  let sortedTags = tags;

  switch (lng) {
    case "en":
      sortedTags = tags.sort(function (a, b) {
        return a.nameEn === b.nameEn ? 0 : +(a.nameEn > b.nameEn) || -1;
      });
      break;
    case "fr":
      sortedTags = tags.sort(function (a, b) {
        return a.nameFr === b.nameFr ? 0 : +(a.nameFr > b.nameFr) || -1;
      });
      break;
    case "nl":
      sortedTags = tags.sort(function (a, b) {
        return a.nameNl === b.nameNl ? 0 : +(a.nameNl > b.nameNl) || -1;
      });
      break;
    default:
  }

  return sortedTags;
}

export const getTagNameAttr = (lng) => {
  return `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
};

export function getTagName(tag, currentLanguage) {
  let languages = ["nameFr", "nameNl", "nameEn"].filter(
    (e) => e !== currentLanguage
  );

  for (let i = 0; i < languages.length; i++) {
    let lng = languages[i];

    if (tag[lng] != null && tag[lng].trim() !== "") {
      return tag[lng];
    }
  }
  return "";
}

export const htmlDecode = (strData) => {
  if (strData && typeof strData === "string") {
    return strData.replace(/&#(\d+);/g, (match, dec) => {
      return String.fromCharCode(dec);
    });
  }
  return "";
};

export const unescapeHtml = (safe) => {
  if (safe && typeof safe === "string") {
    return safe
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, `"`)
      .replace(/&#039;/g, "'");
  }
};

export const purifyString = (string) => {
  return htmlDecode(unescapeHtml(string));
};

export function getTo(article, auth) {
  const { url, id, organization, lng } = article;
  let to = `article/${url}/${id}?lng=${lng}`;

  if (
    organization &&
    [8, 9, 105].indexOf(parseInt(organization.id, 10)) !== -1
  ) {
    const { loggedAs, token, user, expiresIn, createdAt } = auth;

    if (loggedAs !== "GUEST_FROM_NL" && loggedAs !== "GUEST") {
      to += `&token=${token}&email=${user.mainEmail}&id=${user.id}&expiresIn=${expiresIn}&createdAt=${createdAt}`;
    }
    if (
      parseInt(organization.id, 10) === 9 ||
      parseInt(organization.id, 10) === 105
    ) {
      return `${TTP_FFF_BLOG}/${to}`;
    } else if (parseInt(organization.id, 10) === 8) {
      return `${TTP_BE_ACCOUNTANTS_BLOG}/${to}`;
    } else if (parseInt(organization.id, 10) === 4) {
      return `${TTP_DEG_BLOG}/${to}`;
    }
  }

  return `${TTP_BLOG_URL}/${to}`;
}

export function addLandaSize(img, width = 0, height = 0) {
  let result = img;
  let found = false;

  const splt = img.split(".");
  const ext = splt[splt.length - 1];

  if (width > 0) {
    result += `/w${width}`;
    found = true;
  }
  if (height > 0) {
    const sep = width > 0 ? "-" : "/";
    result += `${sep}h${height}`;
    found = true;
  }
  result += found ? "-noEnlarge" : "/noEnlarge";

  return `${result}.${ext}`.replace(
    "https://s3.eu-west-1.amazonaws.com/tamtam",
    "https://s3.tamtam.pro"
  );
}

export const sanitize = (str) => {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
};
