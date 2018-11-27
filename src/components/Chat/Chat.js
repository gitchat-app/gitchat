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
      messages: {}
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);

    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  };

  sendMessage(input) {
    // if (e) {
    //   e.preventDefault();
    // }

    // console.log(this.state.input);
    let messagesRef = firebase
      .database()
      .ref(`messages/${this.props.serverName}-${this.props.channelName}`);

    messagesRef.push({
      content: input,
      sender: this.state.user.uid,
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

              {/* <div style={{ height: "50px" }} /> */}
              <div
                className="fake-div"
                style={{ position: "relative" }}
                ref={(e) => {
                  this.messagesEnd = e;
                }}
              />
              {/* <div
                className="fake-div"
                style={{ float: "left", clear: "both" }}
                ref={(el) => {
                  this.messagesEnd = el;
                }}
              /> */}
            </div>
            <ChatInput
              sendMessage={this.sendMessage}
              placeholder={`Send a message in #${this.props.channelName}`}
            />
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
