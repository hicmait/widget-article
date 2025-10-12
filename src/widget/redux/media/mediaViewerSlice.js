import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  currentMedia: null,
};

export const mediaViewerSlice = createSlice({
  name: "mediaViewer",
  initialState,
  reducers: {
    closeMediaViewer: (state) => {
      return initialState;
    },
    openMediaViewer: (state) => {
      state.isOpen = true;
    },
    setCurrentMedia: (state, { payload }) => {
      state.currentMedia = payload;
    },
  },
});

export const {
  closeMediaViewer,
  openMediaViewer,
  setCurrentMedia,
} = mediaViewerSlice.actions;

export default mediaViewerSlice.reducer;
