import { createSlice } from "@reduxjs/toolkit";
import { fetchThemes, saveTheme, savePage } from "./themesThunk";

const initialState = {
  fetching: false,
  fetched: false,
  items: [],
  currentLanguage: "",
  error: null,
  isSaving: false,
  pageIsSaving: false,
};

export const themesSlice = createSlice({
  name: "themes",
  initialState,
  reducers: {
    setThemeCurrentLanguage: (state, { payload }) => {
      state.currentLanguage = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchThemes.pending, (state, action) => {
      state.fetching = true;
    });
    builder.addCase(fetchThemes.fulfilled, (state, action) => {
      state.fetching = false;
      state.items = action.payload.data.data;
    });
    builder.addCase(fetchThemes.rejected, (state, action) => {
      state.error = action.payload;
      state.fetching = false;
      state.items = [];
    });
    builder.addCase(saveTheme.pending, (state, action) => {
      state.isSaving = true;
    });
    builder.addCase(saveTheme.fulfilled, (state, action) => {
      state.isSaving = false;
      state.error = null;
      if (action.payload.data.data.language === state.currentLanguage) {
        state.items.push(action.payload.data.data);
      }
    });
    builder.addCase(saveTheme.rejected, (state, action) => {
      state.error = action.payload.title;
      state.isSaving = false;
    });

    builder.addCase(savePage.pending, (state, action) => {
      state.pageIsSaving = true;
    });
    builder.addCase(savePage.fulfilled, (state, action) => {
      state.pageIsSaving = false;
      state.error = null;
      const page = action.payload.data.data;
      state.items = state.items.map((theme) => {
        if (theme.id === page.themeId) {
          if (theme.pages === undefined) {
            theme.pages = [];
          }
          theme.pages.push(page);
        }
        return theme;
      });
    });
    builder.addCase(savePage.rejected, (state, action) => {
      state.error = action.payload.title;
      state.pageIsSaving = false;
    });
  },
});

export const { setThemeCurrentLanguage } = themesSlice.actions;

export default themesSlice.reducer;
