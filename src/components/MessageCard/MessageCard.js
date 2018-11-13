import React, { Component } from "react";
import "./MessageCard.scss";

import moment from "moment";

import firebase from "../../firebase";

class MessageCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sender: {
        avatar: null,
        username: "",
        timeSent: 0
      }
    };
  }

  componentDidMount() {
    const usersRef = firebase.database().ref(`users/${this.props.obj.sender}`);

    usersRef.once("value").then((snap) => {
      // console.log("snap.val()", snap.val());

      this.setState({ sender: snap.val() });
    });
  }

  render() {
    // console.log("this.props", this.props);
    // console.log("this.state", this.state);

    let timeHours = moment
      .unix(this.props.obj.timeSent / 1000)
      .format("h:mm A");

    let timestamp = moment
      .unix(this.props.obj.timeSent / 1000)
      .format("MMMM Do - h:mm A");

    return (
      <div className="message-card">
        <div className="left-icon">
          {" "}
          <img src={this.state.sender.avatar} alt="" />
        </div>
        <div className="inside-message">
          <div className="top">
            {this.state.sender.username} at {timeHours}
          </div>
          <div>{this.props.obj.content}</div>
        </div>
      </div>
    );
  }
}

export default MessageCard;
