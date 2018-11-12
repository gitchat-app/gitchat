import React, { Component } from "react";
// import "./Chat.scss";

import firebase from "../../firebase";
import MessageCard from "../MessageCard/MessageCard";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: {},
      input: null
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.getMessages = this.getMessages.bind(this);
  }

  sendMessage(e) {
    e.preventDefault();
    // console.log(this.state.input);
    let messagesRef = firebase
      .database()
      .ref(`messages/${this.props.serverName}-${this.props.channelName}`);

    messagesRef.push({
      content: this.state.input,
      sender: "hardCodedTester",
      timeSent: firebase.database.ServerValue.TIMESTAMP
    });

    this.setState({ input: "" });
  }

  changeInput(e) {
    this.setState({ input: e.target.value });
  }

  getMessages() {
    console.log("this.props", this.props);
    let messagesRef = firebase
      .database()
      .ref(`messages/${this.props.serverName}-${this.props.channelName}`);

    messagesRef.off();

    messagesRef
      .orderByChild("timeSent")
      .limitToLast(20)
      .on("value", (snap) => {
        console.log("snap.val() ordered?", snap.val());
        //   let ordered = snap.val()
        this.setState({ messages: snap.val() });
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      // this.setState({ messages: {} });
      // messagesRef.off();
      this.getMessages();
    }
  }

  componentDidMount() {
    this.getMessages();
  }

  componentWillUnmount() {
    console.log("UNMOUNTING");
  }

  render() {
    console.log("this.state", this.state);
    console.log("this.props", this.props);
    let messageCards = [];

    // this.state.messages.map((e, i, arr) => {
    //   let card = <MessageCard />;
    //   messageCards.push(card);
    // });

    for (let keys in this.state.messages) {
      let card = <MessageCard obj={this.state.messages[keys]} />;
      messageCards.push(card);
    }

    return (
      <div>
        <h1>Chat component</h1>

        {messageCards}

        <form onSubmit={(e) => this.sendMessage(e)}>
          <input
            value={this.state.input}
            onChange={(e) => this.changeInput(e)}
            placeholder={`Send a message in ${this.props.channelName}...`}
          />
          <button>Send</button>
        </form>
      </div>
    );
  }
}

export default Chat;
