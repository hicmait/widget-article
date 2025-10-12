import { createAsyncThunk } from "@reduxjs/toolkit";

import * as api from "../../api";
import { getLanguage, getAllowedMediaTypes } from "../../services/utils";

export const fetchMedias = createAsyncThunk(
  "medias/fetchMedias",
  async ({ type = "ALL", limit, filterBy }, { dispatch, getState }) => {
    const lng = getLanguage();
    const { token, navCommunity } = getState().auth;
    const allowedMediaTypes = getAllowedMediaTypes(navCommunity);
    return api.getMedias({
      token,
      type,
      filterBy,
      limit,
      lng,
      allowedMediaTypes,
      community: navCommunity /*, sourceToken*/,
    });
  }
);

export const fetchMedia = createAsyncThunk(
  "medias/fetchMedia",
  async ({ mediaId }, { getState }) => {
    const { token } = getState().auth;
    const response = await api.getMedia({
      token,
      mediaId,
    });
    return response;
  }
);

export const saveMedia = createAsyncThunk(
  "medias/saveMedia",
  async (
    {
      id,
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
      logo,
      logoPosition,
      logoSize,
      width,
      height,
      languages,
    },
    { dispatch, getState }
  ) => {
    const lng = getLanguage();
    const { token, navCommunity } = getState().auth;
    return api.saveMedia({
      token,
      lng,
      id,
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
      community: navCommunity,
      onProgress,
      tags,
      creator,
      taggedUsers,
      isPrivate,
      inTheNews,
      mediaStatus,
      csScope,
      overrideMainImage,
      docType,
      mask,
      logo,
      logoPosition,
      logoSize,
      width,
      height,
      languages,
    });
  }
);
