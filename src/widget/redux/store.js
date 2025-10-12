import { configureStore, combineSlices } from "@reduxjs/toolkit";
// import mediasReducer from "./media/mediasSlice";
import articlesReducer from "./article/articlesSlice";
import categoriesReducer from "./article/categoriesSlice";
import typesReducer from "./article/typesSlice";
import themesReducer from "./article/themesSlice";
import tagsReducer from "./article/tagsSlice";
// import usersReducer from "./article/usersSlice";
import authReducer from "./auth/authSlice";
import paramsSlice from "./param/paramsSlice";
// import mediaViewerReducer from "./media/mediaViewerSlice";
// import mediaEditorReducer from "./media/mediaEditorSlice";
import tamtamitReducer from "./article/tamtamitSlice";

// import filterReducer from "./media/filterSlice";

export default configureStore({
  reducer: combineSlices({
    // medias: mediasReducer,
    articles: articlesReducer,
    categories: categoriesReducer,
    types: typesReducer,
    themes: themesReducer,
    tags: tagsReducer,
    // users: usersReducer,
    auth: authReducer,
    params: paramsSlice,
    // mediaViewer: mediaViewerReducer,
    // mediaEditor: mediaEditorReducer,
    tamtamit: tamtamitReducer,
  }),
});

// export default configureStore({
//   middleware: getDefaultMiddleware({
//     serializableCheck: {
//       ignoredActions: [
//         "medias/fetchMedias/fulfilled",
//         "medias/addUploadingMedias",
//         "medias/setUploadingMedias",
//         "themes/fetchThemes/fulfilled",
//         "themes/saveTheme/fulfilled",
//         "types/fetchTypes/fulfilled",
//         "categories/fetchCategories/fulfilled",
//         "articles/saveArticle/fulfilled",
//         "articles/uploadTmpMedia/fulfilled",
//         "articles/fetchArticle/fulfilled",
//         "articles/fetchTranslateArticle/fulfilled",
//         "articles/fetchTranslateArticleNoContent/fulfilled",
//         "articles/fetchGeneratedArticle/fulfilled",
//         "articles/fetchTitleIA/fulfilled",
//         "tags/fetchArticleTags/fulfilled",
//       ],
//     },
//   }),
//   reducer: {
//     // medias: mediasReducer,
//     // articles: articlesReducer,
//     // categories: categoriesReducer,
//     // types: typesReducer,
//     // themes: themesReducer,
//     // tags: tagsReducer,
//     // users: usersReducer,
//     auth: authReducer,
//     params: paramsSlice,
//     // mediaViewer: mediaViewerReducer,
//     // mediaEditor: mediaEditorReducer,
//     // tamtamit: tamtamitReducer,
//   },
// });
