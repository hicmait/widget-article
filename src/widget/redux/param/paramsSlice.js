import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "fr",
  community: null,
  ttpApiUrl: "",
};
export const paramsSlice = createSlice({
  name: "params",
  initialState,
  reducers: {
    setLanguage: (state, { payload }) => {
      state.language = payload;
    },
    setCommunity: (state, { payload }) => {
      state.community = payload;
    },
    setTtpApiUrl: (state, { payload }) => {
      state.ttpApiUrl = payload;
    },
  },
});
export const { setLanguage, setCommunity, setTtpApiUrl } = paramsSlice.actions;
export default paramsSlice.reducer;
