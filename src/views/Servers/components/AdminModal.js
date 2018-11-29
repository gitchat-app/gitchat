import React, { Component } from "react";
import firebase from "../../../firebase";

import ReactModal from "react-modal";

import "./AdminModal.scss";

class AdminModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channelName: "",
      channelDescription: "",
      serverName: "",
      serverIcon: "",
      serverDescription: ""
    };
    this.changeInput = this.changeInput.bind(this);

    this.submitChannelEdit = this.submitChannelEdit.bind(this);
    this.submitServerEdit = this.submitServerEdit.bind(this);

    this.submitNewChannel = this.submitNewChannel.bind(this);
  }

  submitServerEdit() {
    console.log("server edit submit");

    let serverRef = firebase.database().ref(`servers/${this.props.serverId}`);

    serverRef.child("name").set(this.state.serverName);
    serverRef.child("icon").set(this.state.serverIcon);
    serverRef.child("description").set(this.state.serverDescription);

    this.props.toggleModal();
  }

  submitNewChannel() {
    let channelsRef = firebase
      .database()
      .ref(`servers/${this.props.serverId}/channels`);

    channelsRef.push({
      name: this.state.channelName,
      description: this.state.channelDescription
    });

    this.props.toggleModal();
  }

  submitChannelEdit() {
    console.log("submit");
    let channelRef = firebase
      .database()
      .ref(
        `servers/${this.props.serverId}/channels/${this.props.modalType.key}`
      );

    channelRef.set({
      name: this.state.channelName,
      description: this.state.channelDescription
    });

    this.props.toggleModal();
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
        // console.log("snap.val()", snap.val());
        //snap.val() is obj with name and description

        this.setState({
          channelName: snap.val().name,
          channelDescription: snap.val().description
        });
      });
    } else if (this.props.modalType.type === "edit server") {
      console.log("EDIT SERVER");

      let serverRef = firebase.database().ref(`servers/${this.props.serverId}`);

      serverRef.once("value", (snap) => {
        console.log("snap.val()", snap.val());

        this.setState({
          serverIcon: snap.val().icon,
          serverName: snap.val().name,
          serverDescription: snap.val().description
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
          {/* {this.props.modalType.type} */}
          {this.props.modalType.type === "edit channel" ? (
            <div>
              {/* Key: {this.props.modalType.key} */}
              Edit Channel
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
          ) : this.props.modalType.type === "add channel" ? (
            <div>
              Add New Channel
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
              <button onClick={() => this.submitNewChannel()}>
                Add channel{" "}
              </button>
            </div>
          ) : this.props.modalType.type === "edit server" ? (
            <>
              Edit Server
              <div>
                Server Name:
                <input
                  onChange={(e) => this.changeInput(e)}
                  name="serverName"
                  placeholder="Server name..."
                  value={this.state.serverName}
                />
              </div>
              <div>
                Server Description:
                <input
                  onChange={(e) => this.changeInput(e)}
                  name="serverDescription"
                  placeholder="Server Description..."
                  value={this.state.serverDescription}
                />
              </div>
              <div>
                Server Icon URL:
                <input
                  onChange={(e) => this.changeInput(e)}
                  name="serverIcon"
                  placeholder="Server Icon..."
                  value={this.state.serverIcon}
                />
              </div>
              <button onClick={() => this.submitServerEdit()}>
                Submit changes
              </button>
            </>
          ) : this.props.modalType.type === "add admin" ? (
            <div>add admin stuff</div>
          ) : (
            <div> ERROR </div>
          )}
        </div>
      </ReactModal>
    );
  }
}

export default AdminModal;
