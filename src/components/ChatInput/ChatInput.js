import React, { Component } from "react";

import ReactModal from "react-modal";

import "./ChatInput.scss";

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      modalOpen: false,
      modalType: "",
      showPlusMenu: false
    };
    this.changeInput = this.changeInput.bind(this);
    this.onCtrlEnter = this.onCtrlEnter.bind(this);

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

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
    // this.openModal();
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

  render() {
    console.log("this.state", this.state);
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
                        modalType: "UploadImage"
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
                        modalType: "CodeSnippet"
                      });
                    }}
                  >
                    {" "}
                    Code Snippet{" "}
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
            <div>press ctrl + enter to send</div>
            <button
              className="send-button"
              disabled={this.state.input === "" ? true : false}
            >
              Send
            </button>
          </div>
        </form>

        <ReactModal
          isOpen={this.state.modalOpen}
          shouldCloseOnEsc={true}
          className="chat-modal"
          overlayClassName="chat-modal-overlay"
        >
          <button
            id="close-button"
            onClick={() => {
              this.closeModal();
            }}
          >
            X
          </button>
        </ReactModal>
      </div>
    );
  }
}

export default ChatInput;
