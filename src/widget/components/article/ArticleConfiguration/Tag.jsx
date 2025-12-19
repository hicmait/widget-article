import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { components } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import { Modal as AntModal } from "antd";
import { toast } from "react-toastify";
import { translateTag } from "../../../api";
import {
  setArticle,
  resetArticleTags,
  setAllowFetchTags,
  fetchSuperTagTheme,
} from "../../../redux/actions";

import { getTagName } from "../../../services/utils";
import {
  getTags,
  getSearchTags,
  saveTag,
  saveSuperTag,
  getTag,
  getThemes,
} from "../../../api";
import Button from "../../common/Button";
import Loader from "../../common/Loader";
import { IconClose } from "../../common/Icons";
import Switch from "../../common/Switch/Switch";
import _ from "../../../i18n";
import TagMergeModal from "./TagMergeModal";
import styles from "./ArticleConfiguration.module.scss";
import homeStyles from "../TamtamIt/TamtamIt.module.scss";

const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "#172B4D",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

export default function Tag(props) {
  const { language } = props;
  const dispatch = useDispatch();
  const ttpApiUrl = useSelector((state) => state.params.ttpApiUrl);
  const token = useSelector((state) => state.auth.token);
  const tags = useSelector((state) => state.articles.article.tags);
  const allowCreateTags = useSelector(
    (state) => state.articles.allowCreateTags
  );
  const translateLanguage = useSelector(
    (state) => state.articles.translateLanguage
  );

  const loadingTags = useSelector((state) => state.tags.fetching);
  const moreTags = useSelector((state) => state.tags.moreTags);
  const [openTagModal, setOpenTagModal] = useState(false);
  const [editTag, setEditTag] = useState(null);
  const [theme, setTheme] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageOptions, setPageOptions] = useState([]);
  const [savingTag, setSavingTag] = useState(false);
  const [superTag, setSuperTag] = useState(null);
  const [savingSuperTag, setSavingSuperTag] = useState(false);
  const [applyAllSelection, setApplyAllSelection] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [openMergeModal, setOpenMergeModal] = useState(false);

  const lng = translateLanguage ? translateLanguage : language;
  const nameAttr = `name${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  const titleAttr = `title${lng.charAt(0).toUpperCase() + lng.slice(1)}`;
  const [searchTags, setSearchTags] = useState([]);
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    const fetchTagData = async () => {
      try {
        const response = await getTag({
          ttpApiUrl,
          token,
          id: editTag.id,
        });
        if (response.data.data[0].theme) {
          const themeTitle =
            response.data.data[0].theme[titleAttr] ||
            response.data.data[0].theme["titleFr"] ||
            response.data.data[0].theme["titleEn"] ||
            response.data.data[0].theme["titleNl"];
          setTheme({
            id: response.data.data[0].theme.id,
            title: themeTitle,
          });
        }
        if (
          response.data.data[0].pages &&
          response.data.data[0].pages.length > 0
        ) {
          let pagesData = response.data.data[0].pages.map((page) => {
            const pageTitle =
              page[titleAttr] ||
              page["titleFr"] ||
              page["titleEn"] ||
              page["titleNl"];
            return {
              id: page.id,
              title: pageTitle,
            };
          });
          setPages(pagesData);
        }

        if (response.data.data[0].superTag) {
          let label = getTagName(response.data.data[0].superTag, lng);
          let tmp = {
            label: "⚡︎ " + label,
            name: response.data.data[0].superTag[nameAttr],
            value: response.data.data[0].superTag.id,
            tag: {
              id: response.data.data[0].superTag.id,
              nameEn: response.data.data[0].superTag.nameEn,
              nameFr: response.data.data[0].superTag.nameFr,
              nameNl: response.data.data[0].superTag.nameNl,
            },
          };

          setSuperTag(tmp);
        } else if (tags?.length > 0) {
          const superT = tags.filter((tag) => tag?.tag?.isSuperTag);
          if (superT?.length > 0) {
            setSuperTag(superT[0]);
          }
        }
      } catch (e) {}
    };

    if (openTagModal && editTag) {
      fetchTagData();
    }
  }, [openTagModal]);

  const fetchThemes = (inputValue) => {
    let customFilter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== language);

    if (null !== inputValue) {
      customFilter = [
        {
          property: titleAttr,
          value: inputValue,
          operator: "like",
        },
      ];

      if (lngs) {
        lngs.forEach((itm) => {
          let lngTitleAttr = `title${
            itm.charAt(0).toUpperCase() + itm.slice(1)
          }`;
          customFilter.push({
            property: lngTitleAttr,
            value: inputValue,
            operator: "like",
            filter: "or",
          });
        });
      }
    }
    return getThemes({
      token,
      customFilter,
    }).then((result) => {
      const themeData = result.data.data;
      return themeData.map((t) => {
        return {
          title: t[titleAttr],
          id: t.id,
          pages: t.pages ? t.pages : [],
        };
      });
    });
  };
  const [loading, setLoading] = useState(false);

  const translate = async () => {
    try {
      setLoading(true);
      const res = await translateTag({
        ttpApiUrl,
        token,
        text:
          editTag.nameFr.trim().length > 0
            ? editTag.nameFr
            : editTag.nameEn.trim().length > 0
            ? editTag.nameEn
            : editTag.nameNl,
        lng:
          editTag.nameFr.trim().length > 0
            ? "fr"
            : editTag.nameEn.trim().length > 0
            ? "en"
            : "nl",
      });

      const translatedData = res.data.data.flat();
      const translatedNames = {};

      translatedData.forEach((languageObj) => {
        const language = Object.keys(languageObj)[0];
        const propertyName = `name${language.charAt(0).toUpperCase()}${language
          .slice(1)
          .toLowerCase()}`;
        translatedNames[propertyName] = languageObj[language];
      });

      setEditTag({
        ...editTag,
        ...translatedNames,
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleChangeTheme = (theme) => {
    setTheme(theme);
    setPages([]);

    let tab = [];
    if (theme.pages) {
      theme.pages.forEach((page) => {
        const pageTitle =
          page[titleAttr] ||
          page["titleFr"] ||
          page["titleEn"] ||
          page["titleNl"];
        tab.push({
          id: page.id,
          title: pageTitle,
        });
      });
    }
    setPageOptions(tab);
  };

  const fetchTTags = (inputValue) => {
    let customFilter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== lng);

    let textFilter = "";
    if (null !== inputValue) {
      textFilter = inputValue.replace(/'/g, "");
      customFilter = [
        {
          property: nameAttr,
          value: textFilter,
          operator: "like",
        },
      ];

      if (lngs) {
        lngs.forEach((itm) => {
          let lngNameAttr = `name${itm.charAt(0).toUpperCase() + itm.slice(1)}`;
          customFilter.push({
            property: lngNameAttr,
            value: textFilter,
            operator: "eq",
            logicalOperator: "OR",
          });
        });
      }
    }
    setInputSearch(inputValue);
    const superT = tags?.filter((t) => t?.tag?.isSuperTag);

    return getSearchTags({
      ttpApiUrl,
      token,
      textFilter,
      lng,
      lngs: lngs.join(","),
      limit: 200,
    }).then((result) => {
      const tags = result.data.data;
      const tab = [],
        superTags = [];
      const parentTags = [];
      tags.forEach((tag) => {
        if (!tag.isSynonym) {
          parentTags.push(tag.id);
        }
      });

      tags.forEach((tag) => {
        let label = getTagName(tag, lng);
        let tmp = {
          label: tag.isSuperTag ? "⚡︎ " + label : label,
          name: tag[nameAttr],
          value: tag.id,
          tag: {
            id: tag.id,
            nameEn: tag.nameEn,
            nameFr: tag.nameFr,
            nameNl: tag.nameNl,
            counter: tag.counter,
            isSuperTag: tag.isSuperTag,
            superTag: tag.superTag ?? null,
          },
        };
        if (!tag.isSuperTag && !tag.superTag) {
          tmp.color = "#acd4f9";
        }
        let emptyTagName = false;
        if (
          tag.nameFr?.length === 0 ||
          tag.nameNl?.length === 0 ||
          tag.nameEn?.length === 0
        ) {
          emptyTagName = true;
        }

        if (emptyTagName) {
          tmp.color = "#fed493";
        }
        if (
          tag.isSynonym &&
          tag.parent !== undefined &&
          !parentTags.includes(tag.parent.id)
        ) {
          tmp.label = `${tmp.label} ( ${_("article.tag_principal")}: ${
            tag.parent[nameAttr]
          })`;
          tmp.parent = {
            label: tag.parent[nameAttr],
            value: tag.parent.id,
            tag: tag.parent,
          };
        }

        if (!tag.isSynonym || (tag.isSynonym && tmp.parent)) {
          if (tag.isSuperTag) {
            // if (!superT || superT.length < LIMIT_SUPER_TAG) {
            superTags.push(tmp);
            // }
          } else {
            tab.push(tmp);
          }
        }
      });
      if (allowCreateTags && tab.length > 3) {
        setSearchTags([...tab]);
        tab.push({
          label: "=== " + _("article.merge_selection") + " ===",
          value: "FUSION_SELECTION_ACTION",
        });
      }
      if (superTags.length > 0 && tab.length > 0) {
        return [
          {
            label: "Super Tags",
            options: superTags,
          },
          {
            label: "Tags",
            options: tab,
          },
        ];
      } else if (superTags.length > 0) {
        return superTags;
      } else {
        return tab;
      }
    });
  };

  const fetchSuperTags = (inputValue) => {
    let customFilter = [];
    const lngs = ["en", "fr", "nl"].filter((itm) => itm !== lng);

    if (null !== inputValue) {
      let textFilter = inputValue.replace(/'/g, "");
      customFilter = [
        { property: "isSuperTag", value: 1, operator: "eq" },
        {
          property: nameAttr,
          value: textFilter,
          operator: "like",
        },
      ];
    }
    return getTags({
      token,
      lng,
      customFilter,
    }).then((result) => {
      const tags = result.data.data;

      return tags.map((tag) => {
        let label = getTagName(tag, lng);
        let tmp = {
          label: "⚡︎ " + label,
          name: tag[nameAttr],
          value: tag.id,
          tag: {
            id: tag.id,
            nameEn: tag.nameEn,
            nameFr: tag.nameFr,
            nameNl: tag.nameNl,
          },
        };
        return tmp;
      });
    });
  };

  const showMore = () => {
    dispatch(
      setArticle({
        index: "tags",
        value: [...tags, ...moreTags],
      })
    );
    dispatch(resetArticleTags());
  };

  const handleChange = (e) => {
    let tmp = [];
    if (e) {
      const hasFusionAction = e.filter(
        (t) => t.value === "FUSION_SELECTION_ACTION"
      );
      if (hasFusionAction && hasFusionAction.length === 1) {
        setOpenMergeModal(true);
        return null;
      }
      let newSuperT = [];
      e.forEach((t) => {
        if (t?.tag?.isSuperTag) {
          newSuperT.push(t.tag.id);
        }
      });

      let superT = [];
      tags.forEach((t) => {
        if (t?.tag?.isSuperTag) {
          superT.push(t.tag.id);
        }
      });

      e.forEach((tag) => {
        if (tag["__isNew__"]) {
          tmp.push(tag);
        } else {
          if (tag.parent !== undefined) {
            tmp.push({
              label: tag.parent.label,
              value: tag.parent.value,
              tag: tag.parent.tag,
            });
          } else {
            tmp.push(tag);
          }
          if (tag?.tag.superTag) {
            if (
              !newSuperT.includes(tag.tag.superTag.id) &&
              !superT.includes(tag.tag.superTag.id) &&
              tmp.filter((t) => t?.tag?.id === tag.tag.superTag.id).length === 0
            ) {
              let label = getTagName(tag.tag.superTag, lng);
              let tmpTag = {
                label: "⚡︎ " + label,
                name: tag[nameAttr],
                value: tag.tag.superTag.id,
                tag: { ...tag.tag.superTag, isSuperTag: true },
              };
              if (!tag.tag.superTag[nameAttr]) {
                tmpTag.color = "#acd4f9";
              }

              tmp.push(tmpTag);
            }
          }
        }
      });
      const newSuperTagTab = e?.filter((t) => t?.tag?.isSuperTag);
      if (superT.length === 0 && newSuperTagTab.length === 1) {
        dispatch(fetchSuperTagTheme({ tagId: newSuperT[0] }));
      }
    }
    dispatch(setArticle({ index: "tags", value: tmp }));
    dispatch(setAllowFetchTags(false));
  };

  const handleMultiValueClick = (e, { data }) => {
    e.stopPropagation();
    e.preventDefault();
    if (allowCreateTags && !data["__isNew__"]) {
      setEditTag(data.tag);
      setOpenTagModal(true);
    }
  };

  const formatGroupLabel = (data) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const MultiValueLabel = (props) => {
    return (
      <div
        onClick={(e) => handleMultiValueClick(e, props)}
        className={allowCreateTags && styles.tagHover}
      >
        <components.MultiValueLabel {...props} />
      </div>
    );
  };

  const handleSaveTranslationSuperTag = async () => {
    const tagIds = [];
    if (applyAllSelection) {
      tags?.forEach((tag) => {
        if (!tag["__isNew__"] && !tag.tag.isSuperTag && !tag.tag.superTag) {
          tagIds.push(tag.tag.id);
        }
      });
    } else {
      tagIds.push(editTag.id);
    }
    if (tagIds.length === 0) {
      toast.error(_("article.validate_tags"), { autoClose: true });
      return null;
    }
    let emptyTagName = false;
    if (
      editTag.nameFr.length === 0 ||
      editTag.nameNl.length === 0 ||
      editTag.nameEn.length === 0
    ) {
      emptyTagName = true;
    }
    if (emptyTagName) {
      let ErrorsContainer = () => (
        <div>
          <span>{_("article.errors") + " :"}</span>
          <ul>
            <li>{_("article.validate_tag_name")}</li>
          </ul>
        </div>
      );
      toast.error(<ErrorsContainer />, { autoClose: true });
      return;
    }
    try {
      setSavingSuperTag(true);
      let tab = [...tags];
      const savePromises = [];

      for (let i = 0; i < tagIds.length; i++) {
        const tagId = tagIds[i];
        const data = { id: tagId, pages };

        if (superTag) {
          data.superTag = superTag.tag.id;
        }

        if (theme) {
          data.theme = theme.id;
        }

        savePromises.push(saveTag(ttpApiUrl, token, editTag));
        if (superTag) {
          savePromises.push(saveSuperTag(ttpApiUrl, token, data));
        }
      }

      Promise.allSettled(savePromises).then((results) => {
        tab = tab.map((item) => {
          if (tagIds.includes(item.value)) {
            const updatedTag = {
              ...item.tag,
              ...editTag,
              superTag: superTag ? superTag.tag : item.tag.superTag,
            };

            let color;
            if (!updatedTag.isSuperTag && !updatedTag.superTag) {
              color = "#acd4f9"; // Blue for non-super tags without a supertag
            }

            return {
              label: updatedTag.isSuperTag
                ? "⚡︎ " + editTag[nameAttr]
                : editTag[nameAttr],
              name: editTag[nameAttr],
              value: editTag.id,
              tag: updatedTag,
              color: color,
            };
          }
          return item;
        });
        dispatch(setArticle({ index: "tags", value: tab }));
      });

      setSavingSuperTag(false);
      handleCloseModal();
    } catch (e) {
      setSavingSuperTag(false);
    }
  };

  const handleCloseModal = () => {
    setOpenTagModal(false);
    setSuperTag(null);
    setTheme(null);
    setPages([]);
  };

  const handleAfterMerge = () => {
    fetchTTags(inputSearch);
  };

  return (
    <>
      <AsyncCreatableSelect
        isLoading={loadingTags}
        isMulti
        cacheOptions={!allowCreateTags}
        value={tags}
        onChange={(e) => handleChange(e)}
        loadOptions={fetchTTags}
        createOptionPosition="first"
        styles={props.selectStyles}
        components={{ MultiValueLabel }}
        formatGroupLabel={formatGroupLabel}
      />
      {moreTags.length > 0 && (
        <div onClick={() => showMore()} className={styles.tagMore}>
          <span>{_("article.add_more")}</span>
        </div>
      )}
      <AntModal
        closable={false}
        visible={openTagModal}
        maskClosable={false}
        width={!editTag?.isSuperTag ? "65vw" : "45vw"}
        height="45vh"
        footer={null}
        onCancel={() => handleCloseModal()}
        destroyOnClose={true}
        zIndex="9999"
        bodyStyle={{ padding: "0" }}
      >
        <div className={homeStyles.modal_header}>
          {_("article.tag_modal_title")}
        </div>
        <div
          className={homeStyles.modal_close}
          onClick={() => handleCloseModal()}
        >
          <IconClose />
        </div>
        {editTag && (
          <>
            <div className={styles.modalTag}>
              <div className={styles.modalTag_left}>
                <h3>{_("article.tag_translate")}</h3>
                <div className={styles.formRow}>
                  <label
                    className={`${styles.configLabel} ${styles.configLabelFlex}`}
                  >
                    <img
                      src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/production/img/flags/FR.jpg`}
                    />
                    <span>{_("article.tag_name")} FR</span>
                  </label>
                  <input
                    className={styles.formInput}
                    value={editTag.nameFr}
                    onChange={(e) => {
                      setEditTag({ ...editTag, nameFr: e.target.value });
                    }}
                  />
                </div>
                <div className={styles.formRow}>
                  <label
                    className={`${styles.configLabel} ${styles.configLabelFlex}`}
                  >
                    <img
                      src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/production/img/flags/NL.jpg`}
                    />
                    <span>{_("article.tag_name")} NL</span>
                  </label>
                  <input
                    className={styles.formInput}
                    value={editTag.nameNl}
                    onChange={(e) => {
                      setEditTag({ ...editTag, nameNl: e.target.value });
                    }}
                  />
                </div>
                <div className={styles.formRow}>
                  <label
                    className={`${styles.configLabel} ${styles.configLabelFlex}`}
                  >
                    <img
                      src={`https://tamtam.s3-eu-west-1.amazonaws.com/cdn/widget/production/img/flags/EN.jpg`}
                    />
                    <span>{_("article.tag_name")} EN</span>
                  </label>
                  <input
                    className={styles.formInput}
                    value={editTag.nameEn}
                    onChange={(e) => {
                      setEditTag({ ...editTag, nameEn: e.target.value });
                    }}
                  />
                </div>

                <div className={styles.modalTag_controls}>
                  {loading ? (
                    <Button
                      variant="primary"
                      style={{
                        paddingTop: "15px",
                        paddingBottom: "15px",
                        marginLeft: "10px",
                      }}
                      className={styles.controls__ok}
                    >
                      <Loader
                        style={{
                          height: "10px",
                        }}
                        color={"#fff"}
                      />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      style={{ marginLeft: "30px" }}
                      onClick={() => translate()}
                    >
                      {_("article.translate", language)}
                    </Button>
                  )}
                </div>
              </div>
              <div className={styles.modalTag_right}>
                <h3>SuperTag</h3>

                {!editTag?.isSuperTag && (
                  <>
                    <div className={styles.formRow}>
                      <label className={styles.configLabel}>
                        {_("article.select_supertag")}
                      </label>
                      <AsyncSelect
                        cacheOptions
                        isClearable
                        value={superTag}
                        styles={props.selectStyles}
                        onChange={(e) => setSuperTag(e)}
                        loadOptions={fetchSuperTags}
                        classNamePrefix="custom-select"
                      />
                    </div>

                    <div className={styles.superTag_box}>
                      {!editTag.superTag && (
                        <>
                          <p className={styles.superTag_title}>
                            <span>{_("article.apply_all_tags")}</span>
                            <Switch
                              isChecked={applyAllSelection}
                              onChange={(e) => setApplyAllSelection(e)}
                            />
                          </p>

                          <p className={styles.tags_list}>
                            {tags?.map((tag) =>
                              !tag["__isNew__"] &&
                              !tag.tag.isSuperTag &&
                              !tag.tag.superTag ? (
                                <span className={styles.tag}>{tag.label}</span>
                              ) : null
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  </>
                )}

                <div className={styles.formRow}>
                  <label className={styles.configLabel}>
                    {_("article.theme")}
                  </label>
                  <AsyncSelect
                    cacheOptions
                    styles={props.selectStyles}
                    value={theme}
                    onChange={handleChangeTheme}
                    isLoading={loadingThemes}
                    loadOptions={fetchThemes}
                    defaultOptions={true}
                    getOptionLabel={(option) => option.title}
                    getOptionValue={(option) => option.id}
                    placeholder={_("article.select_theme")}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <label className={styles.configLabel}>
                    {_("article.page")}
                  </label>
                  <Select
                    styles={props.selectStyles}
                    isLoading={loadingThemes}
                    options={pageOptions}
                    className={styles.input}
                    placeholder={_("article.select_page")}
                    value={pages}
                    getOptionLabel={(option) => option.title}
                    getOptionValue={(option) => option.id}
                    onChange={(e) => setPages(e)}
                    isMulti
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalTag_footer}>
              {savingSuperTag && savingTag ? (
                <Button
                  variant="primary"
                  style={{ paddingTop: "15px", paddingBottom: "15px" }}
                  className={styles.controls__ok}
                >
                  <Loader
                    style={{
                      height: "10px",
                    }}
                    color={"#fff"}
                  />
                </Button>
              ) : (
                <Button
                  onClick={handleSaveTranslationSuperTag}
                  variant="primary"
                  style={{ marginRight: "15px" }}
                >
                  {_("article.save")}
                </Button>
              )}
              <Button onClick={() => handleCloseModal()} variant="default">
                {_("article.cancel")}
              </Button>
            </div>
          </>
        )}
      </AntModal>

      <TagMergeModal
        openModal={openMergeModal}
        setOpenModal={setOpenMergeModal}
        language={language}
        tags={searchTags}
        afterMerge={() => handleAfterMerge()}
      />
    </>
  );
}
