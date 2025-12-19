import axios from "axios";

export const translateTag = ({ ttpApiUrl, token, text, lng }) => {
  const requestUrl = `${ttpApiUrl}/blog/tag/translate`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("text", text);
  formData.append("lang", lng);

  return axios.post(requestUrl, formData);
};
