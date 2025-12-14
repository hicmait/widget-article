import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import styles from "./MergeModal.module.scss";
import _ from "../../../../i18n";
import { mergeTags } from "../../../../api";
import Button from "../../../common/Button";
import Loader from "../../../common/Loader";

export default function MergeModal({
  modalOpen,
  onClose,
  tags,
  afterMerge,
  language,
}) {
  const ttpApiUrl = useSelector((state) => state.params.ttpApiUrl);
  const auth = useSelector((state) => state.auth);
  const { token } = auth;
  const nameAttr = `name${
    language.charAt(0).toUpperCase() + language.slice(1)
  }`;
  const [destination, setDestination] = useState(null);
  const [fullMerge, setFullMerge] = useState(false);
  const [merging, setMerging] = useState(false);
  useEffect(() => {
    if (tags.length >= 2) {
      setDestination(tags[0].tag.id);
    }
  }, [tags]);

  const resetData = () => {
    setFullMerge(false);
    setDestination(null);
    onClose();
  };

  const merge = async () => {
    const tab = [];
    tags.forEach((el) => {
      if (el.tag.id !== destination) {
        tab.push(el.tag.id);
      }
    });
    try {
      setMerging(true);
      await mergeTags({
        ttpApiUrl,
        token,
        data: {
          destination,
          fullMerge,
          source: tab.join(),
        },
      });
      setMerging(false);
      // queryClient.invalidateQueries(["fetchTags"]);
      if (afterMerge) afterMerge();
      resetData();
      toast.success(_("article.saved_successfully"));
    } catch (error) {
      setMerging(false);
      toast.error(_("article.error_occurred"));
    }
  };

  if (tags.length < 2) {
    return null;
  }
  return (
    <Modal
      className={styles.modal}
      title={""}
      visible={modalOpen}
      onCancel={() => onClose()}
      footer={null}
      zIndex="99999"
    >
      <div className={styles.modal_content}>
        <p className={styles.question}>
          {_("article.merge_question")}{" "}
          {tags.length === 2 && (
            <>
              <strong>
                <em>
                  {tags[0].tag[nameAttr]}(#{tags[0].tag.id})
                </em>
              </strong>{" "}
              {_("article.and")}{" "}
              <strong>
                <em>
                  {tags[1].tag[nameAttr]}(#{tags[1].tag.id})
                </em>
              </strong>
            </>
          )}
        </p>

        <select
          value={destination}
          onChange={(e) => setDestination(parseInt(e.target.value))}
        >
          {tags.map((tag) => (
            <option value={tag.tag.id}>
              {_("article.keep")} {tag.tag[nameAttr]}(#{tag.tag.id}){" "}
              {_("article.as_principle")}
            </option>
          ))}
        </select>

        <div className={styles.inputForm}>
          <input
            type="checkbox"
            name="check"
            id="check"
            value={fullMerge}
            onChange={() => setFullMerge(!fullMerge)}
          />
          <label htmlFor="check"> {_("article.merge_and_delete")} </label>
        </div>
        <div className={styles.actions}>
          <Button onClick={() => resetData()} variant="default">
            {_("article.cancel")}
          </Button>

          {merging ? (
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
            <Button onClick={merge} variant="primary">
              {_("article.merge")}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
