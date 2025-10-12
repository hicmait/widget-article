import axios from "axios";
import { TTP_API_URL } from "../services/config";

export const translateTag = ({ token, text, lng }) => {
  const requestUrl = `${TTP_API_URL}/blog/tag/translate`;

  var formData = new FormData();
  formData.append("access_token", token);
  formData.append("text", text);
  formData.append("lang", lng);

  return axios.post(requestUrl, formData);
};
