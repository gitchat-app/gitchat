import React, { Component } from "react";

import "./ChatInput.scss";

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: ""
    };
    this.changeInput = this.changeInput.bind(this);

    this.onCtrlEnter = this.onCtrlEnter.bind(this);
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

  render() {
    return (
      <div className="input-and-button">
        <form onSubmit={(e) => this.submitForm(e)}>
          <textarea
            value={this.state.input}
            rows="3"
            onChange={(e) => this.changeInput(e)}
            onKeyDown={this.onCtrlEnter}
            placeholder={`Send a message in ${this.props.channelName}...`}
          />
          <div className="button-area">
            <div>press ctrl + enter to send</div>
            <button disabled={this.state.input === "" ? true : false}>
              Send
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ChatInput;
