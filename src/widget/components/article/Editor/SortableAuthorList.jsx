import React from "react";
import { SortableContainer } from "react-sortable-hoc";

import SortableAuthor from "./SortableAuthor";

export default SortableContainer((props) => {
  let {
    authors,
    onDeleteAuthor,
    onChangeAuthor,
    auth,
    language,
    removable,
  } = props;

  let ids = [];

  let authorsJsx = authors.map((author, index) => {
    if (
      !author ||
      author.status === "DELETED" ||
      ids.indexOf(author.id) !== -1
    ) {
      return null;
    }
    ids.push(author.id);
    const isRemovable = () => {
      return (
        author.id !== auth.user.id ||
        (author.id == auth.user.id && authors.length > 1)
      );
    };
    return (
      <SortableAuthor
        authorsCount={authors.length}
        language={language}
        author={author}
        removable={removable ? removable : isRemovable()}
        onChange={onChangeAuthor}
        onDelete={onDeleteAuthor}
        index={index}
        key={author.id}
      />
    );
  });

  return <div>{authorsJsx}</div>;
});
