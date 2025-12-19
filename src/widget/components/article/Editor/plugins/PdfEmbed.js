// import * as pdfJs from "pdfjs-dist";
import { pdfjs } from "react-pdf";

// import * as pdfWorker from "pdfjs-dist/build/pdf.worker.mjs";

import _ from "../../../../i18n";
import { uploadTmpMedia } from "../../../../redux/actions";
import { MAX_FILE_SIZE } from "../../../../services/config";

// pdfJs.GlobalWorkerOptions.workerSrc = pdfWorker;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

let isUploadingPDF = false;
const MAX_PAGES = 10;

const handlePDFUpload = async (file, dispatch, auth, ttpApiUrl) => {
  if (isUploadingPDF) {
    return [];
  }

  isUploadingPDF = true;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    const pageCount = pdf.numPages;
    const pageImages = [];

    for (let i = 0; i < pageCount; i++) {
      const page = await pdf.getPage(i + 1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageDataUrl = canvas.toDataURL("image/png");

      // Convert the imageDataUrl to a Blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();

      // Create a new File object
      const fileToUpload = new File([blob], `page-${i + 1}.png`, {
        type: "image/png",
      });

      // Upload the image and get the URL
      const uploadResp = await dispatch(
        uploadTmpMedia({ ttpApiUrl, token: auth.token, data: fileToUpload })
      );
      const url = uploadResp.payload.data.data.url;
      // let url =
      //   "https://s3.tamtam.pro/local/storage/uploads/blog/tmp-media-article/8650/3523f1a7a87d7b3d9e279ea333c86f57a36ee250.png";
      // setTimeout(() => {
      //   url =
      //     "https://s3.tamtam.pro/local/storage/uploads/blog/tmp-media-article/8650/3523f1a7a87d7b3d9e279ea333c86f57a36ee250.png";
      // }, 2000);

      const startsWithHttp = url.lastIndexOf("http://", 0) === 0;
      const startsWithHttps = url.lastIndexOf("https://", 0) === 0;
      const isAbsolute = startsWithHttp || startsWithHttps;
      const imgUrl = isAbsolute ? url : `${ttpApiUrl}/${url}`;
      console.log("aaaaaaa", imgUrl);

      pageImages.push(imgUrl);
    }

    return pageImages;
  } finally {
    isUploadingPDF = false;
  }
};

