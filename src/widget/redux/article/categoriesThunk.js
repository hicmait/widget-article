import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ language }, { dispatch, getState }) => {
    const { token } = getState().auth;
    const { ttpApiUrl } = getState().params;
    const response = await api.getCategories({
      token,
      ttpApiUrl,
      language,
    });
    return response;
  }
  //   {
  //     condition: ({ getState, extra }) => {
  //       const { fetching, items } = getState();
  //       if (fetching || items.length > 0) {
  //         return false;
  //       }
  //     },
  //   }
);
