import React, { Component } from "react";
import firebase from "../../../firebase";

import ReactModal from "react-modal";

import "./AdminModal.scss";

class AdminModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channelName: "",
      channelDescription: ""
    };
    this.changeInput = this.changeInput.bind(this);

    this.submitChannelEdit = this.submitChannelEdit.bind(this);
  }

  submitChannelEdit() {
    console.log("submit");
    let channelRef = firebase
      .database()
      .ref(
        `servers/${this.props.serverId}/channels/${this.props.modalType.key}`
      );
  }

  changeInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  componentDidMount() {
    console.log("ADMIN MODAL MOUNT");

    if (this.props.modalType.type === "edit channel") {
      //stuff
      let channelRef = firebase
        .database()
        .ref(
          `servers/${this.props.serverId}/channels/${this.props.modalType.key}`
        );

      channelRef.once("value", (snap) => {
        console.log("snap.val()", snap.val());
        //snap.val() is obj with name and description

        this.setState({
          channelName: snap.val().name,
          channelDescription: snap.val().description
        });
      });
    }
  }

  render() {
    // console.log("this.props", this.props);
    console.log("this.state", this.state);
    return (
      <ReactModal
        isOpen={true}
        className="admin-modal"
        overlayClassName="admin-modal-overlay"
      >
        <div>
          <button
            className="close-button"
            onClick={() => {
              this.props.toggleModal();
            }}
          >
            Close
          </button>
          {this.props.modalType.type}
          {this.props.modalType.type === "edit channel" ? (
            <div>
              Key: {this.props.modalType.key}
              <div>
                Channel Name:
                <input
                  onChange={(e) => this.changeInput(e)}
                  name="channelName"
                  placeholder="Channel name..."
                  value={this.state.channelName}
                />
              </div>
              <div>
                Channel Description
                <input
                  onChange={(e) => this.changeInput(e)}
                  name="channelDescription"
                  placeholder="Channel description..."
                  value={this.state.channelDescription}
                />
              </div>
              <button onClick={() => this.submitChannelEdit()}>
                Submit changes
              </button>
            </div>
          ) : (
            <div> ERROR </div>
          )}
        </div>
      </ReactModal>
    );
  }
}

export default AdminModal;
