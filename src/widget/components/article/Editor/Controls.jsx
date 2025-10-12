import { useSelector } from "react-redux";

import Button from "../../common/Button";
import Loader from "../../common/Loader";
import _ from "../../../i18n";
import styles from "./Controls.module.scss";

export default function Controls(props) {
  const isSaving = useSelector((state) => state.articles.isSaving);
  const isSavingShare = useSelector((state) => state.articles.isSavingShare);
  const status = useSelector((state) => state.articles.article.status);
  const externalUrl = useSelector(
    (state) => state.articles.article.externalUrl
  );
  const { onCancel, action } = props;

  const renderBtnOK = () => {
    if (isSaving && !isSavingShare) {
      return (
        <Button
          variant="primary"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
        >
          <Loader
            style={{
              height: "10px",
            }}
            color={"#fff"}
          />
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => action(false)}
          variant="primary"
          disabled={isSavingShare}
        >
          {_("article.save")}
        </Button>
      );
    }
  };

  const renderBtnOKShare = () => {
    if (isSavingShare) {
      return (
        <Button
          variant="secondary"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
        >
          <Loader
            style={{
              height: "10px",
            }}
            color={"#fff"}
          />
        </Button>
      );
    } else {
      return (
        <Button
          onClick={() => action(true)}
          variant="secondary"
          disabled={isSaving}
        >
          {_("article.save_and_share")}
        </Button>
      );
    }
  };

  return (
    <div className={styles.controls}>
      <Button onClick={onCancel} variant="default">
        {_("article.cancel")}
      </Button>
      <div className={styles.saveContainer}>
        {status === "PROGRAMMED" && externalUrl.length > 0 && (
          <Button
            onClick={() => window.open(externalUrl, "_blank")}
            variant="secondary"
          >
            {_("article.got_to_source")}
          </Button>
        )}
        {renderBtnOK(props, isSaving)}
        {/* {["PUBLISHED", "SCHEDULED"].includes(status) &&
          renderBtnOKShare(props, isSavingShare)} */}
      </div>
    </div>
  );
}
