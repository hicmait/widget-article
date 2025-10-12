import { createSlice } from "@reduxjs/toolkit";
import { fetchMedias, saveMedia } from "./mediasThunk";

const initialState = {
  fetching: false,
  fetched: false,
  deleting: false,
  items: [],
  error: null,
  nbResult: 0,
  paginationPage: 1,
  paginationTotalPages: 1,
  openDeleteConfirm: false,
  openedModal: false,
  checks: [],
  uploadingMedias: [],
  multiSelect: true,
};

export const mediasSlice = createSlice({
  name: "medias",
  initialState,
  reducers: {
    resetMedias: (state) => {
      return initialState;
    },
    disableMultiSelect: (state) => {
      return {
        ...state,
        multiSelect: false,
      };
    },
    toggleMediaModal: (state) => {
      if (state.openedModal) return initialState;
      else state.openedModal = true;
    },
    addUploadingMedias: (state, { payload }) => {
      state.uploadingMedias = state.uploadingMedias.concat(payload);
    },
    setUploadingMedias: (state, { payload }) => {
      state.uploadingMedias = payload;
    },
    toogleSelectMedia: (state, { payload }) => {
      const ids = state.checks.map((media) => media.id);
      if (state.multiSelect) {
        return {
          ...state,
          checks: ids.includes(payload.id)
            ? state.checks.filter((media) => media.id !== payload.id)
            : state.checks.concat([payload]),
        };
      } else {
        return {
          ...state,
          checks: ids.includes(payload.id) ? [] : [payload],
        };
      }
    },
    resetSelectMedias: (state) => {
      state.checks = [];
    },
  },
  extraReducers: {
    [fetchMedias.pending]: (state, action) => {
      state.fetching = true;
    },
    [fetchMedias.fulfilled]: (state, { payload }) => {
      const { data, nbResult } = payload.data;
      state.fetching = false;
      state.items = data;
      state.nbResult = nbResult;
    },
    [fetchMedias.rejected]: (state, { payload }) => {
      state.error = payload;
      state.fetching = false;
      // state.nbResult = 0;
      state.items = [];
    },
    [saveMedia.fulfilled]: (state, { payload }) => {
      const media = payload.data.data;
      state.items = [
        media,
        ...state.items.filter((item) => item.id !== media.id),
      ];
    },
  },
});

export const {
  addUploadingMedias,
  setUploadingMedias,
  resetMedias,
  toggleMediaModal,
  toogleSelectMedia,
  resetSelectMedias,
  disableMultiSelect,
} = mediasSlice.actions;

export const selectMedias = (state) => state.medias;

export default mediasSlice.reducer;
