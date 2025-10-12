import { createSlice } from "@reduxjs/toolkit";
import { fetchTypes } from "./typesThunk";

const initialState = {
  fetching: false,
  fetched: false,
  items: [],
  error: null,
};

export const typesSlice = createSlice({
  name: "types",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchTypes.pending, (state, action) => {
      state.fetching = true;
    });
    builder.addCase(fetchTypes.fulfilled, (state, action) => {
      state.fetching = false;
      state.items = action.payload.data.data;
    });
    builder.addCase(fetchTypes.rejected, (state, action) => {
      state.error = action.payload;
      state.fetching = false;
      state.items = [];
    });
  },
});

export default typesSlice.reducer;
