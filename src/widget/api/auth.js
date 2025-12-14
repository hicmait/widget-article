import axios from "axios";
import { TTP_API_URL, CLIENT_CREDENTIAL } from "../services/config";

export const getTTPUser = ({ ttpApiUrl, userId, token }) => {
  const filter = [
    {
      property: "id",
      value: userId,
      operator: "eq",
    },
  ];

  const fields = [
    "*",
    "communities",
    "avatar",
    "description",
    "contactSocialNetworks",
    "socialNetworks",
    "cover",
    "url",
    "role",
    "roles",
    "blogRole",
    "author",
    "preferences",
    "chains",
  ];

  const requestUrl = `${ttpApiUrl}/organization/user`;

  let params = {
    access_token: token,
    filter: JSON.stringify(filter),
    fields: fields.join(","),
  };

  return axios.get(requestUrl, {
    //cancelToken: getLatestArticlesSourceToken.token,
    params,
  });
};

export const checkUserTokenValidity = ({ ttpApiUrl, userId, token }) => {
  const filter = [
    {
      property: "id",
      value: userId,
      operator: "eq",
    },
  ];

  const fields = ["id"];

  const requestUrl = `${ttpApiUrl}/organization/user`;

  let params = {
    access_token: token,
    filter: JSON.stringify(filter),
    fields: fields.join(","),
  };

  return axios.get(requestUrl, {
    //cancelToken: getLatestArticlesSourceToken.token,
    params,
  });
};

export const getClientCredential = () => {
  const requestUrl = `${TTP_API_URL}/token`;

  return axios.post(requestUrl, CLIENT_CREDENTIAL);
  // $.ajax({
  //   type: "POST",
  //   async: false,
  //   url: requestUrl,
  //   data: CLIENT_CREDENTIAL,
  // });
};

export const setSelectedOrganization = ({ token, organizationId }) => {
  const requestUrl = `${TTP_API_URL}/organization/user/save-selected-organization`;

  let formData = new FormData();
  formData.append("access_token", token);
  formData.append("organizationId", organizationId);

  return axios.post(requestUrl, formData);
};

export const getSelectedOrganization = (token) => {
  const requestUrl = `${TTP_API_URL}/organization/user/get-selected-organization`;

  return axios.get(
    requestUrl,
    `access_token=${token}&fields=${[
      "id",
      "uen",
      "name",
      "url",
      "abbreviation",
    ].join(",")}`
  );
  //$.ajax({
  //   type: "GET",
  //   async: false,
  //   url: requestUrl,
  //   data: `access_token=${token}&fields=${[
  //     "id",
  //     "uen",
  //     "name",
  //     "url",
  //     "abbreviation",
  //   ].join(",")}`,
  // });
};
