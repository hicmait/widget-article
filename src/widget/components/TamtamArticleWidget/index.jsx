import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import store from "../../redux/store";
import { ArticleApp } from "./ArticleApp";

export const TamtamArticleWidget = (props) => {
  return (
    <Provider store={store}>
      <ArticleApp {...props} />
      <ToastContainer theme="colored" />
    </Provider>
  );
};
