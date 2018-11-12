import React, { Component } from "react";
import "./Servers.scss";

import axios from "axios";

import firebase from "../../firebase";
import Channels from "./components/Channels";
import Users from "./components/Users";

class Servers extends Component {
  constructor() {
    super();

    this.state = {
      currentChannel: "general"
    };

    this.changeChannel = this.changeChannel.bind(this);
  }

  changeChannel(newChannel) {
    console.log("newChannel", newChannel);
    this.setState({ currentChannel: newChannel });
    console.log("this.state", this.state);
  }

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/users.json`)
      .then((res) => {
        // console.log("res", res);
      });
  }

  render() {
    return (
      <div className="server-page">
        <Channels
          serverName={this.props.match.params.id}
          changeChannel={this.changeChannel}
        />
        <div className="middle">
          <h1>Server chat goes here </h1>
          <h1>
            {this.props.match.params.id}: {this.state.currentChannel}
          </h1>
        </div>
        <Users serverName={this.props.match.params.id} />
      </div>
    );
  }
}

export default Servers;
