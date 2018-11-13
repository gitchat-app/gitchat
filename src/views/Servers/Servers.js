import React, { Component } from "react";
import "./Servers.scss";

import axios from "axios";

import firebase from "../../firebase";
import Channels from "./components/Channels";
import Users from "./components/Users";
import Chat from "../../components/Chat/Chat";


class Servers extends Component {
  constructor() {
    super();

    this.state = {
      currentChannelName: "general",
      currentChannelSubtitle: ""
    };

    this.changeChannel = this.changeChannel.bind(this);
  }

  changeChannel(newChannel) {
    console.log("newChannel", newChannel);
    this.setState({
      currentChannelName: newChannel.name,
      currentChannelSubtitle: newChannel.subtitle
    });
    console.log("this.state", this.state);
  }

  // componentDidMount() {
  //   // axios
  //   //   .get(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/users.json`)
  //   //   .then((res) => {
  //   //     // console.log("res", res);
  //   //   });
  // }

  render() {
    return (
      <div className="server-page">
        {/* <ServerNav /> */}
        {/* <div className="header">
          <h1>{this.props.match.params.id}</h1>
          <div> {this.state.currentChannelName.name} </div>
        </div> */}
        <div className="body">
          <div className="left">
            <Channels
              serverName={this.props.match.params.id}
              changeChannel={this.changeChannel}
            />
          </div>
          <div className="middle">
            <Chat
              serverName={this.props.match.params.id}
              channelName={this.state.currentChannelName}
              channelSubtitle={this.state.currentChannelSubtitle}
            />
          </div>
          <div className="right">
            <Users serverName={this.props.match.params.id} />
          </div>
        </div>
      </div>
    );
  }
}

export default Servers;
