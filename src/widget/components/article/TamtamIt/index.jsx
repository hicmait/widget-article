import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "react-modal";

import { IconClose } from "Common/Icons";
import _ from "i18n";
import { toggleTamtamitModal, resetArticle } from "Actions";

import articleStyles from "../AddArticle/AddArticle.module.scss";

import Sidebar from "./Sidebar";

const TamtamIt = (props) => {
  const openedModal = useSelector((state) => state.tamtamit.openedModal);
  const dispatch = useDispatch();

  const handleCloseModal = () => {
    dispatch(toggleTamtamitModal());
    dispatch(resetArticle());
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={openedModal}
      onRequestClose={handleCloseModal}
      className={{
        base: articleStyles.modalContent,
        afterOpen: articleStyles.modalContentAfterOpen,
        beforeClose: articleStyles.modalContentBeforeClose,
      }}
      overlayClassName={{
        base: articleStyles.modalOverlay,
        afterOpen: articleStyles.modalOverlayAfterOpen,
        beforeClose: articleStyles.modalOverlayBeforeClose,
      }}
      closeTimeoutMS={300}
    >
      <div className={articleStyles.modal}>
        <div className={articleStyles.close} onClick={handleCloseModal}>
          <IconClose size={17} />
        </div>
        <div id="ttp-tamtamit" className={articleStyles.body}>
          <Sidebar
            language={props.language}
            hideSidebar={() => handleCloseModal()}
            dispatch={dispatch}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TamtamIt;
