import { TamtamArticleWidget } from "./widget/components/TamtamArticleWidget";
import { staticAuth } from "./auth.js";
// import "./App.css";

function App() {
  return (
    <>
      <button onClick={() => window.showEditArticle(24959)}>
        Edit Article 24959
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
