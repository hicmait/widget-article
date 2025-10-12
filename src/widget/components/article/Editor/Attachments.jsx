import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";

import _ from "../../../i18n";
import { IconUpload, IconTrash, IconPencil } from "../../common/Icons";
import Button from "../../common/Button";
import styles from "./Attachments.module.scss";

export default function Attachments({
  attachments,
  uploadingAttachment,
  onAttachmentsChange,
  onDeleteAttachment,
  onEditAttachment,
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  const handleDrop = (acceptedFiles, rejectedFiles) => {
    if (acceptedFiles.length === 0) return;
    onAttachmentsChange(acceptedFiles[0]);
  };

  const handleDelete = (index) => {
    onDeleteAttachment(index);
  };

  const handleEdit = (index, value) => {
    if (value.length < 3) {
      toast.error(
        toast.error(_("article.validate_title"), { autoClose: true })
      );
      return null;
    }

    onEditAttachment(index, value);
    setEditIndex(null);
  };

  const renderAttachments = () => {
    return attachments.map((a, i) => {
      if (a.inHistory) return null;

      return (
        <li key={i} className={styles.attachmentItem}>
          {editIndex == i ? (
            <>
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className={styles.formInput}
              />
              <Button size="sm" onClick={() => handleEdit(i, editText)}>
                {_("article.save")}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setEditText("");
                  setEditIndex(null);
                }}
              >
                {_("article.cancel")}
              </Button>
            </>
          ) : (
            <>
              <span>{a.name}</span>
              <div
                onClick={() => {
                  setEditText(a.name);
                  setEditIndex(i);
                }}
                className={styles.icon}
              >
                <IconPencil size={18} />
              </div>
            </>
          )}
          <div onClick={() => handleDelete(i)} className={styles.icon}>
            <IconTrash size={18} />
          </div>
        </li>
      );
    });
  };

  return (
    <div className={styles.attachmentsContainer}>
      <ul className="attachments-list">{renderAttachments()}</ul>
      <Dropzone
        disabled={uploadingAttachment}
        disableClick={uploadingAttachment}
        className={styles.attachmentsDropzone}
        onDrop={handleDrop}
        multiple={false}
      >
        {!uploadingAttachment ? (
          <div>
            <IconUpload size={40} />
            <p className={styles.dropzoneText}>{_("article.dropzone_text")}</p>
          </div>
        ) : (
          <div className={styles.dropzoneImg}>
            <svg
              height="32px"
              viewBox="0 0 48 48"
              width="32px"
              className={styles.rotating}
            >
              <path
                d="M42.28,11.851C38.238,5.42,31.105,1.135,22.95,1.135c-10.888,0-19.97,7.621-22.272,17.813  c-0.009,0-0.015-0.003-0.024-0.003c-0.018,0.104-0.027,0.2-0.044,0.302c-0.113,0.536-0.205,1.078-0.28,1.626l-0.022-0.024  c0,0-0.06,0.407-0.115,1.075c-0.005,0.057-0.018,0.113-0.022,0.17h0.009c-0.146,1.901-0.22,5.65,1.003,8.858  c0.006,0.016,0.012,0.029,0.018,0.045c0.209,0.671,0.434,1.29,0.66,1.835l0.008-0.008c0.486,1.202,0.891,1.856,0.891,1.856h0.01  c3.835,7.238,11.417,12.184,20.18,12.184c10.212,0,18.836-6.707,21.769-15.948h-4.018c-2.77,7.102-9.668,12.138-17.751,12.138  c-6.564,0-12.33-3.333-15.751-8.387l-0.007,0.014c0,0-0.049-0.078-0.128-0.214c-0.345-0.524-0.659-1.07-0.954-1.626  c-0.456-1.05-2.626-6.417-1.992-11.603c0.037-0.252,0.065-0.507,0.111-0.755c0.024-0.137,0.055-0.273,0.084-0.409  c1.811-8.638,9.46-15.128,18.638-15.128c7.108,0,13.281,3.904,16.551,9.674L32,22.095h4.407H37.5h4.408h3.821H47.9v-10.39V6.25  L42.28,11.851z"
                fill="currentColor"
              />
            </svg>
            <p className={styles.dropzoneText}>{_("article.loading")}</p>
          </div>
        )}
      </Dropzone>
    </div>
  );
}
