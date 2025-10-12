import store from "../redux/store";
import mediaEn from "./media/en";
import mediaFr from "./media/fr";
import mediaNl from "./media/nl";
import articleEn from "./article/en";
import articleFr from "./article/fr";
import articleNl from "./article/nl";

export const messages = {
  en: {
    media: mediaEn,
    article: articleEn,
  },
  fr: {
    media: mediaFr,
    article: articleFr,
  },
  nl: {
    media: mediaNl,
    article: articleNl,
  },
};

export default function _(index) {
  const state = store.getState();
  let lng = state.params.language;
  let arr = index.split(".");
  let module = arr.shift();
  let id = arr.length ? arr[0] : index;

  if (!lng) {
    // return id;
    lng = "en";
  }

  return messages[lng][module] &&
    messages[lng][module][id] &&
    0 !== messages[lng][module][id].length
    ? messages[lng][module][id]
    : id;
}
