import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getThemes,
  saveTheme as apiSaveTheme,
  savePage as apiSavePage,
} from "../../api";

export const fetchThemes = createAsyncThunk(
  "themes/fetchThemes",
  async ({ communityId }, { dispatch, getState }) => {
    const { token } = getState().auth;
    const { ttpApiUrl } = getState().params;
    const response = await getThemes({
      token,
      ttpApiUrl,
    });
    return response;
  }
);

export const saveTheme = createAsyncThunk(
  "themes/saveTheme",
  async (data, { dispatch, getState, rejectWithValue }) => {
    const { token } = getState().auth;
    const { ttpApiUrl } = getState().params;
    try {
      const response = await apiSaveTheme(ttpApiUrl, token, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const savePage = createAsyncThunk(
  "themes/savePage",
  async (data, { dispatch, getState, rejectWithValue }) => {
    const { token } = getState().auth;
    const { ttpApiUrl } = getState().params;
    try {
      const response = await apiSavePage(ttpApiUrl, token, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
