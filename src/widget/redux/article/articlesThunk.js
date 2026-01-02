import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";
export const uploadTmpMedia = createAsyncThunk(
  "articles/uploadTmpMedia",
  async ({ token, ttpApiUrl, data }) => {
    const response = await api.uploadTmpMedia({
      ttpApiUrl,
      token,
      data,
    });
    return response;
  }
);

export const deleteTmpMedias = createAsyncThunk(
  "articles/deleteTmpMedias",
  async (token, { getState }) => {
    const { ttpApiUrl } = getState().params;
    const response = await api.deleteTmpMedias({
      ttpApiUrl,
      token,
    });
    return response;
  }
);

// export const saveArticle = createAsyncThunk(
//   "articles/saveArticle",
//   async (data, { dispatch, getState, rejectWithValue }) => {
//     const { token } = getState().auth;
//     try {
//       const response = await api.saveArticle(token, data);
//       return response;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

export const fetchArticle = createAsyncThunk(
  "articles/fetchArticle",
  async ({ articleId }, { getState }) => {
    const { token } = getState().auth;
    const { ttpApiUrl } = getState().params;
    const response = await api.getArticle({
      ttpApiUrl,
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
    const { ttpApiUrl } = getState().params;
    const response = await api.getArticle({
      ttpApiUrl,
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
    const { ttpAiUrl, ttpApiUrl } = getState().params;

    const articleResponse = await api.getArticle({
      ttpApiUrl,
      token,
      articleId,
    });
    const translationResponse = await api.translateContent({
      ttpAiUrl,
      token,
      content:
        articleResponse.data.data[0].title +
        "~~~~" +
        articleResponse.data.data[0].content,
      translateLanguage,
    });
    if (translationResponse?.data?.content) {
      articleResponse.data.data[0].content = translationResponse.data.content;
    }

    return articleResponse;
  }
);
export const fetchGeneratedArticle = createAsyncThunk(
  "articles/fetchGeneratedArticle",
  async ({ content }, { getState }) => {
    const { token } = getState().auth;
    const { ttpAiUrl, ttpApiUrl } = getState().params;
    const response = await api.GenerateArticleWithAI({
      ttpApiUrl,
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
    const { ttpAiUrl, ttpApiUrl } = getState().params;
    const response = await api.getTitle({
      ttpAiUrl,
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
    const { ttpApiUrl } = getState().params;
    const response = await api.getTag({
      ttpApiUrl,
      token,
      id: tagId,
    });
    return response;
  }
);
