import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { arrayMoveImmutable } from "array-move";
import { Rating } from "react-simple-star-rating";

import {
  fetchCategories,
  fetchTypes,
  fetchThemes,
  setArticle,
  setCommunity,
} from "../../../redux/actions";
import Switch from "../../common/Switch/Switch";
import DisabledSwitch from "../../common/Switch/Switch/DisabledSwitch";
import Communities from "./Communities";
import Category from "./Category";
import Types from "./Types";
import Theme from "./Theme";
import Page from "./Page";
import Tag from "./Tag";
import Language from "./Language";
import Scope from "./Scope";
import GroupsSelect from "./GroupsSelect";
import ArticleStatus from "./ArticleStatus";
import Notification from "./Notification";
import RecurrentDate from "./RecurrentDate";
import AuthorSuggestion from "../Editor/AuthorSuggestion";
import SortableAuthorList from "../Editor/SortableAuthorList";
import Attachments from "../Editor/Attachments";
import _ from "../../../i18n";
import styles from "./ArticleConfiguration.module.scss";

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "none",
    backgroundColor: state.isDisabled ? "#e6e6e6" : "#fff",
    boxShadow: "none",
    border: "none",
    borderBottom: state.isFocused ? "1px solid #2495E1" : "1px solid #CED4DB",
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
  }),
  multiValue: (provided, { data }) => ({
    ...provided,
    backgroundColor: data.color ? data.color : "#F1F2F4",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    fontSize: ".75rem",
    textTransform: "uppercase",
    color: "inherit",
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

const getAllowedLanguages = (community) => {
  return community &&
    community.blogs &&
    community.blogs.length > 0 &&
    community.blogs[0].preferences &&
    community.blogs[0].preferences.allowedLanguages
    ? community.blogs[0].preferences.allowedLanguages
    : [];
};

const ArticleConfiguration = (props) => {
  const ttpApiUrl = useSelector((state) => state.params.ttpApiUrl);
  const categories = useSelector((state) => state.categories.items);
  const auth = useSelector((state) => state.auth);
  const community = useSelector((state) => state.articles.article.community);
  const authors = useSelector((state) => state.articles.article.authors);
  const isPrivate = useSelector((state) => state.articles.article.isPrivate);
  const isfffLibrary = useSelector(
    (state) => state.articles.article.isfffLibrary
  );
  const canBeShared = useSelector(
    (state) => state.articles.article.canBeShared
  );
  const comment = useSelector((state) => state.articles.article.comment);
  const privateGroups = useSelector(
    (state) => state.articles.article.privateGroups
  );
  const editArticleId = useSelector((state) => state.articles.article.id);
  const [allowedLanguages, setAllowedLanguages] = useState([]);
  const [allowedScopes, setAllowedScopes] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const dispatch = useDispatch();

  const scope = useSelector((state) => state.articles.article.scope);
  const relevance = useSelector((state) => state.articles.article.relevance);
  const fffLibrary = useSelector((state) => state.articles.article.fffLibrary);
  const status = useSelector((state) => state.articles.article.status);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories({ language: props.selectedLanguage }));
    }
    dispatch(fetchTypes({ language: props.selectedLanguage }));
    if (community && props.selectedLanguage) {
      const communityId = community ? community.value : null;
      // dispatch(fetchThemes({ language: props.selectedLanguage, communityId }));
      dispatch(setCommunity(communityId));
    }
    if (!editArticleId) {
      if (props.articleSharingOptions.includes("COLLEAGUE")) {
        dispatch(setArticle({ index: "canBeShared", value: true }));
      }
      if (props.articleSharingOptions.includes("FFF_LIBRARY")) {
        dispatch(setArticle({ index: "isfffLibrary", value: true }));
      }
    }
  }, []);
  useEffect(() => {
    if (
      auth.user &&
      community &&
      auth.user.communities &&
      auth.user.communities.length > 0
    ) {
      const currentCommunity = auth.user.communities.filter(
        (com) => com.id == community.value
      )[0];
      if (currentCommunity) {
        dispatch(setCommunity(currentCommunity.id));
        setSelectedCommunity(currentCommunity);
        setAllowedLanguages(getAllowedLanguages(currentCommunity));
        // if (!editArticleId) {
        //   dispatch(
        //     setArticle({
        //       index: "scope",
        //       value: getDefaultScope(currentCommunity),
        //     })
        //   );
        // }
        // setAllowedScopes(getAllowedScopes(currentCommunity));
      }
    }
  }, [community]);

  useEffect(() => {
    if (!scope.includes("PUBLIC")) {
      dispatch(setArticle({ index: "isfffLibrary", value: false }));
      dispatch(setArticle({ index: "canBeShared", value: false }));
    }
  }, [scope]);

  const onSortAuthorsEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }

    let oldPriority = authors[oldIndex].priority;
    let newPriority = authors[newIndex].priority;

    let newAuthorsOrder = arrayMoveImmutable(authors, oldIndex, newIndex);
    newAuthorsOrder[newIndex] = {
      ...newAuthorsOrder[newIndex],
      priority: newPriority,
    };
    newAuthorsOrder[oldIndex] = {
      ...newAuthorsOrder[oldIndex],
      priority: oldPriority,
    };

    dispatch(setArticle({ index: "authors", value: newAuthorsOrder }));
  };

  const handleRelevance = (rate) => {
    dispatch(setArticle({ index: "relevance", value: rate }));
  };

  if (props.activeTab !== "CONFIGURATION") {
    return null;
  }

  return (
    <div className={styles.configContainer}>
      <div className={styles.authorsContainer}>
        <SortableAuthorList
          language={props.selectedLanguage}
          auth={auth}
          onChangeAuthor={(newAuthor) => props.onChangeAuthor(newAuthor)}
          onDeleteAuthor={(author) => props.onDeleteAuthor(author)}
          onSortEnd={onSortAuthorsEnd}
          // helperClass={styles.sortableHelper}
          authors={authors}
        />

        <div className={styles.addAuthor}>
          <AuthorSuggestion
            selectedCommunity={selectedCommunity}
            selectedLanguage={props.selectedLanguage}
            authors={authors}
            onAuthorChange={props.onChangeAuthor}
          />
        </div>
      </div>

      <div className={styles.rightContainer}>
        <div className={styles.configRow}>
          <div className={styles.configColumn}>
            <label className={styles.configLabel}>
              {_("article.community")}
            </label>
            <Communities
              selectStyles={selectStyles}
              language={props.language}
            />
          </div>
          <div className={styles.configColumn}>
            <label className={styles.configLabel}>
              {_("article.category")}
            </label>
            <Category
              setCategory={props.setCategory}
              category={props.category}
              selectStyles={selectStyles}
              language={props.language}
            />
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={styles.configColumn}>
            <label className={styles.configLabel}>{_("article.tag")}</label>
            <Tag selectStyles={selectStyles} language={props.language} />
          </div>

          <div className={`${styles.configColumn} ${styles.switchContainer}`}>
            <label className={styles.configLabel}>
              {_("article.language")}
            </label>
            <Language
              allowedLanguages={allowedLanguages}
              language={props.selectedLanguage}
              selectStyles={selectStyles}
              content={props.content}
            />
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={styles.configColumn}>
            <label className={styles.configLabel}>{_("article.theme")}</label>
            <Theme
              selectStyles={selectStyles}
              language={props.selectedLanguage}
            />
          </div>

          <div className={styles.configColumn}>
            <label className={styles.configLabel}>{_("article.page")}</label>
            <Page
              setPages={props.setPages}
              pages={props.pages}
              selectStyles={selectStyles}
              language={props.selectedLanguage}
            />
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={styles.configColumn}>
            <label className={styles.configLabel}>{_("article.type")}</label>
            <Types
              setType={props.setType}
              type={props.type}
              selectStyles={selectStyles}
              language={props.language}
            />
          </div>

          <div className={styles.configColumn}>
            <label className={styles.configLabel}>{_("article.comment")}</label>
            <div>
              <textarea
                className={styles.comment}
                rows="2"
                value={comment}
                onChange={(e) =>
                  dispatch(
                    setArticle({ index: "comment", value: e.target.value })
                  )
                }
                placeholder={_("article.add_comment")}
              ></textarea>
            </div>
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={styles.configColumn}>
            <div className={styles.switchRow}>
              <label className={styles.configLabel}>
                {_("article.is_private")}
              </label>
              <Switch
                isChecked={isPrivate}
                onChange={(e) =>
                  dispatch(setArticle({ index: "isPrivate", value: e }))
                }
              />
            </div>
          </div>
          {isPrivate && (
            <div className={styles.configColumn}>
              <label className={styles.configLabel}>
                {_("article.subscribers_groups")}
              </label>
              <GroupsSelect
                isMulti={true}
                selectedGroups={privateGroups}
                onChange={(groups) =>
                  dispatch(
                    setArticle({ index: "privateGroups", value: groups })
                  )
                }
                auth={auth}
                community={community}
                selectStyles={selectStyles}
                ttpApiUrl={ttpApiUrl}
              />
            </div>
          )}
        </div>

        <div className={styles.configRow}>
          <div className={`${styles.configColumn}`}>
            <div className={`${styles.switchContainerr}`}>
              <label className={styles.configLabel}>{_("article.scope")}</label>

              <Scope
                checkedItems={scope}
                setCheckedItems={() => console.log("ssss")}
                setSelectedGroups={() => console.log("ssss")}
                selectedGroups={[]}
                auth={auth}
                community={community}
                selectStyles={selectStyles}
              />
            </div>

            {props.articleSharingOptions.includes("FFF_LIBRARY") && (
              <>
                <div className={styles.switchRow} style={{ marginTop: "40px" }}>
                  <label className={styles.configLabel}>
                    {_("article.fff_library")}
                  </label>

                  {fffLibrary === "ACCEPTED" ||
                  fffLibrary === "REJECTED" ||
                  !scope.includes("PUBLIC") ? (
                    <DisabledSwitch isChecked={isfffLibrary} />
                  ) : (
                    <Switch
                      isChecked={isfffLibrary}
                      onChange={(e) =>
                        dispatch(
                          setArticle({ index: "isfffLibrary", value: e })
                        )
                      }
                    />
                  )}
                </div>
                <p style={{ lineHeight: "16px", marginTop: "10px" }}>
                  <small>
                    Attention une fois accepté par FFF vous ne pouvez plus
                    modifier l'article
                  </small>
                </p>
              </>
            )}

            {props.articleSharingOptions.includes("COLLEAGUE") && (
              <div className={styles.switchRow}>
                <label className={styles.configLabel}>
                  Partager avec les confrères
                </label>

                {fffLibrary === "ACCEPTED" || !scope.includes("PUBLIC") ? (
                  <DisabledSwitch isChecked={canBeShared} />
                ) : (
                  <Switch
                    isChecked={canBeShared}
                    onChange={(e) =>
                      dispatch(setArticle({ index: "canBeShared", value: e }))
                    }
                  />
                )}
              </div>
            )}
          </div>

          <div className={`${styles.configColumn}`}>
            <div className={` ${styles.switchContainer}`}>
              <label className={styles.configLabel}>
                {_("article.status")}
              </label>
              <ArticleStatus
                // selectedStatus={props.status}
                // setStatus={props.setStatus}
                community={selectedCommunity}
                // publishedAt={props.publishedAt}
                // setPublishedAt={props.setPublishedAt}
                publishOnWorkflow={props.publishOnWorkflow}
                setPublishOnWorkflow={props.setPublishOnWorkflow}
              />
            </div>

            {(status === "SCHEDULED" || status === "PUBLISHED") && (
              <div
                className={styles.switchContainer}
                style={{ margin: "40px 0 50px" }}
              >
                <label className={styles.configLabel}>
                  {_("article.notification")}
                </label>
                <Notification
                  selectStyles={selectStyles}
                  activeTab={props.activeTab}
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.configRow}>
          <div className={`${styles.configColumn} ${styles.switchContainerr}`}>
            <label className={styles.configLabel}>
              {_("article.relevance")}
            </label>
            <div>
              <Rating
                onClick={handleRelevance}
                initialValue={relevance}
                size={22}
                fillColor="#18a0fb"
                showTooltip
                tooltipArray={[
                  "very bad",
                  "bad",
                  "medium",
                  "good",
                  "very good",
                ]}
              />
            </div>
          </div>

          <div className={styles.configColumn}>
            <label className={styles.configLabel}>
              {_("article.recurrence")}
            </label>
            <RecurrentDate selectStyles={selectStyles} />
          </div>
        </div>

        <div className={styles.attachmentsRow}>
          <label className={styles.configLabel}>
            {_("article.attachments")}
          </label>
          <Attachments
            attachments={props.attachments}
            uploadingAttachment={props.uploadingAttachment}
            onAttachmentsChange={props.handleAttachmentsChange}
            onDeleteAttachment={props.handleDeleteAttachment}
            onEditAttachment={props.handleEditAttachment}
          />
        </div>
      </div>
    </div>
  );
};
export default ArticleConfiguration;
