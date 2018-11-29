import React, { Component } from "react";

import ReactModal from "react-modal";
import firebase from "../../firebase";

import "./ChatInput.scss";

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      modalOpen: false,
      modalType: "",
      showPlusMenu: false,
      imageUrl: "",
      snippet: "",
      imageComment: ""
    };
    this.changeInput = this.changeInput.bind(this);
    this.onCtrlEnter = this.onCtrlEnter.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.sendSnippet = this.sendSnippet.bind(this);
    this.sendImageMessage = this.sendImageMessage.bind(this);

    this.closePlusMenu = this.closePlusMenu.bind(this);
  }

  onCtrlEnter(e) {
    // console.log("e.keyCode", e.keyCode);

    if (e.keyCode === 13 && e.ctrlKey && this.state.input !== "") {
      console.log("BOTH PRESSED AND NOT EMPTY STRING");
      this.props.sendMessage(this.state.input);
      this.setState({ input: "" });
    }
  }

  changeInput(e) {
    this.setState({ input: e.target.value });
  }

  submitForm(e) {
    e.preventDefault();

    this.props.sendMessage(this.state.input);
    this.setState({ input: "" });
  }

  clickPlus(e) {
    e.preventDefault();

    this.setState({ showPlusMenu: true }, () => {
      document.addEventListener("click", this.closePlusMenu);
    });
  }

  closePlusMenu() {
    this.setState({ showPlusMenu: false }, () => {
      document.removeEventListener("click", this.closePlusMenu);
    });
  }

  openModal() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  async uploadImage() {
    console.log("uploading image");
    let uploader = document.getElementById("uploader").files[0];
    let fileRef = firebase.storage().ref(`chat_images/${uploader.name}`);
    await fileRef.put(uploader);
    await fileRef.getDownloadURL().then((url) => {
      console.log("url", url);
      this.setState({ imageUrl: url });
    });
  }

  sendSnippet(snippet) {
    this.props.sendMessage(snippet);
    this.setState({ snippet: "" });
    this.closeModal();
  }

  sendImageMessage() {
    if (this.state.imageComment) {
      this.props.sendMessage(
        `![image](${this.state.imageUrl})\n ${this.state.imageComment}`
      );
      this.setState({ imageComment: "", imageUrl: "" });
    } else {
      this.props.sendMessage(`![image](${this.state.imageUrl})`);
      this.setState({ imageComment: "", imageUrl: "" });
    }

    this.closeModal();
  }

  render() {
    // console.log("this.state", this.state);
    return (
      <div className="input-and-button">
        <form onSubmit={(e) => this.submitForm(e)}>
          <textarea
            value={this.state.input}
            rows="3"
            onChange={(e) => this.changeInput(e)}
            onKeyDown={this.onCtrlEnter}
            placeholder={this.props.placeholder}
          />
          <div className="button-area">
            <div className="plus-container">
              {this.state.showPlusMenu ? (
                <div className="menu">
                  <button
                    className="menu-button"
                    onClick={() => {
                      this.setState({
                        modalOpen: true,
                        modalType: "Upload Image"
                      });
                    }}
                  >
                    Upload Image
                  </button>
                  <button
                    className="menu-button"
                    onClick={() => {
                      this.setState({
                        modalOpen: true,
                        modalType: "Code Snippet"
                      });
                    }}
                  >
                    Code Snippet
                  </button>
                </div>
              ) : null}

              <button
                className="plus-button"
                onClick={(e) => this.clickPlus(e)}
              >
                +
              </button>
            </div>
            <div className="send-container">
              <div>press ctrl + enter to send</div>
              <button
                className="send-button"
                disabled={this.state.input === "" ? true : false}
              >
                Send
              </button>
            </div>
          </div>
        </form>

        <ReactModal
          isOpen={this.state.modalOpen}
          shouldCloseOnEsc={true}
          className="chat-modal"
          overlayClassName="chat-modal-overlay"
        >
          <button
            className="close-button"
            onClick={() => {
              this.closeModal();
            }}
          >
            Cancel
          </button>
          <div className="whole-modal">
            {/* <div>{this.state.modalType}</div> */}

            {this.state.modalType === "Code Snippet" ? (
              <div className="snippet-container">
                <h3>Code Snippet</h3>
                <textarea
                  onChange={(e) => this.setState({ snippet: e.target.value })}
                  placeholder="Paste code here..."
                />
                <button
                  onClick={() =>
                    this.sendSnippet("```\n" + this.state.snippet + "\n```")
                  }
                  disabled={!this.state.snippet}
                >
                  Post Snippet
                </button>
              </div>
            ) : this.state.modalType === "Upload Image" ? (
              <div className="upload-container">
                <h3>Image Uploader</h3>
                <input value={this.state.imageUrl} />
                <input
                  type="file"
                  id="uploader"
                  onChange={(e) => this.uploadImage(e)}
                />
                <p>Image message:</p>
                <textarea
                  onChange={(e) =>
                    this.setState({ imageComment: e.target.value })
                  }
                  placeholder="Type image comment..."
                />
                <button
                  onClick={() => this.sendImageMessage()}
                  disabled={!this.state.imageUrl}
                >
                  Post Image
                </button>
              </div>
            ) : (
              <div>Error</div>
            )}
          </div>
        </ReactModal>
      </div>
    );
  }
}

export default ChatInput;
