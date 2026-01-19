import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "fr",
  community: null,
  ttpApiUrl: "",
  ttpAiUrl: "",
  env: "local",
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
    setTtpAiUrl: (state, { payload }) => {
      state.ttpAiUrl = payload;
    },
    setEnv: (state, { payload }) => {
      state.env = payload;
    },
  },
});
export const { setLanguage, setCommunity, setTtpApiUrl, setTtpAiUrl, setEnv } =
  paramsSlice.actions;
export default paramsSlice.reducer;
