import React, { Component } from "react";
import "./DMChat.scss";
import firebase from "../../firebase";
import MessageCard from "../MessageCard/MessageCard";
import ChatInput from "../ChatInput/ChatInput";

class DMChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dmKey: ""
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.getMessages = this.getMessages.bind(this);

    this.scrollToBottom = this.scrollToBottom.bind(this);

    this.makeKey = this.makeKey.bind(this);
  }

  async makeKey() {
    let bothIds = [];
    bothIds.push(this.state.currentUserId);
    bothIds.push(this.props.currentUrlParams);

    let key = bothIds.sort().join("-");

    await this.setState({ dmKey: key });

    this.getMessages();
  }

  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  };

  onCtrlEnter(e) {
    if (e.keyCode === 13 && e.ctrlKey && this.state.input !== "") {
      //   console.log("BOTH PRESSED AND NOT EMPTY STRING");
      this.sendMessage();
    }
  }

  sendMessage(input) {
    // if (e) {
    //   e.preventDefault();
    // }

    let dmsRef = firebase.database().ref(`dms/${this.state.dmKey}`);

    let senderRef = firebase
      .database()
      .ref(
        `users/${this.state.currentUserId}/dms/${this.props.currentUrlParams}`
      );
    let recipientRef = firebase
      .database()
      .ref(
        `users/${this.props.currentUrlParams}/dms/${this.state.currentUserId}`
      );

    senderRef.set({
      lastMessage: input,
      sender: "you",
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });
    recipientRef.set({
      lastMessage: input,
      sender: this.state.currentUser.username,
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });

    dmsRef.push({
      content: input,
      sender: this.state.currentUserId,
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });
    this.setState({ input: "" });
  }

  getMessages() {
    //this happens at the end of makeKey()

    let dmRef = firebase.database().ref(`dms/${this.state.dmKey}`);

    dmRef
      .orderByChild("timeSent")
      .limitToLast(20)
      .on("value", (snap) => {
        this.setState({ messages: snap.val() });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.makeKey();
      firebase
        .database()
        .ref(`users/${this.props.currentUrlParams}`)
        .once("value", (snap) => {
          this.setState({ recipientUsername: snap.val().username });
        });
    }
    this.scrollToBottom({ block: "end", behavior: "smooth" });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          let userRef = firebase.database().ref(`users/${user.uid}`);

          userRef.once("value", (snap) => {
            this.setState({ currentUser: snap.val() });
          });

          this.setState({ currentUserId: user.uid });
          this.makeKey();
        } else {
          console.log("NO USER");
        }
      }.bind(this)
    );

    firebase
      .database()
      .ref(`users/${this.props.currentUrlParams}`)
      .once("value", (snap) => {
        this.setState({ recipientUsername: snap.val().username });
      });

    setTimeout(() => {
      this.scrollToBottom({ block: "end", behavior: "smooth" });
    }, 1500);
  }

  render() {
    let messageCards = [];

    for (let keys in this.state.messages) {
      let card = <MessageCard key={keys} obj={this.state.messages[keys]} />;
      messageCards.push(card);
    }
    return (
      <div className="dm-chat">
        <div className="header">{`Direct Message to ${
          this.state.recipientUsername
        }`}</div>
        <div className="chat-window">
          <div className="scrollbar" id="style-7">
            {messageCards}

            <div
              className="fake-div"
              style={{ float: "left", clear: "both" }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            />
          </div>

          <ChatInput
            sendMessage={this.sendMessage}
            placeholder={`Send a message to ${this.state.recipientUsername}`}
          />
        </div>
      </div>
    );
  }
}

export default DMChat;
