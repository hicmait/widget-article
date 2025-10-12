import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const fetchAvatarsAndAuthors = createAsyncThunk(
  "users/fetchAvatarsAndAuthors",
  async (
    { word = "", communityId = null, usersOnly = false },
    { dispatch, getState }
  ) => {
    const { token } = getState().auth;
    const response = await api.getAvatarsAndAuthors({
      token,
      word,
      organizationId: communityId,
      usersOnly,
    });
    return response;
  }
);

export const fetchAuthors = createAsyncThunk(
  "users/fetchAuthors",
  async ({ word = "", communityId = null }, { dispatch, getState }) => {
    const { token } = getState().auth;
    const response = await api.getAvatarsAndAuthors({
      token,
      word,
      organizationId: communityId,
      usersOnly: true,
    });
    return response;
  }
);
