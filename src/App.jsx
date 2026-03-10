import { TamtamArticleWidget } from "./widget/components/TamtamArticleWidget";
import { staticAuth } from "./auth.js";
// import "./App.css";

function App() {
  return (
    <>
      <button onClick={() => window.showEditArticle(24959)}>
        Edit Article 24959
      </button>
      <button onClick={() => window.showTranslateArticle(3497, "nl")}>
        Translate article 3497
      </button>
      <button onClick={() => window.showEditArticle(24965)}>
        Edit Article 24965
      </button>

      <TamtamArticleWidget
        article
        auth={staticAuth}
        ttpApiUrl="http://local.api.tamtam.pro"
        ttpAiUrl="https://ai.staging.tamtam.pro"
        env="local"
      />
    </>
  );
}

export default App;
