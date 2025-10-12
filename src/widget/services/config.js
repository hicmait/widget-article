export const TTP_API_URL = "";
export const APP_ENV = "local";
export const TTP_BLOG_URL = "";
export const TTP_HOME_URL = "";
export const TTP_FFF_BLOG = "";
export const TTP_DEG_BLOG = "";
export const TTP_DAP_BLOG = "";
export const TTP_BE_ACCOUNTANTS_BLOG = "";

export const MAX_FILE_SIZE = 3 * 1024 * 1024;

export const TTP_LOGO_URL = "https://s3.tamtam.pro/v2/apps/media.png";

// export const AUTH_COOKIE_NAME = `ttp_auth_${APP_ENV}`;

export const COMMUNITY_NAME_MAX_LENGTH = 20;
export const COMMUNITY_DEFAULT_LOGO_URL = "/img/community-default-logo.png";

export const MENUS = {
  GUEST: [],
  READER: ["COMMUNITIES", "TYPES", "ALBUMS"],
  MEMBER: ["COMMUNITIES", "TYPES", "ALBUMS"],
  ADMIN: ["COMMUNITIES", "TYPES", "ALBUMS"],
};

export const PAGES = {
  HOME_PAGE: "HOME_PAGE",
  AUTHOR_PAGE: "AUTHOR_PAGE",
  CATEGORY_PAGE: "CATEGORY_PAGE",
  COMMUNITIES_PAGE: "COMMUNITIES_PAGE",
  ARTICLE_PAGE: "ARTICLE_PAGE",
  SETTING_PAGE: "SETTING_PAGE",
};

export const SOCIAL_NETWORKS_HOSTS = {
  FACEBOOK: "https://www.facebook.com",
  TWITTER: "https://www.twitter.com",
  LINKEDIN: "https://www.linkedin.com",
};

export const BUBBLE_EVENTS = {
  DELETE_SELECTED_MEDIAS: "DELETE_SELECTED_MEDIAS",
  ADD_TO_ALBUM: "ADD_TO_ALBUM",
  SELECT_ALL_USERS: "SELECT_ALL_USERS",
  DESELECT_ALL_USERS: "DESELECT_ALL_USERS",
  ADD_NEW_USER: "ADD_NEW_USER",
  CLICK_SETTINGS: "CLICK_SETTINGS",
  ADD_NEW_MEDIA: "ADD_NEW_MEDIA",
  ADD_NEW_ARTICLE: "ADD_NEW_ARTICLE",
  DELETE_MEDIAS: "DELETE_MEDIAS",
  IMPORT_ARTICLE: "IMPORT_ARTICLE",
};

export const SETTINGS_USERS_PAGE_LIMIT = 9;

export const LIMIT_SUPER_TAG = 2;

export const CLIENT_CREDENTIAL = {
  grant_type: "client_credentials",
  client_id: "10011",
  client_secret: "BlogSecretS#K$",
  scope: "ttp",
};
