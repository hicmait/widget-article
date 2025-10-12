import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  saveTamtamIt,
  apiUploadTmpMedia,
  shareArticleOnSocialNetworks,
} from "../../api";

export const persistShareTamtamIt = createAsyncThunk(
  "tamtamit/persistShareTamtamIt",
  async (feed, { getState, dispatch }) => {
    const { token, user } = getState().auth;

    let data = {
      sharedBy: user.id,
      title: feed.title,
      content: feed.description,
      categoryId: feed.categoryId,
      communityId: feed.communityId,
      tags: feed.tags,
      action: "save",
      status: feed.status,
      media: feed.images,
      pages: feed.pages,
      shortened_url: feed.shortened_url,
      social: feed.social,
      id: feed.id,
      lng: feed.language,
      themeId: feed.themeId,
      publishedAt: feed.publishedAt,
      csScope: feed.scope,
      groups: feed.groups,
    };

    const response = await saveTamtamIt(token, data);
    return response.data;
  }
);

export const persistTamtamIt = createAsyncThunk(
  "tamtamit/persistTamtamIt",
  async (feed, { getState, dispatch }) => {
    const { token, user } = getState().auth;
    let data = {
      sharedBy: user.id,
      title: feed.title,
      content: feed.description,
      categoryId: feed.categoryId,
      communityId: feed.communityId,
      tags: feed.tags,
      action: "save",
      status: feed.status,
      media: feed.images,
      pages: feed.pages,
      shortened_url: feed.shortened_url,
      social: feed.social,
      id: feed.id,
      lng: feed.language,
      themeId: feed.themeId,
      publishedAt: feed.publishedAt,
      csScope: feed.scope,
      groups: feed.groups,
      assignedRedactor: feed.assignedRedactor,
      authors: feed.authors,
    };

    const response = await saveTamtamIt(token, data);
    return response.data;
  }
);

export const tamtamitUploadTmpMedia = createAsyncThunk(
  "tamtamit/tamtamitUploadTmpMedia",
  async (data, { getState }) => {
    const { token } = getState().auth;
    const response = await apiUploadTmpMedia({
      token,
      data,
    });
    return response.data;
  }
);

export const shareOnSocialNetworks = createAsyncThunk(
  "tamtamit/shareOnSocialNetworks",
  async (data, { getState }) => {
    const { token } = getState().auth;
    const response = await shareArticleOnSocialNetworks({
      token,
      data,
    });
    return response.data;
  }
);
