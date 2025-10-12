import React from "react";
import { Modal } from "antd";

import { IconTime } from "Common/Icons";
import styles from "./TamtamIt.module.scss";
import stylo from "./SharingHistory.module.scss";
import SharingHistoryItem from "./SharingHistoryItem";
import _ from "i18n";

class SharingHistory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };
    this.handleAction = this.handleAction.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleAction() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  render() {
    const { data } = this.props;
    const { modalOpen } = this.state;

    return (
      <>
        <div className={stylo.action2} onClick={this.handleAction}>
          <IconTime size="17" />
        </div>
        <Modal
          closable={false}
          visible={modalOpen}
          width="80vw"
          height="50vh"
          footer={null}
          onCancel={this.closeModal}
          destroyOnClose={true}
          zIndex={9999}
          bodyStyle={{ padding: "0" }}
        >
          <div className={styles.modal_header}>
            <IconTime size="17" className={styles.modal_icon} />
            {_("article.share_history")}
          </div>
          <div className={styles.modal_close} onClick={this.closeModal}>
            <i className="icon-ttp-close"></i>
          </div>
          <div className={styles.modal_body}>
            <div className={styles.historylist}>
              {data && data.length > 0
                ? data.map((history, key) => (
                    <SharingHistoryItem key={`history-key`} {...history} />
                  ))
                : null}
            </div>
          </div>
        </Modal>
      </>
    );
  }
}

export default SharingHistory;
