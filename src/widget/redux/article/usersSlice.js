import { createSlice } from "@reduxjs/toolkit";
import { fetchAvatarsAndAuthors, fetchAuthors } from "./usersThunk";

const initialState = {
  fetching: false,
  fetched: false,
  items: [],
  mixedItems: [],
  fetchingAuthors: false,
  fetchedAuthors: false,
  errorAuthors: false,
  authors: [],
  error: null,
};

export const usersSlice = createSlice({
  name: "types",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchAvatarsAndAuthors.pending, (state, action) => {
      state.fetching = true;
    });
    builder.addCase(fetchAvatarsAndAuthors.fulfilled, (state, action) => {
      state.fetching = false;
      state.mixedItems = getAvatarsAndAuthorsInfos(action.payload.data.data);
    });
    builder.addCase(fetchAvatarsAndAuthors.rejected, (state, action) => {
      state.error = action.payload;
      state.fetching = false;
      state.mixedItems = [];
    });

    builder.addCase(fetchAuthors.pending, (state, action) => {
      state.fetchingAuthors = true;
    });
    builder.addCase(fetchAuthors.fulfilled, (state, action) => {
      state.fetchedAuthors = false;
      state.fetchingAuthors = false;
      state.authors = getAvatarsAndAuthorsInfos(action.payload.data.data);
    });
    builder.addCase(fetchAuthors.rejected, (state, action) => {
      state.errorAuthors = action.payload;
      state.fetchingAuthors = false;
      state.authors = [];
    });
  },
});

function getAvatarsAndAuthorsInfos(data) {
  let result = {
    avatars: data.Chains,
    users: data.Authors.map((author) => {
      let tab = {
        ...author.user,
        isAuthor: true,
        preferences: author.preferences,
      };
      if (author.headlineFr) {
        tab.headlineFr = author.headlineFr;
        tab.headlineNl = author.headlineNl;
        tab.headlineEn = author.headlineEn;
      }

      return tab;

      // let usr = user.defaultSignature
      //   ? {
      //       ...user,
      //       title: user.defaultSignature.title,
      //       header: user.defaultSignature.header,
      //     }
      //   : user.role
      //   ? {
      //       ...user,
      //       title: user.firstName + " " + user.lastName,
      //       header: user.role.function,
      //     }
      //   : { ...user, title: user.firstName + " " + user.lastName };
      // return { ...usr, isAuthor: true };
    }),
  };
  return result;
}

export default usersSlice.reducer;
