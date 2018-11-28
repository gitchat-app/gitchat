import React, { Component } from "react";

import ReactModal from "react-modal";

import "./AdminModal.scss";

class AdminModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    console.log("this.props.modalType", this.props.modalType);
    return (
      <ReactModal
        isOpen={true}
        className="admin-modal"
        overlayClassName="admin-modal-overlay"
      >
        <div>
          <button
            onClick={() => {
              this.props.toggleModal();
            }}
          >
            Close
          </button>
          inside modal
        </div>
      </ReactModal>
    );
  }
}

export default AdminModal;
