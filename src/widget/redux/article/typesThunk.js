import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const fetchTypes = createAsyncThunk(
  "types/fetchTypes",
  async ({ language }, { dispatch, getState }) => {
    const { token } = getState().auth;
    const { ttpApiUrl } = getState().params;
    const response = await api.getTypes({
      ttpApiUrl,
      token,
      language,
    });
    return response;
  }
);
