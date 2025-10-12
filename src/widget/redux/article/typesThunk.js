import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const fetchTypes = createAsyncThunk(
  "types/fetchTypes",
  async ({ language }, { dispatch, getState }) => {
    const { token } = getState().auth;
    const response = await api.getTypes({
      token,
      language,
    });
    return response;
  }
);
