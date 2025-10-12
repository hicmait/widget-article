import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Modal as AntModal } from "antd";

import Button from "../../common/Button";
import { IconClose } from "../../common/Icons";
import _ from "../../../i18n";
import MergeModal from "./MergeModal";
import styles from "./Tag.module.scss";
import homeStyles from "../TamtamIt/TamtamIt.module.scss";

export default function TagMergeModal({
  openModal,
  setOpenModal,
  language,
  tags,
  afterMerge,
}) {
  const translateLanguage = useSelector(
    (state) => state.articles.translateLanguage
  );
  const lng = translateLanguage ? translateLanguage : language;
  const [selectedTags, setSelectedTags] = useState([]);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const checkItem = (id) => {
    if (selectedTags.includes(id)) {
      setSelectedTags(selectedTags.filter((el) => el !== id));
    } else {
      setSelectedTags([...selectedTags, id]);
    }
  };

  const getNames = (tag) => {
    return (
      <ul className={styles.namesList}>
        {tag.nameFr && tag.nameFr.length > 0 && <li>{tag.nameFr}</li>}
        {tag.nameEn && tag.nameEn.length > 0 && <li>{tag.nameEn}</li>}
        {tag.nameNl && tag.nameNl.length > 0 && <li>{tag.nameNl}</li>}
      </ul>
    );
  };

  return (
    <>
      <AntModal
        closable={false}
        visible={openModal}
        maskClosable={false}
        width="65vw"
        height="45vh"
        footer={null}
        onCancel={() => handleCloseModal()}
        destroyOnClose={true}
        zIndex="9999"
        bodyStyle={{ padding: "0" }}
      >
        <div className={homeStyles.modal_header}>{_("article.merge")}</div>
        <div
          className={homeStyles.modal_close}
          onClick={() => handleCloseModal()}
        >
          <IconClose />
        </div>
        <div className={homeStyles.modal_body}>
          <div className={styles.bar}>
            <Button
              disabled={selectedTags.length < 2}
              className={`${styles.btn} ${
                selectedTags.length < 2 ? styles.disabled : ""
              }`}
              onClick={() => setMergeModalOpen(true)}
            >
              {_("article.merge")}
            </Button>
          </div>
          <div className={styles.table_data}>
            <table className={styles.tags_table}>
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th>{_("article.name")}</th>
                  <th>{_("article.usage_counter")}</th>
                </tr>
              </thead>
              <tbody>
                {tags.length > 0 &&
                  tags.map((tag) => (
                    <tr key={tag.value}>
                      <td className={styles.cell}>
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.value)}
                          onChange={() => checkItem(tag.value)}
                        />
                      </td>
                      <td className={styles.cell}>{`#${tag.value}`}</td>
                      <td className={styles.cell}>{getNames(tag.tag)}</td>
                      <td className={styles.cell}>{tag.tag.counter}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </AntModal>
      <MergeModal
        modalOpen={mergeModalOpen}
        onClose={() => {
          setSelectedTags([]);
          setMergeModalOpen(false);
        }}
        tags={tags.filter((el) => selectedTags.includes(el.tag.id))}
        language={lng}
        afterMerge={afterMerge}
      />
    </>
  );
}
