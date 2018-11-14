import React, { Component } from "react";
import "./DirectMessages.scss";

// import Chat from "../../components/Chat/Chat";

import MessageCard from "../../components/MessageCard/MessageCard";

import firebase from "../../firebase";

class DirectMessages extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.sendMessage = this.sendMessage.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }

  changeInput(e) {
    this.setState({ input: e.target.value });
  }

  sendMessage(e) {
    if (e) {
      e.preventDefault();
    }

    // console.log(this.state.input);
    let dmsRef = firebase
      .database()
      .ref(`dms/${this.state.user.uid}-${this.state.user.uid}`);

    dmsRef.push({
      content: this.state.input,
      sender: this.state.user.uid,
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });

    this.setState({ input: "" });
  }

  componentDidMount() {
    let dmRef = firebase.database().ref(`dms/${this.props.match.params.id}`);

    dmRef.once("value").then((snap) => {
      console.log("snap.val()", snap.val());
      this.setState({ dm: snap.val() });
    });

    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          console.log("user", user);
          this.setState({ user });
        } else {
          // No user is signed in.
        }
      }.bind(this)
    );
  }

  render() {
    console.log("this.state", this.state);

    // console.log("this.props", this.props);
    let messageCards = [];

    for (let keys in this.state.messages) {
      let card = <MessageCard obj={this.state.messages[keys]} />;
      messageCards.push(card);
    }
    return (
      <div className="dm-component">
        {/* <Chat
          serverName={this.props.match.params.id}
          // channelName={this.state.currentChannelName}
          // channelSubtitle={this.state.currentChannelSubtitle}
        /> */}

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
    );
  }
}

export default DirectMessages;
