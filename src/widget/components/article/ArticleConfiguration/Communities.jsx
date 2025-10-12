import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import {
  fetchThemes,
  setArticle,
  setAllowCreateTags,
} from "../../../redux/actions";
import _ from "../../../i18n";

export default function Communities(props) {
  const user = useSelector((state) => state.auth.user);
  const community = useSelector((state) => state.articles.article.community);
  const tags = useSelector((state) => state.articles.article.tags);
  const { communities } = user;

  const dispatch = useDispatch();

  const communityOptions = [];
  communities.map((com) => {
    let logoBlock = null;
    if (com.avatarUrl != undefined && com.avatarUrl.length > 0) {
      logoBlock = (
        <span
          className="boxes__box__logo"
          style={{ backgroundImage: `url(${com.avatarUrl.avatarUrl})` }}
        ></span>
      );
    }

    communityOptions.push({
      value: com.id,
      label: com.name,
    });
  });

  const handleSelectCommunity = (e) => {
    dispatch(setArticle({ index: "community", value: e }));
    dispatch(setArticle({ index: "pages", value: [] }));
    dispatch(setArticle({ index: "theme", value: null }));
    //dispatch(setArticle({ index: "type", value: null }));

    const communityId = e.value;
    // dispatch(fetchThemes({ language: props.language, communityId })).then(
    //   (resp) => {
    //     let themes = resp.payload?.data?.data;
    //     if (themes && themes.length == 1) {
    //       dispatch(setArticle({ index: "theme", value: themes[0] }));
    //       if (themes[0].pages && themes[0].pages.length == 1) {
    //         let page = themes[0].pages[0];
    //         dispatch(setArticle({ index: "pages", value: [page] }));
    //       }
    //     }
    //   }
    // );

    // If the use does not have rigth to add tags for the new community,
    // then remove the tags that may have been added for a previous community
    const allowCreateTags = canCreateTags(communityId);
    dispatch(setAllowCreateTags(allowCreateTags));

    if (!allowCreateTags) {
      let tmpTags = tags.filter((t) => t["__isNew__"] === undefined);
      dispatch(setArticle({ index: "tags", value: tmpTags }));
    }
  };

  const canCreateTags = (communityId) => {
    let selectedCommunity = communities.filter((com) => com.id === communityId);
    if (selectedCommunity.length > 0) {
      return (
        selectedCommunity[0] &&
        selectedCommunity[0].blogs &&
        selectedCommunity[0].blogs.length > 0 &&
        selectedCommunity[0].blogs[0].preferences &&
        selectedCommunity[0].blogs[0].preferences.allowCreateTags == 1
      );
    }
    return false;
  };

  return (
    <Select
      styles={props.selectStyles}
      options={communityOptions}
      isSearchable={false}
      placeholder={_("article.select_community")}
      value={community}
      onChange={handleSelectCommunity}
    />
  );
}
