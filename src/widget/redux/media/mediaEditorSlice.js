import { createSlice } from "@reduxjs/toolkit";
import { fetchMedia } from "./mediasThunk";

const initialState = {
  fetching: false,
  isOpen: false,
  currentMedia: null,
  keepValues: false,
  title: "",
  titleEN: "",
  titleNL: "",
  titleFR: "",
  descriptionFR: "",
  descriptionEN: "",
  descriptionNL: "",
  altFR: "",
  altEN: "",
  altNL: "",
  copyrightFR: "",
  copyrightEN: "",
  copyrightNL: "",
  tags: [],
  creator: null,
  taggedUsers: [],
  isPrivate: false,
  inTheNews: false,
  mediaStatus: "DRAFT",
  csScope: "INTRA_SHARE",
  languages: ["FR", "NL", "EN"].sort(),
};

export const mediaEditorSlice = createSlice({
  name: "mediaEditor",
  initialState,
  reducers: {
    closeMediaEditor: (state) => {
      return initialState;
    },
    setMediaEditor: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
    openMediaEditor: (state, { payload }) => {
      const media = payload;
      state.currentMedia = media;
      state.isOpen = true;
      state.titleFR = media.titleFr || "";
      state.titleEN = media.titleEn || "";
      state.titleNL = media.titleNl || "";
      state.descriptionFR = media.descriptionFr || "";
      state.descriptionEN = media.descriptionEn || "";
      state.descriptionNL = media.descriptionNl || "";
      state.altFR = media.altFr || "";
      state.altEN = media.altEn || "";
      state.altNL = media.altNl || "";
      state.copyrightFR = media.copyrightFr || "";
      state.copyrightEN = media.copyrightEn || "";
      state.copyrightNL = media.copyrightNl || "";
      state.tags = media.tags || [];
      state.creator = media.creator;
      state.taggedUsers = media.taggedUsers || [];
      state.mediaStatus = media.mediaStatus;
      state.csScope = media.csScope;
      state.isPrivate = media.isPrivate;
      state.inTheNews = media.inTheNews;
      state.languages = media.languages
        ? media.languages.split(",").sort()
        : ["FR", "NL", "EN"].sort();
    },
  },
  extraReducers: {
    [fetchMedia.pending]: (state, action) => {
      state.fetching = true;
    },
    [fetchMedia.fulfilled]: (state, { payload }) => {
      const media = payload.data.data[0];
      state.currentMedia = media;
      state.titleFR = media.titleFr || "";
      state.titleEN = media.titleEn || "";
      state.titleNL = media.titleNl || "";
      state.descriptionFR = media.descriptionFr || "";
      state.descriptionEN = media.descriptionEn || "";
      state.descriptionNL = media.descriptionNl || "";
      state.altFR = media.altFr || "";
      state.altEN = media.altEn || "";
      state.altNL = media.altNl || "";
      state.copyrightFR = media.copyrightFr || "";
      state.copyrightEN = media.copyrightEn || "";
      state.copyrightNL = media.copyrightNl || "";
      state.tags = media.tags || [];
      state.creator = media.creator;
      state.taggedUsers = media.taggedUsers || [];
      state.mediaStatus = media.mediaStatus;
      state.csScope = media.csScope;
      state.isPrivate = media.isPrivate;
      state.inTheNews = media.inTheNews;
      state.languages = media.languages
        ? media.languages.split(",").sort()
        : ["FR", "NL", "EN"].sort();

      state.fetching = false;
    },
    [fetchMedia.rejected]: (state, { payload }) => {
      return initialState;
    },
  },
});

export const { closeMediaEditor, openMediaEditor, setMediaEditor } =
  mediaEditorSlice.actions;

export default mediaEditorSlice.reducer;
