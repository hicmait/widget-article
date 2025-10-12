import { createSlice } from "@reduxjs/toolkit";
import { fetchTags, fetchArticleTags } from "./tagsThunk";

const initialState = {
  fetching: false,
  fetched: false,
  items: [],
  tags: [],
  moreTags: [],
  allowFetchTags: true,
  error: null,
};

export const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setArticleTags: (state, { payload }) => {
      state.moreTags = payload;
    },
    resetArticleTags: (state) => {
      state.moreTags = [];
    },
    setAllowFetchTags: (state, { payload }) => {
      state.allowFetchTags = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state, action) => {
      state.fetching = true;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.fetching = false;
      state.items = action.payload.data.data;
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.error = action.payload;
      state.fetching = false;
      state.items = [];
    });
    builder.addCase(fetchArticleTags.pending, (state, action) => {
      state.fetching = true;
    });
    builder.addCase(fetchArticleTags.fulfilled, (state, action) => {
      state.fetching = false;
      const data = action.payload.data.data;
      let moreTags = [];
      if (data) {
        const length = data.length;
        if (length < 8) {
          state.tags = data.map((tag) => {
            const tab = { label: tag.name, name: tag.name, value: tag.id };
            if (tag.superTag) {
              tab.superTag = tag.superTag;
            }
            return tab;
          });
        } else {
          let tags = [];
          for (let i = 0; i < 7; i++) {
            tags.push({
              label: data[i].name,
              name: data[i].name,
              value: data[i].id,
            });
          }
          for (let i = 7; i < length; i++) {
            moreTags.push({
              label: data[i].name,
              name: data[i].name,
              value: data[i].id,
            });
          }
          state.tags = tags;
        }
      }
      state.moreTags = moreTags;
    });
    builder.addCase(fetchArticleTags.rejected, (state, action) => {
      state.error = action.payload;
      state.fetching = false;
      state.tags = [];
      state.moreTags = [];
    });
  },
});

export const { resetArticleTags, setAllowFetchTags, setArticleTags } =
  tagsSlice.actions;

export default tagsSlice.reducer;
