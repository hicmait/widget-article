import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (
    { name = null, nameAttr = null, language = null },
    { dispatch, getState }
  ) => {
    const { token } = getState().auth;

    let filter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== language);
    if (null !== name) {
      filter = [
        {
          property: nameAttr,
          value: name,
          operator: "like",
        },
      ];

      if (lngs) {
        lngs.forEach((itm) => {
          let lngNameAttr = `name${itm.charAt(0).toUpperCase() + itm.slice(1)}`;
          filter.push({
            property: lngNameAttr,
            value: name,
            operator: "eq",
            logicalOperator: "OR",
          });
        });
      }
    }

    const response = await api.getTags({
      token,
      language,
      filter,
    });
    return response;
  }
);

export const fetchArticleTags = createAsyncThunk(
  "tags/fetchArticleTags",
  async (data, { dispatch, getState }) => {
    const { token } = getState().auth;

    const response = await api.getTagsFromArticle(token, data);
    return response;
  }
);
