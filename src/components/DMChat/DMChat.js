import React, { Component } from "react";
import "./DMChat.scss";

import firebase from "../../firebase";

import MessageCard from "../MessageCard/MessageCard";

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

  makeKey() {
    let bothIds = [];
    bothIds.push(this.state.currentUserId);
    bothIds.push(this.props.currentUrlParams);
    // console.log("bothIds", bothIds);

    let key = bothIds.sort().join("-");
    // console.log("key", key);

    this.setState({ dmKey: key });

    this.getMessages();
  }

  scrollToBottom = (options) => {
    this.messagesEnd.scrollIntoView(options);
  };

  onCtrlEnter(e) {
    // console.log("e.keyCode", e.keyCode);

    if (e.keyCode === 13 && e.ctrlKey && this.state.input !== "") {
      console.log("BOTH PRESSED AND NOT EMPTY STRING");
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

    dmsRef.push({
      content: this.state.input,
      sender: this.state.currentUserId,
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });

    this.setState({ input: "" });
    //SET DM in user to most recent message
  }

  getMessages() {
    console.log("GETTING MESSAGES");
    console.log("this.state.dmKey", this.state.dmKey);
    let dmRef = firebase.database().ref(`dms/${this.state.dmKey}`);
    // let dmRef = firebase
    //   .database()
    //   .ref(`dms/Mx107G666sdK7uSolNcfqnH5fkn2-QDHOKB5cHOVzPKL5FDsx9MPXBsW2`);
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
      //   console.log("NEW PROPS");
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
      let card = <MessageCard obj={this.state.messages[keys]} />;
      messageCards.push(card);
    }
    return (
      <div className="dm-chat">
        <div className="header">{`Direct Message to userHere`}</div>
        <div class="scrollbar" id="style-7">
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
