import store from "../../../../redux/store";
import _ from "../../../../i18n";
import * as action from "../../../../redux/actions";

const GenerateArticleWithAI = async (dispatch, content) => {
  if (!content) return;

  return dispatch(
    action.fetchGeneratedArticle({
      content: content,
    })
  );
};

const renderArticle = (article, lng) => {
  // const { title, organization, category, main_media, isExternal } = article;
  // const categoryName = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  // const currentArticleUrl = "#"; // You might want to generate a proper URL
  // // prettier-ignore
  // let str = `<div class="article-embed-img" style="background-image: url('${imageSrc}')"></div><div class="article-embed-tmpl"><span class="article-embed-cat" style="background: ${category.colorCode}">${category[categoryName]}</span><span class="article-embed-com" style="border-left-color: ${category.colorCode}">${organization.abbreviation}</span>${isExternal ? `<a href="${currentArticleUrl}" target="_blank" rel="noreferrer" class="title">${title}</a>`: `<a href="${currentArticleUrl}" target="_blank" class="title">${title}</a>`}</div>`;
  // // prettier-ignore
  // return `<div class="se-component se-article-embed __se__uneditable" contenteditable="false" data-src=${encodeURIComponent(str)}>${str}</div>`;
};

const ArticleSuggestionEmbed = (dispatch) => ({
  // @Required
  // plugin name
  name: "ArticleSuggestion",

  // @Required
  // data display
  display: "submenu",

  title: "Article Suggestion",
  buttonClass: "",
  innerHTML:
    '<svg height="2500" viewBox="-1 -.1 949.1 959.8" width="2474" xmlns="http://www.w3.org/2000/svg"><path d="m925.8 456.3c10.4 23.2 17 48 19.7 73.3 2.6 25.3 1.3 50.9-4.1 75.8-5.3 24.9-14.5 48.8-27.3 70.8-8.4 14.7-18.3 28.5-29.7 41.2-11.3 12.6-23.9 24-37.6 34-13.8 10-28.5 18.4-44.1 25.3-15.5 6.8-31.7 12-48.3 15.4-7.8 24.2-19.4 47.1-34.4 67.7-14.9 20.6-33 38.7-53.6 53.6-20.6 15-43.4 26.6-67.6 34.4-24.2 7.9-49.5 11.8-75 11.8-16.9.1-33.9-1.7-50.5-5.1-16.5-3.5-32.7-8.8-48.2-15.7s-30.2-15.5-43.9-25.5c-13.6-10-26.2-21.5-37.4-34.2-25 5.4-50.6 6.7-75.9 4.1-25.3-2.7-50.1-9.3-73.4-19.7-23.2-10.3-44.7-24.3-63.6-41.4s-35-37.1-47.7-59.1c-8.5-14.7-15.5-30.2-20.8-46.3s-8.8-32.7-10.6-49.6c-1.8-16.8-1.7-33.8.1-50.7 1.8-16.8 5.5-33.4 10.8-49.5-17-18.9-31-40.4-41.4-63.6-10.3-23.3-17-48-19.6-73.3-2.7-25.3-1.3-50.9 4-75.8s14.5-48.8 27.3-70.8c8.4-14.7 18.3-28.6 29.6-41.2s24-24 37.7-34 28.5-18.5 44-25.3c15.6-6.9 31.8-12 48.4-15.4 7.8-24.3 19.4-47.1 34.3-67.7 15-20.6 33.1-38.7 53.7-53.7 20.6-14.9 43.4-26.5 67.6-34.4 24.2-7.8 49.5-11.8 75-11.7 16.9-.1 33.9 1.6 50.5 5.1s32.8 8.7 48.3 15.6c15.5 7 30.2 15.5 43.9 25.5 13.7 10.1 26.3 21.5 37.5 34.2 24.9-5.3 50.5-6.6 75.8-4s50 9.3 73.3 19.6c23.2 10.4 44.7 24.3 63.6 41.4 18.9 17 35 36.9 47.7 59 8.5 14.6 15.5 30.1 20.8 46.3 5.3 16.1 8.9 32.7 10.6 49.6 1.8 16.9 1.8 33.9-.1 50.8-1.8 16.9-5.5 33.5-10.8 49.6 17.1 18.9 31 40.3 41.4 63.6zm-333.2 426.9c21.8-9 41.6-22.3 58.3-39s30-36.5 39-58.4c9-21.8 13.7-45.2 13.7-68.8v-223q-.1-.3-.2-.7-.1-.3-.3-.6-.2-.3-.5-.5-.3-.3-.6-.4l-80.7-46.6v269.4c0 2.7-.4 5.5-1.1 8.1-.7 2.7-1.7 5.2-3.1 7.6s-3 4.6-5 6.5a32.1 32.1 0 0 1 -6.5 5l-191.1 110.3c-1.6 1-4.3 2.4-5.7 3.2 7.9 6.7 16.5 12.6 25.5 17.8 9.1 5.2 18.5 9.6 28.3 13.2 9.8 3.5 19.9 6.2 30.1 8 10.3 1.8 20.7 2.7 31.1 2.7 23.6 0 47-4.7 68.8-13.8zm-455.1-151.4c11.9 20.5 27.6 38.3 46.3 52.7 18.8 14.4 40.1 24.9 62.9 31s46.6 7.7 70 4.6 45.9-10.7 66.4-22.5l193.2-111.5.5-.5q.2-.2.3-.6.2-.3.3-.6v-94l-233.2 134.9c-2.4 1.4-4.9 2.4-7.5 3.2-2.7.7-5.4 1-8.2 1-2.7 0-5.4-.3-8.1-1-2.6-.8-5.2-1.8-7.6-3.2l-191.1-110.4c-1.7-1-4.2-2.5-5.6-3.4-1.8 10.3-2.7 20.7-2.7 31.1s1 20.8 2.8 31.1c1.8 10.2 4.6 20.3 8.1 30.1 3.6 9.8 8 19.2 13.2 28.2zm-50.2-417c-11.8 20.5-19.4 43.1-22.5 66.5s-1.5 47.1 4.6 70c6.1 22.8 16.6 44.1 31 62.9 14.4 18.7 32.3 34.4 52.7 46.2l193.1 111.6q.3.1.7.2h.7q.4 0 .7-.2.3-.1.6-.3l81-46.8-233.2-134.6c-2.3-1.4-4.5-3.1-6.5-5a32.1 32.1 0 0 1 -5-6.5c-1.3-2.4-2.4-4.9-3.1-7.6-.7-2.6-1.1-5.3-1-8.1v-227.1c-9.8 3.6-19.3 8-28.3 13.2-9 5.3-17.5 11.3-25.5 18-7.9 6.7-15.3 14.1-22 22.1-6.7 7.9-12.6 16.5-17.8 25.5zm663.3 154.4c2.4 1.4 4.6 3 6.6 5 1.9 1.9 3.6 4.1 5 6.5 1.3 2.4 2.4 5 3.1 7.6.6 2.7 1 5.4.9 8.2v227.1c32.1-11.8 60.1-32.5 80.8-59.7 20.8-27.2 33.3-59.7 36.2-93.7s-3.9-68.2-19.7-98.5-39.9-55.5-69.5-72.5l-193.1-111.6q-.3-.1-.7-.2h-.7q-.3.1-.7.2-.3.1-.6.3l-80.6 46.6 233.2 134.7zm80.5-121h-.1v.1zm-.1-.1c5.8-33.6 1.9-68.2-11.3-99.7-13.1-31.5-35-58.6-63-78.2-28-19.5-61-30.7-95.1-32.2-34.2-1.4-68 6.9-97.6 23.9l-193.1 111.5q-.3.2-.5.5l-.4.6q-.1.3-.2.7-.1.3-.1.7v93.2l233.2-134.7c2.4-1.4 5-2.4 7.6-3.2 2.7-.7 5.4-1 8.1-1 2.8 0 5.5.3 8.2 1 2.6.8 5.1 1.8 7.5 3.2l191.1 110.4c1.7 1 4.2 2.4 5.6 3.3zm-505.3-103.2c0-2.7.4-5.4 1.1-8.1.7-2.6 1.7-5.2 3.1-7.6 1.4-2.3 3-4.5 5-6.5 1.9-1.9 4.1-3.6 6.5-4.9l191.1-110.3c1.8-1.1 4.3-2.5 5.7-3.2-26.2-21.9-58.2-35.9-92.1-40.2-33.9-4.4-68.3 1-99.2 15.5-31 14.5-57.2 37.6-75.5 66.4-18.3 28.9-28 62.3-28 96.5v223q.1.4.2.7.1.3.3.6.2.3.5.6.2.2.6.4l80.7 46.6zm43.8 294.7 103.9 60 103.9-60v-119.9l-103.8-60-103.9 60z"/></svg>',

  // @Required
  // add function - It is called only once when the plugin is first run.
  // This function generates HTML to append and register the event.
  // arguments - (core : core object, targetElement : clicked button element)
  add: function (core, targetElement) {
    // @Required
    // Registering a namespace for caching as a plugin name in the context object
    const context = core.context;
    context.articleSubmenu = {
      targetButton: targetElement,
      textElement: null,
      currentSpan: null,
    };

    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu(core);

    // Input tag caching
    context.articleSubmenu.textElement = listDiv.querySelector("input");

    // You must bind "core" object when registering an event.
    /** add event listeners */
    listDiv
      .querySelector(".custom-button")
      .addEventListener("click", this.onClick.bind(core));

    // @Required
    // You must add the "submenu" element using the "core.initMenuTarget" method.
    /** append target button menu */
    core.initMenuTarget(this.name, targetElement, listDiv);
  },

  /**
   * @Override core - managedTagsInfo
   */
  managedTags: function () {
    return {
      className: "se-article-embed",
      method: function (element) {
        if (!element.getAttribute("src")) return;
        let dataSrc = element.getAttribute("src");
        element.setAttribute("data-src", dataSrc);
        element.removeAttribute("src");
        element.innerHTML = decodeURIComponent(dataSrc);
      },
    };
  },
  setSubmenu: function (core) {
    // Create the overlay
    const overlay = document.createElement("div");
    // overlay.className = "popup-overlay";
    const listDiv = core.util.createElement("DIV");
    listDiv.className = "se-submenu se-list-layer custom-popup";
    listDiv.innerHTML = `
    <div class="se-list-inner custom-inner">
        <h2 class="custom-title">Générer un article à partir d'un communiqué de presse</h2>
        <div class="custom-content">
            <textarea class="custom-textarea" placeholder="Collez votre communiqué de presse ici"></textarea>
            <div class="button-container">
                <button type="button" class=" custom-button ">${_(
                  "article.quote_create"
                )}</button>
            </div>
        </div>
    </div>`;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
    body .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5) !important;
      z-index: 99998 !important;
      }
    .custom-separator {
      border: none;
      height: 1px;
      background-color: #e0e0e0;
      margin: 15px 0;
  }
    body .custom-popup {
        background-color: #f8f9fa;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 30px;
        width: 800px;
        height: 400px !important;
        max-width: 90vw;
        display: flex;
        flex-direction: column;
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 2147483647 !important;
        isolation: isolate;
        transform: translateZ(0);

    }
    .custom-inner {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 15px !important;
    }
    .custom-title {
        color: #333;
        font-size: 24px;
        margin-bottom: 20px;
        text-align: center;
    }
    .custom-content {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
    .custom-textarea {
        border: 1px solid #ced4da !important;
        border-radius: 4px;
        font-size: 18px;
        flex-grow: 1;
        padding: 15px !important;
        resize: none;
        margin: 10px 0 !important;
    }
    .button-container {
        margin-top: 2px !important;
        display: flex;
        justify-content: flex-end;
    }
    .custom-button {
        border: 1px solid #18a0fb !important;
        cursor: pointer;
        font-size: 18px !important;
        height: 40px;
        padding: 12px 20px;
        transition: background-color 0.3s;
        width: 150px !important;
        color: #fff !important;
        border-radius: 5px !important;
        background: #18a0fb linear-gradient(180deg, #3baefc, #18a0fb) repeat-x !important;
    }
    .custom-button:hover {
        background-color: #0056b3;
    }
    `;

    // Append the style to the document head
    document.head.appendChild(style);

    // Remove any existing overlays or popups
    const existingOverlay = document.querySelector(".popup-overlay");
    const existingPopup = document.querySelector(".custom-popup");
    if (existingOverlay) existingOverlay.remove();
    if (existingPopup) existingPopup.remove();

    // Append the new overlay and popup
    document.body.appendChild(overlay);
    document.body.appendChild(listDiv);

    function showPopup() {
      overlay.style.display = "block";
      requestAnimationFrame(() => {
        listDiv.style.display = "flex";
        listDiv.style.zIndex = "2147483647";
        document.body.appendChild(listDiv);
      });
    }

    function hidePopup() {
      overlay.style.display = "none";
      listDiv.style.display = "none";
      document.body.style.overflow = "";

      // Show other overlays again
      const otherOverlays = document.querySelectorAll(
        ".ReactModal_Overlay, .modal-backdrop"
      );
      otherOverlays.forEach((overlay) => (overlay.style.display = ""));
    }
    // Example: Show popup when a button is clicked
    const showButton = document.getElementById("showPopupButton");
    if (showButton) {
      showButton.addEventListener("click", showPopup);
    }

    // Hide popup when clicking outside
    overlay.addEventListener("click", hidePopup);

    // Prevent hiding when clicking inside the popup
    listDiv.addEventListener("click", (e) => e.stopPropagation());

    const textElement = listDiv.querySelector("textarea");
    const buttonElement = listDiv.querySelector("button");

    textElement.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value =
          this.value.substring(0, start) + "\n" + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 1;
      }
    });

    buttonElement.addEventListener("click", this.onClick.bind(core));

    // Store the listDiv for later use
    if (!core.context) core.context = {};
    core.context.articleSubmenu = listDiv;

    return listDiv;
  },

  on: function (core) {
    if (core && core.context && core.context.articleSubmenu) {
      const textElement = core.context.articleSubmenu.querySelector("textarea");
      if (textElement) {
        textElement.focus();
      }
    } else {
      console.warn("Article submenu context not properly initialized");
    }
  },

  onClick: async function () {
    const core = this; // 'this' will be the core object when called correctly

    if (!core || !core.context || !core.context.articleSubmenu) {
      console.error("Core context not properly initialized");
      return;
    }

    const textElement = core.context.articleSubmenu.querySelector("textarea");
    if (!textElement) {
      console.error("Text element not found");
      return;
    }

    const value = textElement.value.trim();
    if (!value) return;

    core.showLoading();
    const state = store.getState();
    const token = state.auth?.token;
    try {
      const response = await GenerateArticleWithAI(dispatch, value);
      core.closeLoading();
      if (response && response.payload) {
        const generatedArticle = response.payload.data.data;
        core.functions.insertHTML(`${generatedArticle.content}`, true);
      }
      textElement.value = "";
      core.submenuOff();
    } catch (e) {
      console.error("Error generating article:", e);
      core.closeLoading();
    }
  },
});

export default ArticleSuggestionEmbed;
