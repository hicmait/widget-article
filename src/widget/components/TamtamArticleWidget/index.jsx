import { Provider } from "react-redux";

import store from "../../redux/store";
import { ArticleApp } from "./ArticleApp";

export const TamtamArticleWidget = (props) => {
  return (
    <Provider store={store}>
      <ArticleApp {...props} />
    </Provider>
  );
};
