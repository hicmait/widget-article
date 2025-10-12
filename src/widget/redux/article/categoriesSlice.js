import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "./categoriesThunk";

const initialState = {
  fetching: false,
  fetched: false,
  items: [],
  currentRequestId: undefined,
  error: null,
};

export const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state, action) => {
      state.fetching = true;
      state.currentRequestId = action.meta.requestId;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.fetching = false;
      state.items = action.payload.data.data;
      state.currentRequestId = undefined;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.error = action.payload;
      state.fetching = false;
      state.items = [];
      state.currentRequestId = undefined;
    });
  },
});

export default categoriesSlice.reducer;
