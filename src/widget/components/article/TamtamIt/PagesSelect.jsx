import React from "react";
import { connect } from "react-redux";
import Select from "react-select";

import _ from "i18n";

class PagesSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.props.onChange(value);
  }

  render() {
    const {
      selectedValues,
      themes,
      theme,
      fetching,
      selectStyles,
      language,
    } = this.props;

    const titleAttr = `title${
      language.charAt(0).toUpperCase() + language.slice(1)
    }`;

    const themeId = theme?.id !== undefined ? theme.id : null;
    let currentTheme = themeId
      ? themes.filter((item) => item.id == themeId)[0]
      : null;
    let pages = currentTheme && currentTheme.pages ? currentTheme.pages : [];
    let pageOptions = [];
    pages.forEach((page) => {
      const pageTitle =
        page[titleAttr] ||
        page["titleFr"] ||
        page["titleEn"] ||
        page["titleNl"];
      pageOptions.push({
        id: page.id,
        title: pageTitle,
      });
    });

    return (
      <Select
        styles={selectStyles}
        isLoading={fetching}
        options={pageOptions}
        placeholder={_("select_page")}
        value={selectedValues}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option.id}
        onChange={this.handleChange}
        isMulti
      />
    );
  }
}
const mapStateToProps = (store) => {
  return {
    themes: store.themes.items,
    fetching: store.themes.fetching,
  };
};
export default connect(mapStateToProps)(PagesSelect);
