import React, { Component } from "react";

import "./Chat.scss";

import firebase from "../../firebase";
import MessageCard from "../MessageCard/MessageCard";
import Users from "../Users/Users";
import ChatInput from "../ChatInput/ChatInput";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: {},
      isGuest: null
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);

    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  };

  sendMessage(input) {
    let messagesRef = firebase
      .database()
      .ref(`messages/${this.props.serverName}-${this.props.channelName}`);

    messagesRef.push({
      content: input,
      sender: this.props.user.uid,
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });
  }

  getMessages() {
    // console.log("this.props", this.props);
    let messagesRef = firebase
      .database()
      .ref(`messages/${this.props.serverName}-${this.props.channelName}`);

    // messagesRef.off();

    messagesRef
      .orderByChild("timeSent")
      .limitToLast(200)
      .on("value", async (snap) => {
        await this.setState({ messages: snap.val() });
        setTimeout(() => {
          this.scrollToBottom({ block: "end", behavior: "smooth" });
        }, 500);
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      // console.log("NEW PROPS");

      this.getMessages();
    }
  }

  componentDidMount() {
    this.getMessages();

    setTimeout(() => {
      this.scrollToBottom({ block: "end", behavior: "smooth" });
    }, 1500);
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
    // console.log("this.props.user.uid", this.props.user.uid);
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
                style={{ position: "relative" }}
                ref={(e) => {
                  this.messagesEnd = e;
                }}
              />
            </div>
            <ChatInput
              sendMessage={this.sendMessage}
              placeholder={`Send a message in #${this.props.channelName}`}
            />
          </div>
          <div className="users">
            <Users
              serverName={this.props.serverName}
              currentUser={this.props.user}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