const PdfEmbed = (dispatch, auth, ttpApiUrl) => ({
  // @Required
  // plugin name
  name: "pdf_embed",

  // @Required
  // data display
  display: "submenu",

  title: "PDF embed",
  buttonClass: "",
  innerHTML:
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve"><defs></defs><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >	<path d="M 24.731 57.127 v -4.129 c 0 -0.444 -0.361 -0.806 -0.806 -0.806 H 20.05 v 5.74 h 3.876 C 24.37 57.933 24.731 57.571 24.731 57.127 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(109,127,146); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 39.841 63.508 V 53.286 c 0 -0.604 -0.491 -1.094 -1.094 -1.094 H 35.16 v 12.41 h 3.587 C 39.351 64.603 39.841 64.111 39.841 63.508 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(109,127,146); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />	<path d="M 81.979 17.233 L 66.215 1.469 C 65.282 0.535 63.99 0 62.67 0 H 20.59 c -2.764 0 -5.013 2.249 -5.013 5.013 v 36.168 h -4.28 c -2.617 0 -4.745 2.084 -4.745 4.646 v 25.139 c 0 2.563 2.128 4.646 4.745 4.646 h 4.28 v 9.374 c 0 2.764 2.249 5.013 5.013 5.013 h 57.844 c 2.764 0 5.013 -2.249 5.013 -5.013 v -64.21 C 83.447 19.438 82.926 18.179 81.979 17.233 z M 18.05 68.603 c -1.104 0 -2 -0.896 -2 -2 v -6.67 v -9.74 c 0 -1.104 0.896 -2 2 -2 h 5.876 c 2.65 0 4.806 2.156 4.806 4.806 v 4.129 c 0 2.649 -2.156 4.806 -4.806 4.806 H 20.05 v 4.67 C 20.05 67.707 19.154 68.603 18.05 68.603 z M 79.447 84.987 c 0 0.559 -0.454 1.013 -1.013 1.013 H 20.59 c -0.559 0 -1.013 -0.454 -1.013 -1.013 v -9.374 h 44.425 c 2.616 0 4.745 -2.084 4.745 -4.646 V 45.828 c 0 -2.562 -2.129 -4.646 -4.745 -4.646 H 19.578 V 5.013 C 19.578 4.454 20.032 4 20.59 4 h 41.328 v 12.784 c 0 2.617 2.129 4.745 4.745 4.745 h 12.784 V 84.987 z M 31.16 66.603 v -16.41 c 0 -1.104 0.896 -2 2 -2 h 5.587 c 2.809 0 5.094 2.285 5.094 5.094 v 10.222 c 0 2.81 -2.285 5.095 -5.094 5.095 H 33.16 C 32.055 68.603 31.16 67.707 31.16 66.603 z M 54.255 56.397 c 1.104 0 2 0.896 2 2 s -0.896 2 -2 2 h -3.686 v 6.205 c 0 1.104 -0.896 2 -2 2 s -2 -0.896 -2 -2 v -16.41 c 0 -1.104 0.896 -2 2 -2 h 8.682 c 1.104 0 2 0.896 2 2 s -0.896 2 -2 2 h -6.682 v 4.205 H 54.255 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(109,127,146); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /></g></svg>',

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
      dispatch: dispatch,
      auth: auth,
      ttpApiUrl: ttpApiUrl,
    };

    // Generate submenu HTML
    // Always bind "core" when calling a plugin function
    let listDiv = this.setSubmenu(core);

    // Input tag caching
    context.articleSubmenu.textElement = listDiv.querySelector("input");

    // Get the upload button and file input
    const uploadPDFBtn = listDiv.querySelector("#uploadPDFBtn");
    const fileInput = listDiv.querySelector("#pdfFileInput");
    const errorDiv = listDiv.querySelector("#fileError");

    // Add event listener for file input to check file size
    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file && file.size > MAX_FILE_SIZE) {
        errorDiv.textContent = `La taille du fichier dépasse la limite de ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB.`;
        errorDiv.style.display = "block";
        uploadPDFBtn.disabled = true;
      } else {
        errorDiv.style.display = "none";
        uploadPDFBtn.disabled = false;
      }
    });

    // Attach the click event listener to the upload button
    uploadPDFBtn.addEventListener("click", async () => {
      const file = fileInput.files[0];
      if (!file) {
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        errorDiv.textContent = `La taille du fichier dépasse la limite de ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB.`;
        errorDiv.style.display = "block";
        return;
      }
      try {
        // Call the onClick function when upload button is clicked
        await this.onClick.call(core);
      } catch (error) {
        console.error("Error uploading PDF file:", error);
      }
    });

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
    const listDiv = core.util.createElement("DIV");
    const maxFileSize = MAX_FILE_SIZE; // Using the imported MAX_FILE_SIZE constant

    listDiv.className = "se-submenu se-list-layer";
    listDiv.innerHTML = `
      <div class="se-list-inner">
        <ul class="se-list-basic" style="width: 230px;">
          <li>
            <div class="se-form-group">
              <input class="se-input-form" type="file" accept=".pdf" id="pdfFileInput" style="border: 1px solid #CCC;" />
            </div>
            <div class="se-form-group">
              <button type="button" class="se-plugin-btn se-tooltip" id="uploadPDFBtn">${_(
                "article.upload_pdf"
              )}</button>
            </div>
            <div id="fileError" style="color: red; display: none;"></div>
          </li>
        </ul>
      </div>`;

    // Add event listeners for file input and upload button
    const fileInput = listDiv.querySelector("#pdfFileInput");
    const uploadButton = listDiv.querySelector("#uploadPDFBtn");
    const errorDiv = listDiv.querySelector("#fileError");

    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file && file.size > maxFileSize) {
        errorDiv.textContent = `La taille du fichier dépasse la limite de ${
          maxFileSize / (1024 * 1024)
        }MB.`;
        errorDiv.style.display = "block";
        uploadButton.disabled = true;
      } else {
        errorDiv.style.display = "none";
        uploadButton.disabled = false;
      }
    });

    return listDiv;
  },

  // @Override submenu
  // Called after the submenu has been rendered
  on: function () {
    this.context.articleSubmenu.textElement.focus();
  },

  onClick: async function () {
    const context = this.context;
    const { dispatch, auth, ttpApiUrl } = context.articleSubmenu;

    const fileInput = document.getElementById("pdfFileInput");
    const file = fileInput.files[0];
    const errorDiv = document.getElementById("fileError");

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      errorDiv.textContent = `La taille du fichier dépasse la limite de ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB.`;
      errorDiv.style.display = "block";
      return;
    }

    this.functions.core.showLoading();

    try {
      document
        .getElementById("uploadPDFBtn")
        .removeEventListener("click", this.onClick);

      const pageImages = await handlePDFUpload(file, dispatch, auth, ttpApiUrl);

      this.functions.core.closeLoading();
      // const selection = document.getSelection();
      // const range = selection.getRangeAt(0);

      for (let imageUrl of pageImages.reverse()) {
        const imgHtml = `<img src="${imageUrl}" style="max-width: 100%; height: auto;" />`;
        const imgElement = document.createElement("div");
        imgElement.innerHTML = imgHtml;
        this.functions.insertHTML(imgElement, true);

        // range.insertNode(imgElement);
      }

      // selection.removeAllRanges();
      // selection.addRange(range);

      fileInput.value = "";
      errorDiv.style.display = "none";
      document.querySelector(".se-submenu").style.display = "none";
    } catch (error) {
      console.error("Error uploading PDF file:", error);
      errorDiv.textContent = "An error occurred while uploading the PDF file.";
      errorDiv.style.display = "block";
      this.functions.core.closeLoading();
    } finally {
      // Re-attach the click event listener
      document
        .getElementById("uploadPDFBtn")
        .addEventListener("click", this.onClick.bind(this));
    }
  },
});

export default PdfEmbed;
