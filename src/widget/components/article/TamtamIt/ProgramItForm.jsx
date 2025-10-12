import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { arrayMoveImmutable } from "array-move";
import ClickAwayListener from "@mui/base/ClickAwayListener";

import Loader from "Common/Loader";
import Button from "Common/Button";
import { IconClose } from "Common/Icons";
import {
  persistTamtamIt,
  fetchAuthors,
  setArticle,
  resetArticle,
} from "Actions";
import _ from "i18n";
import { TTP_BLOG_URL } from "Config";

import MediaZone from "./MediaZone";
import styles from "./Sidebar.module.scss";
import configStyles from "../ArticleConfiguration/ArticleConfiguration.module.scss";
import SortableAuthorList from "../Editor/SortableAuthorList";
import AuthorSuggestion from "../Editor/AuthorSuggestion";
import Category from "../ArticleConfiguration/Category";
import Theme from "../ArticleConfiguration/Theme";
import Page from "../ArticleConfiguration/Page";
import TagsSelect from "./TagsSelect";
import { RenderPublishedAt } from "../ArticleConfiguration/ArticleStatus";
import { getDateLabel } from "../../../utils/common";

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

const ProgramItForm = (props) => {
  const [redactorSearch, setRedactorSearch] = useState("");
  const [showAuthors, setShowAuthors] = useState(false);
  const [assignedRedactor, setAssignedRedactor] = useState(null);
  const [feed, setFeed] = useState(props.feed);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const community = useSelector((state) => state.articles.article.community);
  const isSaving = useSelector((state) => state.tamtamit.saving);
  const auth = useSelector((state) => state.auth);
  const selectedLanguage = useSelector(
    (state) => state.articles.article.selectedLanguage
  );
  const publishedAt = useSelector(
    (state) => state.articles.article.publishedAt
  );
  const category = useSelector((state) => state.articles.article.category);
  const theme = useSelector((state) => state.articles.article.theme);
  const pages = useSelector((state) => state.articles.article.pages);
  const authors = useSelector((state) => state.articles.article.authors);
  const fetchingRedactors = useSelector((state) => state.users.fetchingAuthors);
  const redactors = useSelector((state) => state.users.authors);

  const dispatch = useDispatch();

  const { setImages } = props;

  useEffect(() => {
    if (theme || pages.length > 0 || category) {
      dispatch(resetArticle());
    }
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
        setSelectedCommunity(currentCommunity);
      }
    }
  }, [community]);

  const validate = () => {
    let { title, images } = feed;

    let errors = [];

    if (!images || images.length < 1) {
      errors.push(_("article.image_required"));
    }

    if (title.trim().length === 0) {
      errors.push(_("article.validate_title"));
    }
    if (!assignedRedactor) {
      errors.push(_("article.redactor_required"));
    }

    return errors;
  };
  const validateForm = () => {
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
      toast.error(<ErrorsContainer errors={errors} />, {
        autoClose: true,
      });
      return false;
    }
    return true;
  };

  const save = () => {
    if (!validateForm()) {
      return;
    }

    let { title, description, shortened_url } = feed;

    let data = {
      images: props.feed.images,
      title,
      description,
      shortened_url,
      status: "PROGRAMMED",
      language: props.language,
      tags: props.feed.tags,
      publishedAt,
      communityId: community.value,
      assignedRedactor: assignedRedactor.id,
      categoryId: category ? category.id : null,
      themeId: theme ? theme.id : null,
      pages,
      authors,
    };

    dispatch(persistTamtamIt(data)).then((resp) => {
      if (resp.error) {
        toast.error("Error", { autoClose: true });
      } else {
        props.handleFormCancel();
      }
    });
  };

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

  const handleChangeAuthor = (newAuthor) => {
    let newAuthors = [...authors];

    let index = -1;
    for (let i = 0; i < newAuthors.length; i++) {
      if (
        newAuthors[i].id === newAuthor.id &&
        newAuthors[i].isAuthor === newAuthor.isAuthor
      ) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      newAuthors.push(newAuthor);
    } else {
      newAuthors[index] = newAuthor;
    }
    dispatch(setArticle({ index: "authors", value: newAuthors }));
  };

  const handleDeleteAuthor = (author) => {
    let index = -1;
    for (let i = 0; i < authors.length; i++) {
      if (authors[i].id === author.id) {
        index = i;
        break;
      }
    }

    let newAuthors = authors.concat(); // For immutability
    // author.status = "DELETED";
    let newAuthor = Object.assign({}, author, { status: "DELETED" });

    if (index !== -1) {
      newAuthors[index] = newAuthor;
    }

    dispatch(setArticle({ index: "authors", value: newAuthors }));
  };

  useEffect(() => {
    if (selectedCommunity) {
      dispatch(
        fetchAuthors({
          word: redactorSearch,
          communityId: selectedCommunity.id,
          usersOnly: true,
        })
      );
    }
  }, [redactorSearch, selectedCommunity]);

  return (
    <div>
      {props.feed.existing_article && (
        <div className={styles.existingArticle}>
          {props.feed.existing_article.status === "PROGRAMMED" && (
            <p>
              {`${_("article.url_already_programmed")} `}
              {props.feed.existing_article.targetedUser && (
                <a
                  href={`${TTP_BLOG_URL}/${props.language}/author/${props.feed.existing_article.targetedUser.url}/${props.feed.existing_article.targetedUser.id}`}
                >
                  {`${props.feed.existing_article.targetedUser.firstName} ${props.feed.existing_article.targetedUser.lastName}`}
                </a>
              )}
            </p>
          )}
          {props.feed.existing_article.status === "PUBLISHED" && (
            <p>{`${_("article.url_already_published")} ${getDateLabel(
              props.feed.existing_article.publishedAt.date
            )}`}</p>
          )}
        </div>
      )}
      <MediaZone
        images={props.feed.images}
        selectedIndex={0}
        setImages={setImages}
      />

      <div className={styles.form_row}>
        <label className={styles.configLabel}>{_("article.title")}</label>

        <textarea
          className={styles.tt_title}
          rows={2}
          value={feed.title}
          onChange={(e) =>
            setFeed({
              ...feed,
              title: e.target.value,
            })
          }
        />
      </div>

      <div className={styles.form_row}>
        <label className={styles.configLabel}>{_("article.description")}</label>

        <textarea
          rows={3}
          value={feed.description}
          onChange={(e) =>
            setFeed({
              ...feed,
              description: e.target.value,
            })
          }
        />
      </div>

      <div className={configStyles.configContainer}>
        <div className={configStyles.authorsContainer}>
          <label
            className={`${configStyles.configLabel} ${styles.bottomPadding}`}
          >
            {_("article.authors_chains")}
          </label>
          <SortableAuthorList
            language={selectedLanguage}
            auth={auth}
            onChangeAuthor={(newAuthor) => handleChangeAuthor(newAuthor)}
            onDeleteAuthor={(author) => handleDeleteAuthor(author)}
            onSortEnd={onSortAuthorsEnd}
            helperClass={configStyles.sortableHelper}
            lockAxis="y"
            pressDelay={200}
            authors={authors}
            removable={true}
          />

          <div className={configStyles.addAuthor}>
            <AuthorSuggestion
              isProgrammed={true}
              selectedCommunity={selectedCommunity}
              selectedLanguage={selectedLanguage}
              authors={authors}
              onAuthorChange={handleChangeAuthor}
            />
          </div>
        </div>

        <div className={styles.rightContainer}>
          <div className={styles.configRow_noFlex}>
            <label className={configStyles.configLabel}>
              {_("article.category")}
            </label>
            <Category selectStyles={selectStyles} language={props.language} />
          </div>
          <div className={styles.configRow_noFlex}>
            <label className={configStyles.configLabel}>
              {_("article.theme")}
            </label>
            <Theme selectStyles={selectStyles} language={props.language} />
          </div>
          <div className={styles.configRow_noFlex}>
            <label className={configStyles.configLabel}>
              {_("article.page")}
            </label>
            <Page selectStyles={selectStyles} language={props.language} />
          </div>
          <div className={configStyles.configRow}>
            <RenderPublishedAt dispatch={dispatch} selectedStatus="PUBLISHED" />
          </div>

          <div className={styles.configRow_noFlex}>
            <label className={configStyles.configLabel}>
              {_("article.tag")}
            </label>
            <TagsSelect
              language={props.language}
              selectedCommunity={props.feed.community}
              selectedTags={props.feed.tags}
              selectStyles={selectStyles}
              onChange={props.handleTagsChange}
            />
          </div>
        </div>

        <div className={styles.redactors}>
          <label className={configStyles.configLabel}>
            {_("article.pick_author")}
          </label>
          {assignedRedactor ? (
            <div className={styles.authorCard}>
              <span
                className={styles.close}
                onClick={() => setAssignedRedactor(null)}
              >
                <IconClose />
              </span>
              <div
                className={styles.authorAvatar}
                style={{
                  backgroundImage: `url(${
                    assignedRedactor.avatar ? assignedRedactor.avatar : null
                  })`,
                }}
              ></div>
              <div className={styles.authorName}>
                {`${assignedRedactor.firstName} ${assignedRedactor.lastName}`}
              </div>
            </div>
          ) : (
            <>
              <input
                className={styles.authorInput}
                placeholder={_("article.pick_author")}
                onFocus={() => setShowAuthors(true)}
                onChange={(e) => setRedactorSearch(e.target.value)}
                value={redactorSearch}
              />
              {showAuthors && (
                <ClickAwayListener onClickAway={() => setShowAuthors(false)}>
                  <div className={styles.authorsList}>
                    {fetchingRedactors ? (
                      <p>{_("loading_authors")}</p>
                    ) : (
                      redactors.users &&
                      redactors.users.length > 0 && (
                        <ul>
                          {redactors.users.map((author) => (
                            <li
                              onClick={() => {
                                setAssignedRedactor(author);
                                setShowAuthors(false);
                              }}
                            >
                              <div
                                className={styles.authorAvatar}
                                style={{
                                  backgroundImage: `url(${
                                    author.avatar ? author.avatar : null
                                  })`,
                                }}
                              ></div>
                              <div className={styles.authorName}>
                                {`${author.firstName} ${author.lastName}`}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </ClickAwayListener>
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <Button onClick={props.handleFormCancel} variant="default">
          {_("article.cancel")}
        </Button>
        <div className={styles.saveContainer}>
          {isSaving ? (
            <Button
              variant="primary"
              style={{
                paddingTop: "15px",
                paddingBottom: "15px",
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
              onClick={() => save()}
              className={styles.controls__ok}
              variant="primary"
            >
              {_("article.save")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramItForm;
