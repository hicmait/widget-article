export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

export function setCookie(name, value, expires, path, domain, secure) {
  document.cookie =
    name +
    " = " +
    escape(value) +
    "  " +
    (!expires ? "" : "; expires = " + expires.toUTCString()) +
    (!path ? "" : "; path = " + path) +
    (!domain ? "" : "; domain = " + domain) +
    (secure === true ? "; secure" : "");
}

export const authHasExpired = (authInfos) => {
  const now = Math.floor(new Date().getTime() / 1000);

  return (
    !authInfos ||
    typeof authInfos !== "object" ||
    !authInfos.createdAt ||
    !authInfos.expiresIn ||
    now >= authInfos.createdAt * 1 + authInfos.expiresIn * 1
  );
};

export const getLocalStorageUser = () => {
  const stringUser = localStorage.getItem("user");
  let user = [];

  try {
    user = JSON.parse(stringUser);
  } catch (e) {}
  return user instanceof Object ? user : {};
};

export const getLocalStorageAuth = () => {
  const stringAuth = localStorage.getItem("auth");
  let auth = {};

  try {
    auth = JSON.parse(stringAuth);
  } catch (e) {}
  return typeof auth === "object" ? auth : {};
};

export const setLocalStorageAuth = (auth) => {
  if (typeof auth === "object") {
    localStorage.setItem("auth", JSON.stringify(auth));
    return auth;
  }
  if (auth == null) {
    localStorage.removeItem("auth");
  }
};

export const getLocalStorageCookie = () => {
  const stringAuth = localStorage.getItem("cookie_auth");
  let cookie_auth = null;

  try {
    cookie_auth = JSON.parse(stringAuth);
  } catch (e) {}
  return cookie_auth && typeof cookie_auth === "object" ? cookie_auth : null;
};

export const setLocalStorageCookie = (cookie_auth) => {
  if (cookie_auth && typeof cookie_auth === "object") {
    localStorage.setItem("cookie_auth", JSON.stringify(cookie_auth));
    return cookie_auth;
  }
  if (cookie_auth == null) {
    localStorage.removeItem("cookie_auth");
  }
};
