import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import ReactDropzone from "react-dropzone";
import { toast } from "react-toastify";
import $ from "jquery";

import Button from "../../common/Button";
import Loader from "../../common/Loader";
import Switch from "../../common/Switch/Switch";
import { setArticle, saveTheme } from "../../../redux/actions";
import _ from "../../../i18n";
import styles from "./ArticleConfiguration.module.scss";

const languages = [
  { value: "en", label: _("article.english") },
  { value: "fr", label: _("article.french") },
  { value: "nl", label: _("article.dutch") },
];

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: state.isDisabled ? "#e6e6e6" : "#fff",
    boxShadow: "none",
    border: state.isFocused ? "1px solid #2495E1" : "1px solid #CED4DB",
    "&:hover": {
      borderColor: state.isFocused ? "#18A0FB" : "#DFE2E6",
    },
    padding: 0,
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: "12px",
    lineHeight: "14px",
    color: "#6D7F92",
    fontWeight: 400,
  }),
  menuList: (provided, state) => ({
    ...provided,
    paddingTop: "0",
    paddingBottom: "0",
  }),
  menu: (provided, state) => ({
    ...provided,
    borderRadius: "5px",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
    fontSize: "12px",
    lineHeight: "14px",
    color: state.isSelected ? "#FFFFFF" : "#6D7F92",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#29394D",
  }),
};

