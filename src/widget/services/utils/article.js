// import moment from "moment";
import moment from "moment-timezone";
import "moment/locale/fr";
import "moment/locale/nl";
import { TTP_BLOG_URL, TTP_FFF_BLOG, TTP_DAP_BLOG } from "../config";

export function sortCategoriesAlphabetically(items, key) {
  return items.slice().sort((a, b) => {
    return a[key].toLowerCase().localeCompare(b[key]);
  });
}

export function getAuthorAllHeadlines(newAuthor) {
  let headlines =
    newAuthor.blogRoleInOrganization &&
    newAuthor.blogRoleInOrganization[0] &&
    newAuthor.blogRoleInOrganization[0].headlines &&
    typeof newAuthor.blogRoleInOrganization[0].headlines === "object"
      ? newAuthor.blogRoleInOrganization[0].headlines
      : {};

  return headlines;
}

export function getAuthorHeadlines(newAuthor, selectedLanguage) {
  const headlineAttr = `headline${
    selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
  }`;

  let headlines =
    newAuthor.blogRoleInOrganization &&
    newAuthor.blogRoleInOrganization[0] &&
    newAuthor.blogRoleInOrganization[0][headlineAttr] &&
    newAuthor.blogRoleInOrganization[0][headlineAttr].title
      ? newAuthor.blogRoleInOrganization[0][headlineAttr].title
      : "";
  if (!headlines && newAuthor[headlineAttr] && newAuthor[headlineAttr].title) {
    headlines = newAuthor[headlineAttr].title;
  }

  return headlines;
}

export function getNewAuthorHeadlines(newAuthor, selectedLanguage) {
  const headlineAttr = `headline${
    selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)
  }`;

  let headlines =
    newAuthor.blogRoleInOrganization &&
    newAuthor.blogRoleInOrganization[0] &&
    newAuthor.blogRoleInOrganization[0][headlineAttr] &&
    newAuthor.blogRoleInOrganization[0][headlineAttr].signature
      ? newAuthor.blogRoleInOrganization[0][headlineAttr].signature
      : "";

  return headlines;
}

const API_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
/**
 * Convert a date from client Timezone to UTC
 *
 * @param date string
 * @param srcFormat string
 * @param destFormat string
 *
 * @return string formatted UTC date (in destFormat format)
 */
export function convertDateToUTC(
  date,
  srcFormat = API_DATE_FORMAT,
  destFormat = API_DATE_FORMAT
) {
  if (!date) {
    return "";
  }

  var offsetMinutes = new Date().getTimezoneOffset();
  return moment(date, [srcFormat])
    .add(offsetMinutes, "minutes")
    .format(destFormat);
}

/**
 * Convert a date from UTC to client Timezone
 *
 * @param date string
 * @param srcFormat string
 * @param destFormat string
 *
 * @return string formatted local date (in destFormat format)
 */
export function convertDateFromUTC(
  date,
  srcFormat = API_DATE_FORMAT,
  destFormat = API_DATE_FORMAT
) {
  if (!date) {
    return "";
  }

  var offsetMinutes = new Date().getTimezoneOffset();
  return moment(date, [srcFormat])
    .subtract(offsetMinutes, "minutes")
    .format(destFormat);
}

/**
 * Convert base64 Data to File object
 *
 * @param b64Data
 *
 * @return Object File
 */
export function convertBase64toFile(b64Data) {
  let imageData = b64Data.split(",");

  let contentType = imageData[0].match(/:(.*?);/)[1];

  let byteCharacters = atob(imageData[1]);

  var n = byteCharacters.length;
  var byteArray = new Uint8Array(n);
  while (n--) {
    byteArray[n] = byteCharacters.charCodeAt(n);
  }

  return new File([byteArray], "pdfImage", { type: contentType });
}

export function trimStr(str) {
  str = removeFromBeginStr(str, "<p><br></p>");
  str = removeFromBeginStr(str, "<p></p>");
  str = removeFromBeginStr(str, "<br>");

  const exStr = str.split("<p>");

  if (!exStr || exStr.length == 0) {
    return str;
  }
  return exStr.map((elem) => elem.replace(/&nbsp;/g, " ").trim()).join("<p>");
}

export function removeFromBeginStr(str, part) {
  if (str.indexOf(part) == 0) {
    return str.slice(part.length);
  }
  return str;
}

export function getWarningHeader() {
  return {
    Warning: "413",
  };
}

export function getArticleFullUrl(article) {
  const { url, id, organization, language, isExternal, externalUrl } = article;

  if (isExternal) {
    return externalUrl;
  }

  let fullUrl = `/${language}/article/${url}/${id}`;

  if (organization && [9, 4].includes(organization.id)) {
    if (organization.id == 9) {
      return `${TTP_FFF_BLOG}${fullUrl}`;
    } else if (organization.id == 4) {
      return `${TTP_DAP_BLOG}${fullUrl}`;
    }
  }

  return `${TTP_BLOG_URL}${fullUrl}`;
}

export function getAllowedScopes(community) {
  if (!community) {
    return [];
  }
  const scopes = ["EXTRA_CROSS", "INTRA_CROSS", "EXTRA_SHARE", "INTRA_SHARE"];

  const { blogPreferences, csGeneralScope } = community;
  let cs_scope = csGeneralScope;

  if (blogPreferences && blogPreferences.cs_app_scope) {
    cs_scope = blogPreferences.cs_app_scope;
  }

  return scopes.slice(scopes.indexOf(cs_scope));
}

export function getDefaultScope(community) {
  const allowedScopes = getAllowedScopes(community);
  let defaultScope = allowedScopes[0];

  if (community) {
    const { blogPreferences } = community;

    if (blogPreferences && blogPreferences.cs_default_scope) {
      defaultScope = blogPreferences.cs_default_scope;
    }
  }
  return defaultScope;
}

export const isSocialNetworkExpired = (socialNetwork) => {
  const now = moment(new Date());
  let expired = false;

  if (!socialNetwork) {
    return true;
  }

  Object.keys(socialNetwork).forEach((sn) => {
    Object.keys(socialNetwork[sn]).forEach((account) => {
      if (socialNetwork[sn][account]["updated_at"]) {
        let end = moment(socialNetwork[sn][account]["updated_at"]);
        let duration = moment.duration(now.diff(end));
        let days = duration.asDays();
        if (Math.ceil(days) >= 60) {
          expired = true;
        }
      } else {
        expired = true;
      }
    });
  });
  return expired;
};

export const convertDateTimeZone = (date) => {
  return moment.tz(date, moment.tz.guess()).format("YYYY-MM-DD H:mm:ss");
};

export const findNextDate = (recurrence, publishedAt) => {
  if (!recurrence.type || !publishedAt) {
    return null;
  }
  let nextDate = "";
  switch (recurrence.type) {
    case "MONTH":
      nextDate = moment(publishedAt).add(1, "months");
      break;
    case "3_MONTH":
      nextDate = moment(publishedAt).add(3, "months");
      break;
    case "6_MONTH":
      nextDate = moment(publishedAt).add(6, "months");
      break;
    case "YEAR":
      nextDate = moment(publishedAt).add(1, "years");
      break;
  }
  const endDate = recurrence?.endDate ? moment(recurrence.endDate) : null;
  if (endDate && nextDate > endDate) {
    nextDate = "";
  }
  return nextDate ? moment(nextDate).format("YYYY-MM-DD") : "";
};
