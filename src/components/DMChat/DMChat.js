import React, { Component } from "react";
import "./DMChat.scss";

import firebase from "../../firebase";

import MessageCard from "../MessageCard/MessageCard";

//notes: make the url for the dm just direct/idOfRecipient and pull it in via match.params and the current user in the componentDidMount and order them alphabetically and save that to state as the id for dms

//to have a list of dms, consider having openDMs as an object on each member that will always have the most recent message and timestamp on it (so you can see everyone you have a dm with and they can be ordered by how recent they are)
//this will need to update the dm for both user objects with the other user's id

class DMChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dmKey: "",
      input: ""
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.getMessages = this.getMessages.bind(this);

    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.onCtrlEnter = this.onCtrlEnter.bind(this);

    this.makeKey = this.makeKey.bind(this);
  }

  async makeKey() {
    let bothIds = [];
    bothIds.push(this.state.currentUserId);
    bothIds.push(this.props.currentUrlParams);
    // console.log("bothIds", bothIds);

    let key = bothIds.sort().join("-");
    // console.log("key", key);

    await this.setState({ dmKey: key });

    this.getMessages();
  }

  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  };

  onCtrlEnter(e) {
    // console.log("e.keyCode", e.keyCode);

    if (e.keyCode === 13 && e.ctrlKey && this.state.input !== "") {
      //   console.log("BOTH PRESSED AND NOT EMPTY STRING");
      this.sendMessage();
    }
  }

  changeInput(e) {
    this.setState({ input: e.target.value });
  }

  sendMessage(e) {
    if (e) {
      e.preventDefault();
    }
    // console.log(this.state.input);

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
      lastMessage: this.state.input,
      sender: "you",
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });
    recipientRef.set({
      lastMessage: this.state.input,
      sender: this.state.currentUser.username,
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });

    dmsRef.push({
      content: this.state.input,
      sender: this.state.currentUserId,
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });

    this.setState({ input: "" });
    //SET DM in BOTH users to most recent message
  }

  getMessages() {
    //this happens at the end of makeKey()

    // console.log("GETTING MESSAGES");
    // console.log("this.state.dmKey", this.state.dmKey);
    let dmRef = firebase.database().ref(`dms/${this.state.dmKey}`);

    dmRef
      .orderByChild("timeSent")
      .limitToLast(20)
      .on("value", (snap) => {
        // console.log("snap.val()", snap.val());
        this.setState({ messages: snap.val() });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      //   console.log("NEW PROPS IN CHAT");
      //   console.log("this.props", this.props);
      // this.setState

      //needs to change the dmKey in state
      this.makeKey();
    }
    this.scrollToBottom({ block: "end", behavior: "smooth" });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          // console.log("user", user);
          //   console.log("this.props", this.props);
          let userRef = firebase.database().ref(`users/${user.uid}`);

          userRef.once("value", (snap) => {
            // console.log("snap.val()", snap.val());
            this.setState({ currentUser: snap.val() });
          });

          this.setState({ currentUserId: user.uid });
          this.makeKey();
        } else {
          // No user is signed in.
          console.log("NO USER");
        }
      }.bind(this)
    );
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
      <div className="dm-chat">
        <div className="header">{`Direct Message to userHere`}</div>
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
        <div className="input-and-button">
          <form onSubmit={(e) => this.sendMessage(e)}>
            <textarea
              value={this.state.input}
              rows="3"
              onChange={(e) => this.changeInput(e)}
              onKeyDown={this.onCtrlEnter}
              placeholder={`Send a message to ${this.props.channelName}...`}
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
    );
  }
}

export default DMChat;
