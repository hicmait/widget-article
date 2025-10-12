import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";
export const uploadTmpMedia = createAsyncThunk(
  "articles/uploadTmpMedia",
  async ({ token, data }) => {
    const response = await api.uploadTmpMedia({
      token,
      data,
    });
    return response;
  }
);

export const deleteTmpMedias = createAsyncThunk(
  "articles/deleteTmpMedias",
  async (token) => {
    const response = await api.deleteTmpMedias({
      token,
    });
    return response;
  }
);

export const saveArticle = createAsyncThunk(
  "articles/saveArticle",
  async (data, { dispatch, getState, rejectWithValue }) => {
    const { token } = getState().auth;
    try {
      const response = await api.saveArticle(token, data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchArticle = createAsyncThunk(
  "articles/fetchArticle",
  async ({ articleId }, { getState }) => {
    const { token } = getState().auth;
    const response = await api.getArticle({
      token,
      articleId,
    });
    return response;
  }
);

export const fetchTranslateArticleNoContent = createAsyncThunk(
  "articles/fetchTranslateArticleNoContent ",
  async ({ articleId }, { getState }) => {
    const { token } = getState().auth;
    const response = await api.getArticle({
      token,
      articleId,
    });
    return response;
  }
);
export const fetchTranslateArticle = createAsyncThunk(
  "articles/fetchTranslateArticle",
  async ({ articleId, translateLanguage }, { getState }) => {
    const { token } = getState().auth;
    const articleResponse = await api.getArticle({
      token,
      articleId,
    });
    const translationResponse = await api.translateContent({
      token,
      content:
        articleResponse.data.data[0].title +
        "~~~~" +
        articleResponse.data.data[0].content,
      translateLanguage,
    });
    articleResponse.data.data[0].content =
      translationResponse.data.data.translatedText;

    return articleResponse;
  }
);
export const fetchGeneratedArticle = createAsyncThunk(
  "articles/fetchGeneratedArticle",
  async ({ content }, { getState }) => {
    const { token } = getState().auth;
    const response = await api.GenerateArticleWithAI({
      token,
      content,
    });
    return response;
  }
);

export const fetchTitleIA = createAsyncThunk(
  "articles/fetchTitleIA",
  async ({ title }, { getState }) => {
    const { token } = getState().auth;
    const response = await api.getTitle({
      token,
      title,
    });
    return response.data;
  }
);
export const fetchSuperTagTheme = createAsyncThunk(
  "articles/fetchSuperTagTheme",
  async ({ tagId }, { getState }) => {
    const { token } = getState().auth;
    const response = await api.getTag({
      token,
      id: tagId,
    });
    return response;
  }
);
