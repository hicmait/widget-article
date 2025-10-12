import { createSlice } from "@reduxjs/toolkit";

import { persistTamtamIt, persistShareTamtamIt } from "./tamtamitThunk";

const initialState = {
  openedModal: false,
  fetching: false,
  fetched: false,
  saving: false,
  shareSaving: false,
  error: null,
  themes: [],
  article: {},
};

export const tamtamitSlice = createSlice({
  name: "tamtamit",
  initialState,
  reducers: {
    toggleTamtamitModal: (state) => {
      state.openedModal = !state.openedModal;
    },
    startTamtamit: (state, { payload }) => {
      if (payload) {
        state.shareSaving = true;
      } else {
        state.saving = true;
      }
    },
    stopTamtamit: (state, { payload }) => {
      if (payload) {
        state.shareSaving = false;
      } else {
        state.saving = false;
      }
    },
    setTamtamitArticle: (state, { payload }) => {
      state.article = payload;
    },
  },
  extraReducers: (builder) => {
    // [fetchThemes.pending]: (state) => {
    //   state.themes = [];
    //   state.fetched = false;
    //   state.fetching = true;
    // },
    // [fetchThemes.rejected]: (state, action) => {
    //   let { error } = action;
    //   if (error?.response?.status === 404) {
    //     error = {
    //       title: error.response.data.title,
    //       code: 404,
    //     };
    //   }
    //   state.fetching = false;
    //   state.error = error;
    // },
    // [fetchThemes.fulfilled]: (state, action) => {
    //   const { data, nbResult } = action.payload;
    //   state.themes = data;
    //   state.fetched = true;
    //   state.fetching = false;
    //   state.error = null;
    // },
    builder.addCase(persistTamtamIt.pending, (state, action) => {
      state.article = {};
      state.saving = true;
    });
    builder.addCase(persistTamtamIt.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.article = data;
      state.saving = false;
      state.error = null;
    });
    builder.addCase(persistTamtamIt.rejected, (state, action) => {
      state.error = action.payload;
      state.saving = false;
    });

    builder.addCase(persistShareTamtamIt.pending, (state, action) => {
      state.article = {};
      state.shareSaving = true;
    });
    builder.addCase(persistShareTamtamIt.fulfilled, (state, action) => {
      const { data } = action.payload;
      state.article = data;
      state.shareSaving = false;
      state.error = null;
    });
    builder.addCase(persistShareTamtamIt.rejected, (state, action) => {
      state.error = action.payload;
      state.shareSaving = false;
    });
  },
});

export const {
  toggleTamtamitModal,
  startTamtamit,
  stopTamtamit,
  setTamtamitArticle,
} = tamtamitSlice.actions;

export default tamtamitSlice.reducer;
