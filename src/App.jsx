import { TamtamArticleWidget } from "./widget/components/TamtamArticleWidget";
import { staticAuth } from "./auth.js";
// import "./App.css";

function App() {
  return (
    <>
      <TamtamArticleWidget
        article
        auth={staticAuth}
        ttpApiUrl="http://local.api.tamtam.pro"
      />
    </>
  );
}

export default App;
