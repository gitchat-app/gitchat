import React, { Component } from "react";
// import "./Channels.scss";

import firebase from "../../../firebase";
import "./Channels.scss";

class Channels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      channels: {}
    };
  }

  componentDidMount() {
    let channelsRef = firebase
      .database()
      .ref(`servers/${this.props.serverName}/channels`);

    channelsRef.once("value").then((snap) => {
      console.log("snap.val()", snap.val());

      this.setState({ channels: snap.val() });
    });
  }
  render() {
    let channelsArr = [];

    for (let key in this.state.channels) {
      let newDiv = (
        <button
          className="channel-card"
          onClick={() => this.props.changeChannel(key)}
        >
          <h2>{key}</h2>
          <subtitle>{this.state.channels[key]}</subtitle>
        </button>
      );

      channelsArr.push(newDiv);
    }
    return (
      <div className="channels">
        <h1>Channels </h1>
        {channelsArr}
      </div>
    );
  }
}

export default Channels;
