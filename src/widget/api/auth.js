import axios from "axios";

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
