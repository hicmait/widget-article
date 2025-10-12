import { createSlice } from "@reduxjs/toolkit";
import { EditorState } from "draft-js";
import moment from "moment";
// import { saveArticle } from "Redux/article/articlesThunk";
const DATE_FORMAT = "DD-MM-YYYY HH:mm";

const initialState = {
  editorState: EditorState.createEmpty(),
  coverButtons: "ICONS",
  handleCropping: 1,
  coverFile: null,
  yPos: 0,
  yHeight: 0,
  title: "",

  category: null,
  community: "",
  type: null,
  theme: null,
  pages: [],
  selectedLanguage: null,
  selectedScope: null,
  authors: [],
  comment: "",
  status: "DRAFT",
  publishedAt: moment().format(DATE_FORMAT),
  publishOnWorkflow: false,
  attachments: [],
  uploadingAttachment: false,
  tags: [],
};

export const articleEditorSlice = createSlice({
  name: "articleEditor",
  initialState,
  reducers: {
    setMediaEditor: (state, { payload }) => {
      return {
        ...state,
        payload,
      };
    },
  },
});

export const { setMediaEditor } = articleEditorSlice.actions;

export default articleEditorSlice.reducer;
