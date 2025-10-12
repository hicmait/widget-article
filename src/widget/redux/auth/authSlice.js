import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {
    setAuth: (state, { payload }) => {
      return Object.assign({}, payload);
    },
    setAuthUser: (state, action) => {
      if (state.user) {
        state.user = action.payload;
      }
    },
  },
});
export const { setAuth, setAuthUser } = authSlice.actions;
export const selectAuth = (state) => state.auth;
export default authSlice.reducer;
