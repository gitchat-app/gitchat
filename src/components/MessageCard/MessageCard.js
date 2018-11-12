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
    console.log("this.props", this.props);
    console.log("this.state", this.state);

    // console.log(
    //   "moment.unix(this.state.sender.timeSent)",
    //   moment.unix(this.state.sender.timeSent)
    // );

    console.log("this.props.obj.timeSent", this.props.obj.timeSent);
    return (
      <div className="message-card">
        <div className="left-icon">
          {" "}
          <img src={this.state.sender.avatar} alt="" />
        </div>
        <div className="inside-message">
          <div>
            {moment
              .unix(this.props.obj.timeSent / 1000)
              .format("dddd, MMMM Do, YYYY h:mm:ss A")}
          </div>
          <div className="username">{this.state.sender.username}</div>
          <div>{this.props.obj.content}</div>
        </div>
      </div>
    );
  }
}

export default MessageCard;
