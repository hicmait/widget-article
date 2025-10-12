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
    const response = await getThemes({
      token,
    });
    return response;
  }
);

export const saveTheme = createAsyncThunk(
  "themes/saveTheme",
  async (data, { dispatch, getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await apiSaveTheme(token, data);
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
    try {
      const response = await apiSavePage(token, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);