export default function ThemePopOver(props) {
  const dispatch = useDispatch();
  const defaultLanguage = languages.filter(
    (itm) => itm.value === props.language
  )[0];
  const coverContainer = useRef();
  const [yPos, setYPos] = useState(0);
  const [themeTitleFr, setThemeTitleFr] = useState("");
  const [themeTitleNl, setThemeTitleNl] = useState("");
  const [themeTitleEn, setThemeTitleEn] = useState("");
  const selectedLanguage = useSelector(
    (state) => state.articles.article.selectedLanguage
  );
  const community = useSelector((state) => state.articles.article.community);
  const [themeCommunity, setThemeCommunity] = useState(community);
  const [isDefault, setIsDefault] = useState(false);
  const isSaving = useSelector((state) => state.themes.isSaving);
  const [coverFile, setCoverFile] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { communities } = user;

  const communityOptions = [];
  communities.map((com) => {
    communityOptions.push({
      value: com.id,
      label: com.name,
    });
  });

  const handleDropCover = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length === 0) return;

    setCoverFile(acceptedFiles[0]);
    setYPos(0);
    let img = new Image();
    img.onload = function () {
      let height = coverContainer.current.node.childNodes[0].clientHeight;
      let imageHeight = img.height;
      handleYPosForCoverImage(height, imageHeight);
    };
    img.src = acceptedFiles[0].preview;
    img.className = styles.themeCoverImg;
  };

  let coverUrl = null;
  if (coverFile) {
    coverUrl = coverFile instanceof File ? coverFile.preview : coverFile;
  }
  let coverImg = coverUrl ? (
    <img className={styles.themeCoverImg} src={coverUrl} />
  ) : (
    ""
  );

  const handleYPosForCoverImage = (originHeight, imageHeight) => {
    let CoverContainerHeight = coverContainer.current.node.clientHeight;
    const cover = coverContainer.current.node;
    const coverImage = cover.querySelector("img");

    if (imageHeight < CoverContainerHeight) {
      coverImage.style.width = "auto";
      coverImage.style.position = "relative";
      setYPos(0);
      return;
    }
    $("#themeCoverContainer")
      .css("cursor", "move")
      .on("mousedown", function (e) {
        e.preventDefault();
        if ($(this).find("img").length) {
          let posY = e.clientY;
          let divTop = $(this).find("img").css("top").replace("px", "");
          if (divTop === "auto") {
            divTop = 0;
          }
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
  };

  const DropzoneIcons = () => {
    return coverFile ? null : (
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
        {_("article.dropzone_text")}
      </div>
    );
  };

  const handleCancel = () => {
    props.closePopOver();
    setThemeTitleFr("");
    setThemeTitleNl("");
    setThemeTitleEn("");
    setCoverFile(null);
    setIsDefault(false);
  };

  const validate = () => {
    let errors = [];

    if (
      themeTitleFr.trim().length === 0 ||
      themeTitleNl.trim().length === 0 ||
      themeTitleEn.trim().length === 0
    ) {
      errors.push(_("article.validate_theme_title"));
    }

    if (!themeCommunity) {
      errors.push(_("article.validate_community"));
    }

    return errors;
  };

  const save = () => {
    let errors = validate();
    if (errors && errors.length > 0) {
      let ErrorsContainer = ({ errors }) => (
        <div>
          <span>{_("article.errors") + " :"}</span>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      );
      toast.error(<ErrorsContainer errors={errors} />, { autoClose: true });
      return;
    }
    let data = {
      titleFr: themeTitleFr,
      titleNl: themeTitleNl,
      titleEn: themeTitleEn,
      organization: themeCommunity.value,
      isDefault: isDefault ? 1 : 0,
      coverFile,
      yPos,
    };

    const titleAttr = `title${
      props.language.charAt(0).toUpperCase() + props.language.slice(1)
    }`;

    dispatch(saveTheme(data)).then(({ payload }) => {
      if (payload.statusCode && payload.statusCode === 400) {
        toast.error(payload.title, { autoClose: true });
      } else {
        const data = payload.data.data;
        dispatch(
          setArticle({
            index: "theme",
            value: { id: data.id, title: data[titleAttr] },
          })
        );
        toast.success("Success");
        props.closePopOver();
        setThemeTitleFr("");
        setThemeTitleNl("");
        setThemeTitleEn("");
        setCoverFile(null);
        setIsDefault(false);
      }
    });
  };

  return (
    <div className={styles.popOver} onClick={(e) => e.stopPropagation()}>
      <div style={{ position: "relative" }}>
        <ReactDropzone
          onDrop={(accepted, rejected) => handleDropCover(accepted, rejected)}
          className={`${styles.themeCover} `}
          multiple={false}
          ref={coverContainer}
          disableClick={true}
          id="themeCoverContainer"
        >
          {coverImg}
          <DropzoneIcons />
        </ReactDropzone>
      </div>

      <div className={styles.formRow}>
        <label className={styles.configLabelFlex}>
          <img
            src="https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/flags/fr.png"
            height="18"
          />
          {_("article.title")} FR
        </label>
        <input
          className={styles.formInput}
          value={themeTitleFr}
          onChange={(e) => {
            setThemeTitleFr(e.target.value);
          }}
        />
      </div>

      <div className={styles.formRow}>
        <label className={styles.configLabelFlex}>
          <img
            src="https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/flags/nl.png"
            height="18"
          />
          {_("article.title")} NL
        </label>
        <input
          className={styles.formInput}
          value={themeTitleNl}
          onChange={(e) => {
            setThemeTitleNl(e.target.value);
          }}
        />
      </div>

      <div className={styles.formRow}>
        <label className={styles.configLabelFlex}>
          <img
            src="https://tamtam.s3.eu-west-1.amazonaws.com/cdn/img/flags/en.png"
            height="18"
          />
          {_("article.title")} EN
        </label>
        <input
          className={styles.formInput}
          value={themeTitleEn}
          onChange={(e) => {
            setThemeTitleEn(e.target.value);
          }}
        />
      </div>

      <div className={styles.formRow}>
        <label className={styles.configLabel}>{_("article.community")}</label>
        <Select
          styles={selectStyles}
          options={communityOptions}
          isSearchable={false}
          placeholder={_("article.select_community")}
          value={themeCommunity}
          onChange={(e) => setThemeCommunity(e)}
        />
      </div>

      <div className={`${styles.formRow} ${styles.formSwitch} `}>
        <label className={styles.configLabel}>
          {_("article.theme_isdefault")}
        </label>
        <Switch isChecked={isDefault} onChange={(val) => setIsDefault(val)} />
      </div>
      <Button block onClick={() => save()}>
        {isSaving ? (
          <Loader
            style={{
              height: "10px",
            }}
            color={"#fff"}
          />
        ) : (
          _("article.add_theme")
        )}
      </Button>
      {coverFile && (
        <Button block onClick={() => handleCancel()} variant="default">
          {_("article.cancel")}
        </Button>
      )}
    </div>
  );
}
