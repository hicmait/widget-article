import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SunEditor from "suneditor-react";
import plugins from "suneditor/src/plugins";
import "suneditor/dist/css/suneditor.min.css";
import $ from "jquery";
import ReactDropzone from "react-dropzone";
import { toast } from "react-toastify";

// import { ModalConfirm } from "tamtam-components";
import ModalConfirm from "./Modal/ModalConfirm";
import { convertBase64toFile } from "../../../services/utils";
import { IconThreeDots, IconPencil, IconUpload } from "../../common/Icons";
import Button from "../../common/Button";
import TweetEmbed from "../Editor/plugins/TweetEmbed";
import QuoteEmbed from "../Editor/plugins/QuoteEmbed";
import ArticleEmbed from "../Editor/plugins/ArticleEmbed";
import EventEmbed from "../Editor/plugins/EventEmbed";
// import PdfEmbed from "../Editor/plugins/PdfEmbed";
import ArticleSuggestionEmbed from "../Editor/plugins/ArticleSuggetionEmbed";
import Loader from "../../common/Loader";

import {
  toggleMediaModal,
  disableMultiSelect,
  setArticle,
  uploadTmpMedia,
  fetchAvatarsAndAuthors,
  fetchTitleIA,
  setMediaMedia,
} from "../../../redux/actions";
import { MAX_FILE_SIZE } from "../../../services/config";
import { IconCrop } from "../../common/Icons/Editor";
import styles from "./AddArticle.module.scss";
import styless from "./Modal/ModalConfirm.module.scss";

import "../Editor/editor.scss";
import "../Editor/plugins/article.scss";
import "../Editor/plugins/event.scss";
import _ from "../../../i18n";

import AuthorMention from "../Editor/plugins/AuthorMention";

const IMAGE_SIZES = [
  { title: "Square", value: "1:1" },
  { title: "2:1", value: "2:1" },
  { title: "3:2", value: "3:2" },
  { title: "4:3", value: "4:3" },
  { title: "16:9", value: "16:9" },
];
const DEFAULT_CROPPING = "2:1";

