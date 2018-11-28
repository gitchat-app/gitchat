import React, { Component } from "react";

import ReactModal from "react-modal";

import "./AdminModal.scss";

class AdminModal extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    console.log("this.props", this.props);
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
          {this.props.modalType.type}
        </div>
      </ReactModal>
    );
  }
}

export default AdminModal;
