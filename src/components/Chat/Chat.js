import React, { Component } from "react";

import "./Chat.scss";

import firebase from "../../firebase";
import MessageCard from "../MessageCard/MessageCard";
import Users from "../Users/Users";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: {},

      input: ""
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.getMessages = this.getMessages.bind(this);

    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.onCtrlEnter = this.onCtrlEnter.bind(this);
  }

  onCtrlEnter(e) {
    // console.log("e.keyCode", e.keyCode);

    if (e.keyCode === 13 && e.ctrlKey && this.state.input !== "") {
      console.log("BOTH PRESSED AND NOT EMPTY STRING");
      this.sendMessage();
    }
  }

  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  };

  sendMessage(e) {
    if (e) {
      e.preventDefault();
    }

    // console.log(this.state.input);
    let messagesRef = firebase
      .database()
      .ref(`messages/${this.props.serverName}-${this.props.channelName}`);

    messagesRef.push({
      content: this.state.input,
      sender: this.state.user.uid,
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });

    this.setState({ input: "" });
  }

  changeInput(e) {
    this.setState({ input: e.target.value });
  }

  getMessages() {
    // console.log("this.props", this.props);
    let messagesRef = firebase
      .database()
      .ref(`messages/${this.props.serverName}-${this.props.channelName}`);

    // messagesRef.off();

    messagesRef
      .orderByChild("timeSent")
      .limitToLast(20)
      .on("value", (snap) => {
        this.setState({ messages: snap.val() });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      // console.log("NEW PROPS");

      this.getMessages();
    }
    this.scrollToBottom({ block: "end", behavior: "smooth" });
  }

  componentDidMount() {
    this.getMessages();
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          // console.log("user", user);
          this.setState({ user });
        } else {
          console.log("NO USER");
        }
      }.bind(this)
    );
  }

  componentWillUnmount() {
    console.log("UNMOUNTING");
    let messagesRef = firebase
      .database()
      .ref(`messages/${this.props.serverName}-${this.props.channelName}`);

    messagesRef.off();
  }

  render() {
    // console.log("this.state", this.state);

    // console.log("this.props", this.props);
    let messageCards = [];

    for (let keys in this.state.messages) {
      let card = <MessageCard key={keys} obj={this.state.messages[keys]} />;
      messageCards.push(card);
    }

    return (
      <div className="chat-component">
        <div className="header">{`#${this.props.channelName} | ${
          this.props.channelSubtitle
        }`}</div>
        <div className="all">
          <div className="chat-window">
            <div className="scrollbar" id="style-7">
              {messageCards}

              <div
                className="fake-div"
                // style={{ float: "left", clear: "both" }}
                ref={(el) => {
                  this.messagesEnd = el;
                }}
              />
            </div>
            <div className="input-and-button">
              <form onSubmit={(e) => this.sendMessage(e)}>
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
          </div>
          <div className="users">
            <Users serverName={this.props.serverName} />
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