export default function EditorTab(props) {
  const coverContainer = useRef();

  const {
    editorRef,
    content,
    setContent,
    initialContent,
    coverButtons,
    setCoverButtons,
    coverFile,
    setCoverFile,
    setImageHasChanged,
    mediaMedia,
    mediaIsAlbum,
    yPos,
    setYPos,
    setYHeight,
    setHandleCropping,
    newContent,
    setNewContent,
  } = props;
  const ttpApiUrl = useSelector((state) => state.params.ttpApiUrl);
  const title = useSelector((state) => state.articles.article.title);
  const community = useSelector((state) => state.articles.article.community);
  const [showAdjuster, setShowAdjuster] = useState(false);
  const [cropping, setCropping] = useState(DEFAULT_CROPPING);
  const [changeCropping, setChangeCropping] = useState(false);
  const [cropSize, setCropSize] = useState(null);
  const [PDFJs, setPDFJs] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showGenerateTitleModal, setSshowGenerateTitleModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [suggestedTitle, setSuggestedTitle] = useState("");

  const [suggestionsPosition, setSuggestionsPosition] = useState({
    top: 0,
    left: 0,
  });

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const dispatchSetArticle = (index, value) => {
    dispatch(setArticle({ index, value }));
  };
  const [suggestionValue, setSuggestionValue] = useState("");
  useEffect(() => {
    if (props.mainMedia) {
      setCoverButtons("EDIT_POSITION");
      setYPos(props.mainMedia ? props.mainMedia.yPos : 0);
      setYHeight(props.mainMedia ? props.mainMedia.yHeight : 0);
      let img = new Image();
      img.onload = function () {
        let height = coverContainer.current.node.childNodes[0].clientHeight;
        let imageHeight = img.height;
        handleYPosForCoverImage(height, imageHeight);
        setImageSize(cropping);
        let editYPos = (props.mainMedia.yPos * height) / -100;
        const cover = coverContainer.current.node;
        const coverImage = cover.querySelector("img");
        coverImage.style.top = editYPos + "px";

        if (changeCropping) {
          setTimeout(() => {
            let coverButtonsHeight = getCoverButtonsHeight();
            let CoverContainerHeight = height;
            let adjYHeight = coverButtonsHeight + CoverContainerHeight;
            document.getElementById("adjuster").style.top = adjYHeight + "px";
            setShowAdjuster(true);
          }, 100);
        }
      };
      img.src = props.mainMedia.fullMediaUrl;
    }
  }, [props.mainMedia]);

  useEffect(() => {
    const blogPreferences =
      (auth.navCommunity && auth.navCommunity.blogPreferences) || {};
    const cropping = blogPreferences.cropping || DEFAULT_CROPPING;
    setCropping(cropping);

    if (
      auth.navCommunity &&
      auth.navCommunity.blogs &&
      auth.navCommunity.blogs.length > 0
    ) {
      if (auth.navCommunity.blogs[0].role === "CHIEF_EDITOR") {
        setChangeCropping(true);
      }
    }

    // import("pdfjs-dist/lib/pdf.js")
    //   .then((PDFJs) => {
    //     setPDFJs(PDFJs);
    //   })
    //   .catch((e) => console.log("An error occurred while loading pdf.js ", e));

    let resizer = document.getElementById("adjuster");
    const initialiseResize = (e) => {
      window.addEventListener("mousemove", startResizing, false);
      window.addEventListener("mouseup", stopResizing, false);
    };
    if (resizer) {
      resizer.addEventListener("mousedown", initialiseResize);
    }
    return () => {
      if (resizer) {
        resizer.removeEventListener("mousedown", initialiseResize);
      }
    };
  }, []);

  useEffect(() => {
    if (newContent.length > 0) {
      // editorRef.current.insertHTML(newContent);
      editorRef.current.setContents(newContent);
      setNewContent("");
    }
  }, [newContent]);

  const stopResizing = (e) => {
    window.removeEventListener("mousemove", startResizing, false);
    window.removeEventListener("mouseup", stopResizing, false);
  };

  const startResizing = (e) => {
    e.preventDefault();

    const cover = coverContainer.current.node;
    const coverImage = cover.querySelector("img");

    var coverRect = cover.getBoundingClientRect();
    var resizer = document.getElementById("adjuster");
    var resizerRect = resizer.getBoundingClientRect();

    let coverButtonsHeight = getCoverButtonsHeight();
    let originHeight = coverImage.offsetHeight;

    let tmpYPos = (yPos * originHeight) / -100;
    let maxYHeight = originHeight + tmpYPos + coverButtonsHeight;

    let newResizerYPos = e.clientY - coverRect.top + coverButtonsHeight;
    if (newResizerYPos > 20) {
      if (newResizerYPos <= maxYHeight) {
        resizer.style.top = newResizerYPos + "px";
        let newCoverHeight = resizerRect.top - coverRect.top;
        setYHeight((100 * Math.abs(newCoverHeight)) / originHeight);
        cover.style.height = newCoverHeight + "px";
      } else if (newResizerYPos > maxYHeight) {
        resizer.style.top = maxYHeight + "px";
        setYHeight(
          (100 * Math.abs(maxYHeight - coverButtonsHeight)) / originHeight
        );
        cover.style.height = maxYHeight - coverButtonsHeight + "px";
      }
    }
  };

  const setImageSize = (size) => {
    const tabSize = size.split(":");
    const resizeWidth = tabSize[0];
    const resizeHeight = tabSize[1];
    const cover = coverContainer.current.node;
    const coverImage = cover.querySelector("img");
    setCropSize(size);

    var resizer = document.getElementById("adjuster");
    let coverButtonsHeight = getCoverButtonsHeight();
    let originHeight = coverImage.offsetHeight;
    let originWidth = coverImage.offsetWidth;

    let newHeight = (originWidth * resizeHeight) / resizeWidth;
    setYHeight((100 * Math.abs(newHeight)) / originHeight);
    cover.style.height = newHeight + "px";
    resizer.style.top = newHeight + coverButtonsHeight + "px";
  };

  const getCoverButtonsHeight = () => {
    if (document.getElementsByClassName("cover-buttons")[0]) {
      return document.getElementsByClassName("cover-buttons")[0].clientHeight;
    }
    return 0;
  };

  const convertPDFtoImageFile = (pdfFile) => {
    if (!PDFJs || !pdfFile) {
      return null;
    }

    let pdfURL = URL.createObjectURL(pdfFile);

    PDFJs.getDocument({ url: pdfURL })
      .then((pdf) => pdf.getPage(1))
      .then((page) => {
        const viewport = page.getViewport(1.5);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderPromise = page.render(renderContext);

        return Promise.all([renderPromise, context]);
      })
      .then(([renderedPage, context]) => {
        const canvas = context.canvas;
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        const base64Img = canvas.toDataURL();
        canvas.remove();

        return Promise.resolve(base64Img);
      })
      .then((preview) => {
        let imageFile = convertBase64toFile(preview);
        imageFile.preview = preview;

        setCoverFile(imageFile);
        setImageHasChanged(true);
        setCoverButtons("EDIT_POSITION");
        setYPos(0);
        setYHeight(0);
        let img = new Image();
        img.onload = function () {
          let height = coverContainer.current.node.childNodes[0].clientHeight;
          let imageHeight = img.height;
          handleYPosForCoverImage(height, imageHeight);
          setImageSize(cropping);
          if (changeCropping) {
            setTimeout(() => {
              let coverButtonsHeight = getCoverButtonsHeight();
              let CoverContainerHeight = height;
              let adjYHeight = coverButtonsHeight + CoverContainerHeight;
              document.getElementById("adjuster").style.top = adjYHeight + "px";
              setShowAdjuster(true);
            }, 100);
          }
        };
        img.src = preview;
        props.handleAttachmentsChange(pdfFile);
      })
      .catch((e) => {
        console.log(`An error occurred while loading pdf`, e);
      });
  };

  const handleDropCover = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length === 0) return;

    if (acceptedFiles[0].size >= MAX_FILE_SIZE) {
      toast.error(
        <div>
          <span>{_("The image file you have selected is too large")}</span>
        </div>,
        { autoClose: true }
      );
      return;
    }

    if (acceptedFiles[0].type === "application/pdf") {
      convertPDFtoImageFile(acceptedFiles[0]);
    } else {
      setCoverFile(acceptedFiles[0]);
      setImageHasChanged(true);
      setCoverButtons("EDIT_POSITION");
      setYPos(0);
      setYHeight(0);
      let img = new Image();
      img.onload = function () {
        let height = coverContainer.current.node.childNodes[0].clientHeight;
        let imageHeight = img.height;
        handleYPosForCoverImage(height, imageHeight);
        setImageSize(cropping);
        if (changeCropping) {
          setTimeout(() => {
            height = coverContainer.current.node.clientHeight;
            let coverButtonsHeight = getCoverButtonsHeight();
            let CoverContainerHeight = height;
            let adjYHeight = coverButtonsHeight + CoverContainerHeight;
            document.getElementById("adjuster").style.top = adjYHeight + "px";
            setShowAdjuster(true);
          }, 100);
        }
      };
      img.src = acceptedFiles[0].preview;
    }
  };

  const handleMousemove = (diffY, e) => {
    const cover = coverContainer.current.node;
    const coverImage = cover.querySelector("img");

    let eHe = coverImage.clientHeight;
    let cHe = coverContainer.current.node.clientHeight;

    let posY = e.clientY;
    let aY = posY - diffY;

    if (aY > 0) aY = 0;
    if (eHe < cHe) aY = 0;
    else if (eHe - Math.abs(aY) < cHe) aY = -Math.abs(cHe - eHe);

    coverImage.style.top = aY + "px";
  };

  const handleMouseUp = (originHeight, diffY, e) => {
    const cover = coverContainer.current.node;
    const coverImage = cover.querySelector("img");
    let CoverContainerHeight = coverContainer.current.node.clientHeight;

    let eHe = coverImage.clientHeight;
    let cHe = CoverContainerHeight;

    let posY = e.clientY;
    let aY = posY - diffY;

    if (aY > 0) aY = 0;
    if (eHe < cHe) aY = 0;
    else if (eHe - Math.abs(aY) < cHe) aY = -Math.abs(cHe - eHe);

    setYPos(((100 * Math.abs(aY)) / originHeight).toFixed(0));
    cover.removeEventListener("mousemove", (ev) => handleMousemove(diffY, ev));
  };

  const handleYPosForCoverImage = (originHeight, imageHeight) => {
    setCoverButtons("EDIT_POSITION");
    let CoverContainerHeight = coverContainer.current.node.clientHeight;
    const cover = coverContainer.current.node;
    const coverImage = cover.querySelector("img");

    if (imageHeight < CoverContainerHeight) {
      coverImage.style.width = "auto";
      coverImage.style.position = "relative";
      setYPos(0);
      setHandleCropping(0);
      return;
    }
    $("#coverContainer")
      .css("cursor", "move")
      .on("mousedown", function (e) {
        e.preventDefault();
        if ($(this).find("img").length) {
          let posY = e.clientY;
          let divTop = $(this).find("img").css("top").replace("px", "");
          let diffY = posY - divTop;

          $(this).on("mousemove", function (e) {
            let eHe = $(this).find("img").height();
            let cHe = $(this).height();

            let posY = e.clientY;
            let aY = posY - diffY;

            if (aY > 0) aY = 0;
            if (eHe < cHe) aY = 0;
            else if (eHe - Math.abs(aY) < cHe) aY = -Math.abs(cHe - eHe);

            setYPos((100 * Math.abs(aY)) / originHeight);
            $(this)
              .find("img")
              .css("top", aY + "px");
          });
        }
      })
      .on("mouseup mouseout", function () {
        $(this).unbind("mousemove");
      });

    /*cover.setAttribute("style", "cursor: move;");
cover.addEventListener("mousedown", (e) => {
  e.preventDefault();
  const coverImage = cover.querySelector("img");
  if (coverImage) {
    let posY = e.clientY;
    let divTop = getStyle(coverImage, "top").replace("px", "");
    let diffY = posY - divTop;

    cover.addEventListener("mousemove", (ev) => handleMousemove(diffY, ev));
    cover.addEventListener("mouseup", (ev) =>
      handleMouseUp(originHeight, diffY, ev)
    );
    cover.addEventListener("mouseout", (ev) =>
      handleMouseUp(originHeight, diffY, ev)
    );
  }
});*/
  };

  const PreviewActionButtons = () => {
    if ("EDIT_POSITION" === coverButtons) {
      return (
        <div>
          <div className={styles.coverYBox}>
            <div className="cover-buttons-text">
              <h5>Faites glisser pour repositionner</h5>
              <span>
                La taille de votre photo peut apparaître différemment sur des
                appareils plus petits.
              </span>
            </div>
            <div className={styles.coverButtons}>
              <Button
                onClick={() => coverContainer.current.open()}
                className="button-upload"
              >
                <IconUpload size={17} />
                <span>{_("Change")}</span>
              </Button>
              <Button
                onClick={(e) => {
                  setCoverFile(null);
                  setCoverButtons("ICONS");
                  setShowAdjuster(false);
                  dispatch(setMediaMedia(null));
                  const cover = coverContainer.current.node;
                  const coverImage = cover.querySelector("img");
                  coverImage.style.top = "0px";
                  cover.style.cursor = "pointer";
                  cover.style.height = null;
                }}
                className="button-cancel"
                variant="default"
              >
                {_("article.cancel")}
              </Button>
            </div>
          </div>
          <div className={styles.coverCropBox}>
            <span>
              <IconCrop /> &nbsp;Ratio crop:
            </span>
            {changeCropping
              ? IMAGE_SIZES.map((size) => {
                  return (
                    <span
                      key={`imgsize${size.value}`}
                      className={`${styles.cropItem} ${
                        cropSize === size.value ? styles.croptItemActive : ""
                      } `}
                      onClick={() => setImageSize(size.value)}
                    >
                      {size.title}
                    </span>
                  );
                })
              : IMAGE_SIZES.map((size) => {
                  return (
                    <span
                      key={`imgsize${size.value}`}
                      className={`${styles.cropDisabledItem} ${
                        cropSize === size.value ? styles.croptItemActive : ""
                      } `}
                    >
                      {size.title}
                    </span>
                  );
                })}
          </div>
        </div>
      );
    }
    return null;
  };

  const DropzoneIcons = () => {
    return "ICONS" === coverButtons ? (
      <div
        className={styles.coverIconbox}
        onClick={() => {
          coverContainer.current.open();
        }}
      >
        <div className={styles.coverIcon}>
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36.7036 10.9652H7.26714C6.86028 10.9652 6.53094 11.2951 6.53094 11.7014V32.3071C6.53094 32.7135 6.86079 33.0428 7.26714 33.0428H36.7036C37.11 33.0428 37.4393 32.7135 37.4393 32.3071V11.7014C37.4393 11.2951 37.11 10.9652 36.7036 10.9652ZM8.69696 31.5709L14.626 23.2702L17.8717 27.8069L15.6758 31.5709H8.69696ZM17.3808 31.5709L26.4005 16.1059L35.4222 31.5709H17.3808ZM35.9674 12.4371V29.5843L27.0369 14.2768C26.8008 13.9257 26.3245 13.8325 25.9734 14.0686C25.8913 14.1238 25.8204 14.1947 25.7651 14.2768L18.6839 26.4196L15.2254 21.5825C15.0881 21.3869 14.8651 21.2693 14.626 21.2683C14.3884 21.2683 14.1654 21.3828 14.0271 21.5764L8.00333 30.0099V12.4371H35.9674Z"
              fill="currentColor"
            />
            <path
              d="M43.8978 29.8498L41.8549 22.2249V8.75765C41.8549 7.53861 40.8664 6.55009 39.6474 6.55009H37.6516L37.0385 4.25083C36.7178 3.07789 35.5099 2.38325 34.3349 2.69688L19.946 6.55009H4.3234C3.10435 6.55009 2.11584 7.53861 2.11584 8.75765V11.327L1.63603 11.4547C0.462073 11.7754 -0.235104 12.9812 0.0729512 14.1587L2.11584 21.7836V35.2509C2.11584 36.4699 3.10435 37.4584 4.3234 37.4584H6.31917L6.93224 39.7572C7.24891 40.9327 8.45832 41.6288 9.6338 41.3122C9.6343 41.3116 9.63532 41.3116 9.63582 41.3116L24.0247 37.4584H39.6474C40.8664 37.4584 41.8549 36.4699 41.8549 35.2504V32.6816L42.3347 32.5534C43.5087 32.2332 44.2059 31.0273 43.8978 29.8498ZM34.7165 4.12163C35.1071 4.01726 35.5084 4.24728 35.6158 4.6364L36.1265 6.55009H25.6354L34.7165 4.12163ZM1.49517 13.7803C1.39282 13.3866 1.62589 12.9838 2.01755 12.8759L2.11584 12.85V16.0968L1.49517 13.7803ZM9.25379 39.8904C8.86366 39.9948 8.46238 39.7648 8.35446 39.3757L7.84272 37.4584H18.3353L9.25379 39.8904ZM40.383 35.2509C40.383 35.6572 40.0537 35.9866 39.6474 35.9866H4.3234C3.91705 35.9866 3.58771 35.6572 3.58771 35.2509V8.75765C3.58771 8.3513 3.91705 8.02197 4.3234 8.02197H39.6474C40.0537 8.02197 40.383 8.3513 40.383 8.75765V35.2509ZM41.9527 31.1296L41.8549 31.158V27.9113L42.4756 30.2278C42.5759 30.6204 42.3433 31.0217 41.9527 31.1296Z"
              fill="currentColor"
            />
            <path
              d="M17.5697 20.5321C19.1956 20.5321 20.5135 19.2143 20.5135 17.5889C20.5135 15.963 19.1956 14.6451 17.5697 14.6451C15.9438 14.6451 14.626 15.963 14.626 17.5889C14.626 19.2143 15.9438 20.5321 17.5697 20.5321ZM17.5697 16.117C18.3824 16.117 19.0416 16.7757 19.0416 17.5889C19.0416 18.4016 18.3824 19.0602 17.5697 19.0602C16.757 19.0602 16.0979 18.4016 16.0979 17.5889C16.0979 16.7757 16.757 16.117 17.5697 16.117Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {_("article.media_text")}
      </div>
    ) : null;
  };

  const MediaButton = () => {
    return "ICONS" === coverButtons ? (
      <button
        className={styles.mediaButton}
        onClick={(e) => {
          e.stopPropagation();
          dispatch(disableMultiSelect());
          dispatch(toggleMediaModal());
        }}
      >
        {_("article.from_media")}
      </button>
    ) : null;
  };

  const renderCover = () => {
    const { language } = props;
    let coverUrl = null;

    if (coverFile) {
      coverUrl = coverFile instanceof File ? coverFile.preview : coverFile;
    } else if (mediaMedia && !mediaIsAlbum) {
      if (mediaMedia.docType == "IMAGE" && mediaMedia.fullMediaUrl) {
        coverUrl = `${mediaMedia.fullMediaUrl}`;
      } else if (mediaMedia.preview && mediaMedia.preview.fullMediaUrl) {
        coverUrl = `${mediaMedia.preview.fullMediaUrl}`;
      }
    }
    let coverImg = coverUrl ? (
      <img className={styles.coverImg} src={coverUrl} />
    ) : (
      ""
    );
    let containerAlbum = "";

    if (
      mediaMedia &&
      mediaIsAlbum &&
      mediaMedia.medias &&
      mediaMedia.medias.length > 0
    ) {
      const titleAttr = `title${
        language.charAt(0).toUpperCase() + language.slice(1)
      }`;
      containerAlbum = " cover-container-album";
      coverImg = (
        <div className="album-cover media__album">
          <h4>{mediaMedia[titleAttr]}</h4>
          <img
            className={`cover-img folder_${mediaMedia.color}`}
            src={`/img/folder${mediaMedia.color}.svg`}
          />
          <ul className="preview">
            {mediaMedia.medias.slice(0, 3).map((el) => {
              let path = el.fullMediaUrl;
              if (el.preview && el.preview.fullMediaUrl) {
                path = el.preview.fullMediaUrl;
              }
              return (
                <li
                  key={el.id}
                  className="thumbnail"
                  style={{
                    backgroundImage: `url("${path}")`,
                  }}
                />
              );
            })}
          </ul>
        </div>
      );
    }

    return (
      <div className={styles.previewContainer}>
        <PreviewActionButtons />
        <div style={{ position: "relative" }}>
          <ReactDropzone
            accept="image/jpeg, image/png, application/pdf, video/*"
            onDrop={(accepted, rejected) => handleDropCover(accepted, rejected)}
            className={`${styles.coverContainer} ${
              coverUrl ? styles.coverContainerFull : ""
            } ${containerAlbum}`}
            multiple={false}
            ref={coverContainer}
            disableClick={true}
            id="coverContainer"
          >
            {coverImg}
            {mediaMedia && <div className={styles["cover-overlay"]}></div>}
            <DropzoneIcons />
            {/* <MediaButton /> */}
          </ReactDropzone>
          <div id="adjuster" style={{ display: showAdjuster ? "" : "none" }}>
            <IconThreeDots />
          </div>
        </div>
      </div>
    );
  };

  // if (props.activeTab !== "EDITOR") {
  //   return null;
  // }

  const handleChange = (content) => {
    setContent(content);
  };

  const handlePaste = (event, cleanData, maxCharCount, core) => {
    let content = cleanData.replace(/\s+style="[^"]*"/gi, "");
    return content.replace(/(<\/?h)([0-1])/gi, "$12");
  };

  const handleImageUploadBefore = (files, info, uploadHandler) => {
    dispatch(
      uploadTmpMedia({ ttpApiUrl, token: auth.token, data: files[0] })
    ).then((resp) => {
      const url = resp.payload.data.data.url;
      const startsWithHttp = url.lastIndexOf("http://", 0) === 0;
      const startsWithHttps = url.lastIndexOf("https://", 0) === 0;
      const isAbsolute = startsWithHttp || startsWithHttps;
      const imgUrl = isAbsolute ? url : `${ttpApiUrl}/${url}`;
      uploadHandler({
        result: [
          {
            url: imgUrl,
            name: files[0].name,
            size: files[0].size,
          },
        ],
      });
    });
  };

  const initEditor = () => {
    editorRef.current.util.createTagsWhitelist("div");
  };

  const getSunEditorInstance = (sunEditor) => {
    editorRef.current = sunEditor;
  };

  const handleTitleType = (type) => {
    if (title.length === 0) {
      return null;
    }
    switch (type) {
      case "upperFirst":
        const lower = title.toLowerCase();
        dispatchSetArticle(
          "title",
          title.charAt(0).toUpperCase() + lower.slice(1)
        );
        break;
      case "lower":
        dispatchSetArticle("title", title.toLowerCase());
        break;
      case "upper":
        dispatchSetArticle("title", title.toUpperCase());
        break;
      case "capitalize":
        const low = title.toLowerCase();
        const arr = low.split(" ");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        dispatchSetArticle("title", arr.join(" "));
        break;
      case "generateTitle":
        dispatch(fetchTitleIA({ title: title })).then((action) => {
          if (action.type === fetchTitleIA.fulfilled.type) {
            console.log(action.payload);
            dispatchSetArticle("title", action.payload.data.content);
          } else if (action.type === fetchTitleIA.rejected.type) {
            console.error("Failed to generate title:", action.error);
          }
        });
        break;
    }
  };
  const generateTitle = (Title) => {
    const response = dispatch(fetchTitleIA({ title: Title }));
    dispatchSetArticle("title", response);
  };
  const getCaretCoordinates = (e) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = e.target.getBoundingClientRect();
    return {
      top: rect.top - editorRect.top + rect.height + window.scrollY,
      left: rect.left - editorRect.left + window.scrollX,
    };
  };

  const loadAuthorSuggestions = (value) => {
    setSuggestionValue(value);
    const communityId = community ? community.value : null;
    dispatch(fetchAvatarsAndAuthors({ word: value, communityId }));
  };

  const handleChangeAuto = (e) => {
    const content = e.target.textContent;
    const mentionRegex = /@(\S+)/g;
    let mentionDetected = false;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const value = match[1];
      if (value.length >= 3) {
        setShowSuggestions(true);
        const { top, left } = getCaretCoordinates(e);
        setSuggestionsPosition({ top, left });
        loadAuthorSuggestions(value);
        mentionDetected = true;
        break;
      }
    }

    if (!mentionDetected) {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const updatedContent = content.replace("@" + suggestionValue, suggestion);
    editorRef.current.setContents(updatedContent);
  };

  return (
    <div style={{ display: props.activeTab !== "EDITOR" ? "none" : "block" }}>
      {renderCover()}
      <div className={styles.titleContainer}>
        <textarea
          data-min-rows={1}
          value={title}
          rows={1}
          className={styles.titleInput}
          placeholder={_("article.title")}
          onChange={(e) => {
            dispatchSetArticle("title", e.target.value);
          }}
          onFocus={(e) => {
            const savedValue = e.target.value;
            e.target.value = "";
            e.target.baseScrollHeight = e.target.scrollHeight;
            e.target.value = savedValue;
          }}
          onInput={(e) => {
            let minRows = e.target.getAttribute("data-min-rows") | 0,
              rows;
            e.target.rows = minRows;
            rows = Math.ceil((e.target.scrollHeight - 27) / 28);
            e.target.rows = minRows + rows;
          }}
        ></textarea>
        <div className={styles.titleActions}>
          <div className={styles.titleDropDown}>
            <span>
              <IconPencil />
            </span>
            <div className={styles.titleDropDown_content}>
              <div onClick={() => handleTitleType("lower")}>
                {_("article.lowercase")}
              </div>
              <div onClick={() => handleTitleType("upper")}>
                {_("article.uppercase")}
              </div>
              <div onClick={() => handleTitleType("capitalize")}>
                {_("article.capitalize")}
              </div>
              <div onClick={() => handleTitleType("upperFirst")}>
                {_("article.ufirst")}
              </div>
              <div
                onClick={() => {
                  if (title && title.length > 0) {
                    dispatch(fetchTitleIA({ title: title })).then((action) => {
                      if (action.type === fetchTitleIA.fulfilled.type) {
                        console.log(action.payload);
                        // dispatchSetArticle(
                        //   "title",
                        //   action.payload.data.attractiveTitle
                        // );
                        setSuggestedTitle(action.payload.content);
                        setSshowGenerateTitleModal(true);
                      } else if (action.type === fetchTitleIA.rejected.type) {
                        console.error(
                          "Failed to generate title:",
                          action.error
                        );
                      }
                    });
                  }
                }}
              >
                {_("article.generateTitle")}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="ttp-editor" className={styles.editorContainer}>
        <div style={{ position: "relative" }}>
          <SunEditor
            ref={editorRef}
            getSunEditorInstance={getSunEditorInstance}
            placeholder={_("article.write_here")}
            setOptions={{
              attributesWhitelist: {
                all: "style",
                input: "checked",
              },
              height: "auto",
              minHeight: "300px",
              showPathLabel: false,
              resizingBar: false,
              imageUrlInput: false,
              imageWidth: "75%",
              formats: ["p", "blockquote", "h2", "h3", "h4", "h5", "h6"],
              buttonList: [
                [
                  "undo",
                  "redo",
                  "formatBlock",
                  "bold",
                  "underline",
                  "italic",
                  "strike",
                  "outdent",
                  "indent",
                  "align",
                  "list",
                  "table",
                  "link",
                  "image",
                  // "pdf_embed",
                  "video",
                  "tweet_embed",
                  "quote_embed",
                  "article_embed",
                  "event_embed",
                  "showBlocks",
                  "ArticleSuggestion",
                  "fullScreen",
                ],
              ],
              plugins: {
                ...plugins,
                TweetEmbed,
                QuoteEmbed,
                ArticleEmbed,
                EventEmbed,
                ArticleSuggestionEmbed: ArticleSuggestionEmbed(dispatch),
                // PdfEmbed: PdfEmbed(dispatch, auth, ttpApiUrl),
              },
            }}
            setContents={initialContent}
            onChange={(c) => handleChange(c)}
            onInput={handleChangeAuto}
            onPaste={handlePaste}
            onImageUploadBefore={handleImageUploadBefore}
            onLoad={initEditor}
          />

          {showSuggestions && (
            <AuthorMention
              suggestionsPosition={suggestionsPosition}
              language={props.language}
              closeMention={() => setShowSuggestions(false)}
              onSelectSuggestion={handleSelectSuggestion}
            />
          )}
          <ModalConfirm
            type="add"
            isOpen={showGenerateTitleModal}
            onCancel={() => setSshowGenerateTitleModal(false)}
            onConfirm={() => {
              dispatchSetArticle("title", suggestedTitle);
              setSshowGenerateTitleModal(false);
            }}
            inProcess={false}
            actionFailed={false}
            title="Choisir un meilleur titre avec l'intelligence artificielle"
            labelNo="Annuler"
            labelYes="Enregistrer"
            labelError="Error"
            // subHeader=true
          >
            <div className={styles.titleSuggestion}>
              <p> Titre original :</p>
              <p className={styles.titre}> {title} </p>
              <div className={styles.inputContainer}>
                <textarea
                  rows="3"
                  placeholder="titre suggéré"
                  style={{ marginRight: "3px", marginLeft: "4px" }}
                  value={suggestedTitle}
                  onChange={(e) => setSuggestedTitle(e.target.value)}
                  disabled={isLoading}
                  className={styles.input}
                />
                <button
                  onClick={() => {
                    setIsLoading(true);
                    dispatch(fetchTitleIA({ title: title })).then((action) => {
                      if (action.type === fetchTitleIA.fulfilled.type) {
                        console.log(action.payload);
                        // dispatchSetArticle(
                        //   "title",
                        //   action.payload.data.attractiveTitle
                        // );
                        setSuggestedTitle(action.payload.content);
                      } else if (action.type === fetchTitleIA.rejected.type) {
                        console.error(
                          "Failed to generate title:",
                          action.error
                        );
                      }
                      setIsLoading(false);
                    });
                  }}
                  className={`${styless.yes} ${styles.yes}`}
                >
                  {!isLoading ? (
                    <svg
                      fill="#ffffff"
                      width="16px"
                      height="16px"
                      viewBox="0 0 8 8"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0" />

                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />

                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path d="M4 0c-2.2 0-4 1.8-4 4s1.8 4 4 4c1.1 0 2.12-.43 2.84-1.16l-.72-.72c-.54.54-1.29.88-2.13.88-1.66 0-3-1.34-3-3s1.34-3 3-3c.83 0 1.55.36 2.09.91l-1.09 1.09h3v-3l-1.19 1.19c-.72-.72-1.71-1.19-2.81-1.19z" />{" "}
                      </g>
                    </svg>
                  ) : (
                    <div className={styles.loader}>
                      <Loader
                        style={{
                          height: "7px",
                        }}
                        color={"white"}
                      />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </ModalConfirm>
        </div>
      </div>
    </div>
  );
}
